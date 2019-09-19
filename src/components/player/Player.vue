<template>
  <div class="player">
    <audio id="audio" preload="auto"></audio>
    <!-- <cjhcjAudio :audio='audio'></cjhcjAudio> -->
    <div class="left-btns">
      <i class="iconfont icon-prev" @click="preSong"></i>
      <i class="iconfont icon-bofang" v-if="toggleIndex == -1" @click="playOrStop(false)"></i>
      <i class="iconfont icon-stop" v-else @click="playOrStop(true)"></i>
      <i class="iconfont icon-xiayiqu" @click="nextSong"></i>
    </div>
    <div class="center-audio">
      <div class="audio-info">
        <span v-if="songInfo">
          {{songInfo.name}} - {{songInfo.ar[0].name}}
          <span
            v-if="songInfo.ar.length > 1"
          >/ {{songInfo.ar[1].name}}</span>
        </span>
        <span v-else></span>
        <span>{{formatTime(playProgress)}} / {{formatTime(duration)}}</span>
      </div>
      <div class="audio-bar">
        <cjhcjAudio :audioCss="audioCss" :audio="audio" @songEnded="songEnded" @getTime="getTime"></cjhcjAudio>
      </div>
    </div>
    <div class="right-btns">
      <div class="play-methods">
        <el-tooltip
          v-if="methods == 0"
          class="item"
          effect="dark"
          content="顺序播放"
          placement="top"
        >
          <i class="iconfont icon-xunhuan" @click="changeMethod(1)"></i>
        </el-tooltip>

        <el-tooltip
          v-else-if="methods == 1"
          class="item"
          effect="dark"
          content="单曲循环"
          placement="top"
        >
          <i class="iconfont icon-danquxunhuan1" @click="changeMethod(2)"></i>
        </el-tooltip>
        <el-tooltip v-else class="item" effect="dark" content="随机播放" placement="top">
          <i class="iconfont icon-suiji" @click="changeMethod(0)"></i>
        </el-tooltip>
      </div>
      <!-- <div class="downLoad">
        <i class="iconfont icon-xiazai"></i>
      </div>-->
      <div class="music-volume">
        <Volume />
      </div>
    </div>
  </div>
</template>
<script>
import Volume from "./Volume";
export default {
  name: "player",
  data() {
    return {
      audio: "", //音频元素
      duration: 0, //播放时长
      playProgress: 0, //播放进度
      audioCss: {
        lineContainer: {
          height: "4px",
          backgroundColor: "rgba(255,255,255,0.3)"
        }, //进度容器的高度和颜色
        point: {
          width: "12px",
          height: "12px",
          backgroundColor: "white"
        }, //进度条滑动点的大小和颜色
        preloadBar: {
          backgroundColor: "rgba(255,255,255,0.5)"
        }, //预加载的进度条的颜色
        currentTimeBar: {
          backgroundColor: "rgba(255,255,255,1)"
        } //滚动进度条的颜色
      },
      methods: 0 //播放方式
    };
  },
  computed: {
    toggleIndex() {
      return this.$store.state.btnIndex;
    },
    songInfo() {
      return this.$store.state.songInfo;
    }
  },
  methods: {
    // 播放或者暂停
    playOrStop(val) {
      if (val) {
        this.$store.commit("setBtnIndex", -1);
        this.$store.commit("audioStop");
      } else {
        this.$store.commit("setBtnIndex", 0);
        this.$store.state.audio.play();
      }
    },
    // 上一首
    preSong() {
      if (this.$store.state.playList.length <= 1) {
        return;
      }
      let index;
      if (this.methods == 1 || this.methods == 0) {
        index = this.$store.getters.getSongIndex - 1;
        if (index < 0) {
          index = this.$store.state.playList.length - 1;
        }
      } else if (this.methods == 2) {
        while (true) {
          index = Math.floor(Math.random() * this.$store.state.playList.length);
          if (index != this.$store.state.songIndex) {
            break;
          }
        }
      }
      this.$store.commit("setSongIndex", index);
      this.changeSong(index);
    },
    // 下一首
    nextSong() {
      if (this.$store.state.playList.length <= 1) {
        return;
      }
      let index;
      if (this.methods == 1 || this.methods == 0) {
        index = this.$store.getters.getSongIndex + 1;
        if (index > this.$store.state.playList.length - 1) {
          index = 0;
        }
      } else if (this.methods == 2) {
        while (true) {
          index = Math.floor(Math.random() * this.$store.state.playList.length);
          if (index != this.$store.state.songIndex) {
            break;
          }
        }
      }
      this.$store.commit("setSongIndex", index);
      this.changeSong(index);
    },

    changeSong(index) {
      this.$store.commit("setSongInfo", this.$store.state.playList[index]);
      this.$store.commit("setSongId", this.$store.state.playList[index].id);
      this.$store.commit("setBtnIndex", 0);
      this.$store.commit("audioPlay");
    },
    // 改变播放方式
    changeMethod(val) {
      this.methods = val;
      if (val == 1) {
        this.audio.loop = true;
      } else {
        this.audio.loop = false;
      }
    },
    // 音乐播放结束
    songEnded() {
      if (this.methods == 1) {
        // console.log('循环播放');
      } else {
        this.nextSong();
      }
    },
    // 实时获取音乐的播放进度
    getTime(obj) {
      this.duration = obj.duration;
      this.playProgress = obj.curTime;
      if (this.playProgress == 0) {
        this.duration = 0;
      }
    },
    formatTime(time) {
      let min = Math.floor(time / 60);
      let second = Math.ceil(time - 60 * min);
      min = min >= 10 ? min : "0" + min;
      second = second >= 10 ? second : "0" + second;
      return min + " : " + second;
    }
  },
  mounted() {
    let audio = this.$("#audio")[0];
    this.audio = audio;
    this.$store.commit("setAudio", audio);
    this.$store.commit("setBtnIndex", -1);
  },
  props: {
    musicSrc: String
  },
  watch: {
    musicSrc(val, oldVal) {
      this.audio.src = val;
    }
  },
  components: {
    Volume
  }
};
</script>
<style  scoped>
@import "../../../static/css/player/Player.css";
</style>