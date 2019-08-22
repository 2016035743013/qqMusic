import Vue from 'vue'
import VueRouter from 'vue-router'
import Music from '../components/Music'
import Search from '../components/search/Search'
Vue.use(VueRouter)

let routes = [
    {
        path: '/',
        component: Music
    },
    {
        path: '/search',
        component: Search
    }
]
let router = new VueRouter({
    routes: routes,
    mode: 'history'
})
export {
    router
};