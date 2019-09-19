<template>
  <div class="music-container">
    <img v-if="songInfo" :src="songInfo.al.picUrl" alt />
    <div class="music-mark"></div>
    <div class="music-content">
      <Player :musicSrc="musicSrc" />
      <PlayList />
      <SongInfo :lyric="lyric" />
    </div>
  </div>
</template>
<script>
import Player from "./player/Player";
import PlayList from "./playList/PlayList";
import SongInfo from "./songInfo/SongInfo";
import Vue from 'vue'
import { getMusicUrl, getPlayUrl, getLyric } from "../dataApi/songApi";
import config from "../tool/config";
export default {
  name: "music",
  data() {
    return {
      musicSrc: "", //歌曲链接
      lyric: "", //歌词
    };
  },
  methods: {},
  computed: {
    songId() {
      return this.$store.getters.getSongId;
    },
    songInfo() {
      return this.$store.state.songInfo;
    }
  },
  watch: {
    songId(val, oldVal) {
      if(val == oldVal) {
        return;
      }
      this.loading = true;
      getPlayUrl(val).then(res => {
        this.musicSrc = res.data[0].url;
      })
      getLyric(val).then(res => {
        this.lyric = res.lrc.lyric.split("\n");
      });
    },
    songInfo(val, oldVal) {
      if (val == "") {
        this.lyric = "";
      }
    }
  },
  mounted() {},
  components: {
    Player,
    PlayList,
    SongInfo
  }
};
</script>
<style  scoped>
@import "../../static/css/Music.css";
</style>