// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import $ from 'jquery'
import {store} from './store/index'
import {router} from './router/index'
import scrollBar from 'cjhcj-scroll'
import cjhcjAudio from 'cjhcj-audio'
import vueScroll from 'vuescroll'
import {Checkbox, CheckboxGroup, MessageBox, Message, Input, Button, Loading, Pagination } from 'element-ui'
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.component(Input.name, Input);
Vue.component(Checkbox.name, Checkbox);
Vue.component(CheckboxGroup.name, CheckboxGroup);
Vue.component(Button.name, Button);
Vue.component(Pagination.name, Pagination);
Vue.component('cjhcjAudio', cjhcjAudio);
Vue.component('vueScroll', vueScroll)
import './common/rem.js'
Vue.component('scrollBar', scrollBar);
Vue.prototype.$ = $;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
