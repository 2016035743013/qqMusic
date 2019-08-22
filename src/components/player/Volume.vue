<template>
  <div class="music-volume">
    <div class="volume-icons">
      <i class="iconfont icon-volume-x" v-if="mutedFlag == 0" @click="isMuted(1)"></i>
      <i class="iconfont icon-volume-1" v-else @click="isMuted(0)"></i>
    </div>
    <div class="volume-container">
      <div class="volume-progress"></div>
      <div class="volume-bar"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "volume",
  data() {
    return {
      mutedFlag: 0, //音量图标控制
      tempMuted: 0,//暂存音量
    };
  },
  computed: {
    volume() {
      return this.$store.state.audio.volume;
    }
  },
  methods: {
    isMuted(val) {
      this.mutedFlag = val;
      if(val == 1) {
        this.$store.state.audio.volume = this.tempMuted;
        this.setStyle(this.tempMuted * this.$('.volume-container').width())
      } else {
        this.$store.state.audio.volume = 0;
        this.setStyle(0);
      }
    },
    // 初始化
    init() {
      this.tempMuted = this.volume;
      this.mutedFlag = this.volume;
      let moveWidth = this.mutedFlag * this.$(".volume-container").width();
      this.setStyle(moveWidth);

      this.$(".volume-bar").mousedown(event => {
        this.$(document).mousemove(event => {
          this.$(".volume-bar");
          this.changeVolume(event);
        });
      });
      this.$(document).mouseup(() => {
        this.$(document).mousemove = null;
      });

      this.$(".volume-container").click(event => {
        this.changeVolume(event);
      });
    },
    // 改变音量
    changeVolume(event) {
      let containerDom = this.$(".volume-container");
      let pageX = event.pageX || event.clientX;
      let containerX = containerDom.offset().left;
      let volume = pageX - containerX;
      let containerWidth = containerDom.width();
      if (volume <= 0) {
        volume = 0;
      } else if (volume >= containerWidth) {
        volume = containerWidth;
      }
      this.setStyle(volume);

      let audioVolume = (volume / containerWidth).toFixed(1);
      this.mutedFlag = audioVolume;
      this.tempMuted = audioVolume;
      this.$store.state.audio.volume = audioVolume;
    },
    setStyle(moveWidth) {
      this.$(".volume-bar").css({
        left: moveWidth - this.$(".volume-bar").width() / 2 + "px"
      });
      this.$(".volume-progress").css({
        width: moveWidth + "px"
      });
    }
  },
  mounted() {
    this.$(() => {
      this.init();
    });
  }
};
</script>
<style scoped>
@import "../../../static/css/player/Volume.css";
</style>