import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        songInfo: '',//歌曲信息
        songId: '',//歌曲id
        audio: '', //音频标签
        btnIndex: -1,//播放和暂停按钮的切换
        songIndex: 0,//播放歌曲的下标
        playList: [],//播放列表信息
    },
    getters: {
        getSingerInfo(state) {
            return state.singerInfo;
        },
        getSongId(state) {
            return state.songId;
        },
        getSongIndex(state) {
            return state.songIndex;
        }
    },
    mutations: {
        setSongId(state, id) {
            state.songId = id;
        },
        setAudio(state, obj) {
            state.audio = obj;
        },
        audioStop(state) {
            state.audio.pause();
        },
        audioPlay(state) {
            // console.log();
            if(state.songId == '') {
                return;
            }
            state.audio.addEventListener('canplay', () => {
                state.audio.play();
            })
        },
        setBtnIndex(state, index) {
            state.btnIndex = index;
        },
        setPlayList(state, obj) {
            state.playList = obj;
        },
        setSongInfo(state, obj) {
            state.songInfo = obj;
        },
        setSongIndex(state, index) {
            state.songIndex = index;
        }
    }
})
export {
    store
}
