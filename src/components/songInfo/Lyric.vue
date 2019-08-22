<template>
  <div class="lyric">
    <vueScroll ref="vs" :ops="ops">
      <div class="lyric-word"></div>
      <div
        :class="[index == activeIndex ? 'lyric-word-active' : '']"
        class="lyric-word"
        v-for="(item, index) in lyricWords"
        :key="index"
      >{{item}}</div>
    </vueScroll>
  </div>
</template>
<script>
export default {
  name: "lyric",
  data() {
    return {
      lyricTime: [], //存放时间
      lyricWords: [], //存放歌词
      currentTime: "", //音频播放进度
      activeIndex: 0, //歌词高亮下标
      ops: {
        vuescroll: {
          mode: "slide",
          sizeStrategy: "percent",
          detectResize: true,
          zooming: false
        },
        scrollPanel: {
          scrollingX: false,
          scrollingY: true
        },
        bar: {
          opacity: 0
        }
      }
    };
  },
  props: ["lyric"],
  methods: {
    listenAudioTime() {
      this.$store.state.audio.addEventListener("timeupdate", () => {
        this.currentTime = this.formatTime(this.$store.state.audio.currentTime);
      });
    },
    // 格式化时间
    formatTime(time) {
      let min = Math.floor(time / 60);
      let second = Math.floor((time - min * 60) % 60);
      min = min >= 10 ? min : "0" + min;
      second = second >= 10 ? second : "0" + second;
      return min + ":" + second;
    }
  },
  watch: {
    lyric(val, oldVal) {
      this.lyricWords = [];
      this.lyricTime = [];
      if(val == '') {
        return;
      }
      let word = "";
      let time = "";
      val.forEach(element => {
        word = element.replace(/\[\d\d\:\d\d\.\d+\]/g, "");
        time = element.match(/\[\d\d\:\d\d\.\d+\]/g);
        if (time) {
          // this.lyricTime.push(time[0]);
          this.lyricTime.push(time.join(""));
          this.lyricWords.push(word);
        }
      });
      this.listenAudioTime();
    },
    // 监听播放进行进行歌词的滚动
    currentTime(timeVal, oldVal) {
      const that = this;
      this.lyricTime.forEach((val, key) => {
        // console.log(val);
        if (val.substring(1, 6) == timeVal) {
          that.activeIndex = key;
          this.$refs["vs"].scrollTo(
            {
              y: that.$(".lyric-word").height() * key
            },
            500
          );
        }
      });
    }
  },
  mounted() {}
};
</script>
<style scoped>
@import "../../../static/css/songInfo/Lyric.css";
</style>