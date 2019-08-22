<template>
  <div id="app">
    <!-- <Music /> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import Music from "./components/Music";
export default {
  name: "App",
  components: {
    Music
  },
  methods: {
    // 监听屏幕的改变
    listenWindowResize() {
      let winHeight = this.$(window).height();
      this.$('#app').height(winHeight);
    },
  },
  mounted() {
    this.listenWindowResize();
    this.$(window).resize(() => {
      this.listenWindowResize();
    });
  }
};
</script>

<style>
@import "../static/css/App.css";

</style>
