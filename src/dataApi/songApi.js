import http from './http'
function getSingerPlayList(songId) {
    if(!songId) {
        songId = 5771;
    }
    let option = {
        data: {
            id: songId
        },
        url: '/song/artist'
    }
    return http.get(option);
}
function searchSingerByKeyword(keyword, pageNum) {
    let option = {
        data: {
            type: 'singer',
            keyword: keyword,
            pageSize: 20,
            page: pageNum - 1
        },
        url: '/search'
    }
    return http.get(option);
}
function getLyric(id) {
    let option = {
        url: `/lrc?id=${id}`
    };
    return http.get(option);
}
export {
    getSingerPlayList,
    getLyric,
    searchSingerByKeyword
}