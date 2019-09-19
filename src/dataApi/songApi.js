import http from './http'
function getSingerPlayList(songId) {
    if(!songId) {
        songId = 5771;
    }
    let option = {
        data: {
            id: songId
        },
        url: '/artists'
    }
    return http.get(option);
}
function searchSingerByKeyword(keyword, pageNum) {
    let option = {
        data: {
            type: 100,
            keywords: keyword,
            limit: 20,
            offset: pageNum - 1
        },
        url: '/search'
    }
    return http.get(option);
}
function getLyric(id) {
    let option = {
        url: `/lyric?id=${id}`
    };
    return http.get(option);
}
function getPlayUrl(id) {
    let option = {
        url: `/song/url?id=${id}`
    };
    return http.get(option);
}
export {
    getSingerPlayList,
    getLyric,
    getPlayUrl,
    searchSingerByKeyword
}