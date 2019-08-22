<template>
  <div class="play-list">
    <div class="list-top">
      <div class="list-delete" @click="deleteItem">
        <i class="iconfont icon-shanchu"></i>&nbsp; 删除
      </div>
      <div class="list-clear" @click="clearList">
        <i class="iconfont icon-qingkong"></i>&nbsp; 清空列表
      </div>
      <div class="music-input">
        <input @keyup.enter="searchSinger" v-model="singerName" placeholder="请输入歌手名" type="text" />
        <el-button @click="searchSinger" plain style="background: rgba(0,0,0,0); color: white;">搜索</el-button>
      </div>
    </div>
    <div class="list-items">
      <vueScroll :ops="ops">
        <div class="list-item-title">
          <span>
            <el-checkbox :indeterminate="indeterminate" v-model="isSelectAll" @change="checkAll"></el-checkbox>
          </span>
          <span>歌曲</span>
          <span>歌手</span>
          <span>时长</span>
        </div>
        <div
          @mouseover="toggleBtn(index)"
          @mouseleave="toggleBtn(-1)"
          class="list-item"
          v-for="(item, index) in playList"
          :key="index"
        >
          <span>
            <el-checkbox :key="index" v-model="selectItems[index]" @change="isSelect(index)"></el-checkbox>
          </span>
          <span>
            {{index + 1}} &nbsp;{{item.name}}
            <div class="item-btn" v-if="showIndex == index">
              <i class="iconfont icon-bofang1" @click="playOrStop(index, item.id)"></i>
            </div>
          </span>
          <!-- <span>{{item.ar[0].name}}</span> -->
          <span>
            {{item.ar[0].name}}
            <span v-if="item.ar.length > 1">/ {{item.ar[1].name}}</span>
          </span>
          <span>
            <div class="item-delete" v-if="showIndex == index">
              <i class="iconfont icon-shanchu" @click="deleteOne(index)"></i>
            </div>
            <span v-else>{{formatTime(item.dt)}}</span>
          </span>
        </div>
      </vueScroll>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import Vue from "vue";
