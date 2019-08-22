<template>
    <div class="song-info">
        <div class="music-image" v-if="songInfo">
            <img :src="songInfo.al.picUrl" alt="">
        </div>
        <div class="music-image" v-else>
            <img src="../../assets/record.png" alt="">
        </div>
        <div class="music-info" v-if="songInfo">
            <span>歌曲名: {{songInfo.name}}</span>
            <span>歌手名: {{songInfo.ar[0].name}} <span v-if="songInfo.ar.length > 1"> / {{songInfo.ar[1].name}}</span></span>
            <span>专辑名: {{songInfo.al.name}}</span>
        </div>
        <div class="music-lyric">
            <Lyric :lyric = 'lyric'></Lyric>
        </div>
    </div>
</template>
<script>
import Lyric from './Lyric'
export default {
    name: 'songInfo',
    data() {
        return {

        }
    },
    props: [
        'lyric'
    ],
    computed: {
        songInfo() {
            return this.$store.state.songInfo;
        }
    },
    components: {
        Lyric
    }
}
</script>
<style  scoped>
@import '../../../static/css/songInfo/SongInfo.css';
</style>