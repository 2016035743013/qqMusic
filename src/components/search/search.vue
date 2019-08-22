<template>
  <div class="search" >
    <vueScroll :ops="opt">
      <div class="search-input">
        <img src="../../assets/search/searchBg.png" alt />
        <div class="input-label">
          <input type="text" v-model="singerName" @keyup.enter="searchSinger" placeholder="请输入歌手名" />
          <i class="iconfont icon-sousuo" @click="searchSinger"></i>
        </div>
      </div>
      <div class="search-result">
        <div
          class="search-item"
          @click="singerPlay(item.id)"
          v-for="(item, index ) in searchData"
          :key="index"
        >
          <img :src="item.img1v1Url" alt />
          {{item.name}}
        </div>
        <div class="search-pagination" v-if="searchCount != 0">
          <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="20"
            :total="searchCount"
          ></el-pagination>
        </div>
      </div>
    </vueScroll>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import Vue from "vue";
import { searchSingerByKeyword } from "../../dataApi/songApi";
export default {
  name: "search",
  data() {
    return {
      singerName: "", //歌手名
      opt: {
        vueScroll: {
          detectResize: true
        },
        bar: {
          background: "#c1c1c1"
        }
      },
      searchData: "", //搜索获得数据
      searchCount: 0 //搜索的条数
    };
  },
  methods: {
    // 搜索歌手
    searchSinger() {
      let keyword = this.singerName;
      if (keyword == "") {
        this.$alert("请输入歌手名", "提示", {
          type: "warning",
          callback: action => {}
        });
        return;
      }
      this.getSearchResult(1);
    },
    // 获得搜索的结果
    getSearchResult(pageNum) {
      this.loadingInstance = Loading.service({ fullscreen: true, text: '拼命加载中' });
      this.searchData = [];
      searchSingerByKeyword(this.singerName, pageNum).then(res => {
        let data = res.data.artists;
        let count = res.data.artistCount;
        this.searchCount = count;
        if (count <= 0) {
          this.$alert("您所搜索的歌手不存在，请换个搜索词！！！", "提示", {
            type: "warning",
            callback: action => {}
          });
          Vue.nextTick(() => {
             this.loadingInstance.close();
          });
          return;
        }
        Vue.nextTick(() => {
           this.loadingInstance.close();
            // console.log(this.loading);
        });
        this.searchData = data;
        
      });
    },
    // 点击分页处罚过事件
    handleCurrentChange(val) {
      this.getSearchResult(val);
    },
    // 跳转到播放器页面
    singerPlay(songId) {
      // console.log(songId);
      this.$router.push({ path: "/", query: { songId: songId } });
    }
  },
  mounted() {
    let keyword = this.$route.query.singer;
    this.singerName = keyword;
    this.getSearchResult(1);
  }
};
</script>
<style scoped>
@import "../../../static/css/search/search.css";
</style>