import { getSingerPlayList } from "../../dataApi/songApi";
import { toolFormatTime } from "../../tool/tools";
export default {
  name: "playList",
  data() {
    return {
      ops: {
        vuescroll: {
          mode: "native",
          sizeStrategy: "percent",
          detectResize: true
        },
        bar: {
          background: "rgba(255,255,255,0.5)",
          keepShow: false
        }
      },
      // playList: null, //存放歌曲信息
      showIndex: -1,
      playIndex: -1, //播放的歌曲下标
      isSelectAll: false, //是否全选
      selectItems: [], //所有子复选框是否选中的存储数组
      indeterminate: false, //全选按钮是否部分选中所要表现的样式
      singerName: "", //歌手名
      loadingInstance: null,//加载过度
    };
  },
  computed: {
    btnIndex() {
      return this.$store.state.btnIndex; //播放和暂停按钮的切换
    },
    playList() {
      return this.$store.state.playList;
    }
  },
  methods: {
    //   获取歌曲数据
    getPlayListData(songId) {
      this.loadingInstance = Loading.service({
        fullscreen: true,
        text: "拼命加载中"
      });
      this.$store.commit("setPlayList", []);
      this.$store.commit("setSongInfo", "");
      this.$store.commit("setSongId", "");
      getSingerPlayList(songId).then(res => {
        let songList = res.data;
        if (songList.length <= 0) {
          this.$alert("无歌曲播放？", "提示", {
            type: "warning",
            callback: action => {}
          });
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            this.loadingInstance.close();
          });
          return;
        }
        this.$store.commit("setPlayList", songList);
        this.$store.commit("setSongInfo", songList[0]);
        this.$store.commit("setSongId", songList[0].id);

        this.playList.map((val, index) => {
          this.selectItems[index] = false;
        });
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close();
        });
      });
    },
    // 格式化时间
    formatTime(time) {
      return toolFormatTime(time);
    },
    // 按钮切换显示
    toggleBtn(index) {
      this.showIndex = index;
    },
    playOrStop(index, songId) {
      this.showIndex = index;
      this.$store.commit("setSongIndex", index);
      if (songId == -1) {
        this.$store.commit("setBtnIndex", -1);
        this.$store.commit("audioStop");
      } else {
        this.$store.commit("setBtnIndex", index);
        this.$store.commit("audioPlay");
        this.$store.state.audio.play();
        this.$store.commit("setSongInfo", this.playList[index]);
        this.$store.commit("setSongId", songId);
      }
    },
    // 监听全选按钮
    checkAll(val) {
      this.isSelectAll = val;
      if (val) {
        this.selectItems.map((val, index) => {
          this.selectItems[index] = true;
        });
        this.indeterminate = false;
        // this.selectItems = []
      } else {
        this.selectItems.map((val, index) => {
          this.selectItems[index] = false;
        });
      }
    },
    isSelect(index) {
      let temp = this.selectItems.filter((val, index) => {
        if (val) {
          return true;
        }
      });
      if (temp.length > 0 && temp.length < this.selectItems.length) {
        this.indeterminate = true;
        this.isSelectAll = false;
      } else if (temp.length == this.selectItems.length) {
        this.indeterminate = false;
        this.isSelectAll = true;
      } else {
        this.indeterminate = false;
        this.isSelectAll = false;
      }
    },
    // 清空列表
    clearList() {
      this.$confirm("确定要清空列表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.commit("setPlayList", []);
          this.indeterminate = false;
          this.isSelectAll = false;

          this.$store.commit("setSongInfo", "");
          this.$store.state.audio.src = "";
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除所选的项目
    deleteItem(isDeleteOne, songIndex) {
      if (
        !this.indeterminate &&
        !this.isSelectAll &&
        isDeleteOne != "deleteOne"
      ) {
        this.$alert("请选择要操作的歌曲?", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: action => {}
        });
      } else {
        this.$confirm("确定要删除歌曲?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let songIndex = this.$store.state.songIndex;
            this.selectItems.filter((val, index) => {
              if (val) {
                if (songIndex > index) {
                  songIndex--;
                }
              }
            });
            this.$store.commit("setSongIndex", songIndex);

            // 重新赋值playlist
            let temp = this.playList.filter((val, index) => {
              if (!this.selectItems[index]) {
                return this.playList[index];
              }
            });
            this.selectItems = [];
            temp.map((val, index) => {
              this.selectItems[index] = false;
            });
            this.$store.commit("setPlayList", temp);
            this.isSelectAll = false;
            this.indeterminate = false;

            if (this.playList.length == 0) {
              this.clearList();
            } else {
              this.changeSong(songIndex);
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
            if (isDeleteOne == "deleteOne") {
              Vue.set(this.selectItems, songIndex, false);
            }
          });
      }
    },
    changeSong(index) {
      this.$store.commit("setSongInfo", this.$store.state.playList[index]);
      this.$store.commit("setSongId", this.$store.state.playList[index].id);
      this.$store.commit("setBtnIndex", 0);
      this.$store.state.audio.play();
    },
    // 单个删除
    deleteOne(index) {
      Vue.set(this.selectItems, index, true);
      this.deleteItem("deleteOne", index);
    },
    // 搜索歌手
    searchSinger() {
      if (this.singerName == "") {
        // this.$alert('请输入')
        this.$alert("请输入歌手名", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: action => {}
        });
      } else {
        this.$router.push({
          path: "/search",
          query: { singer: this.singerName }
        });
      }
    }
  },
  mounted() {
    let songId = this.$route.query.songId;
    this.getPlayListData(songId);
  }
};
</script>
<style  scoped>
@import "../../../static/css/playList/PlayList.css";
</style>