function toolFormatTime(time) {
    // console.log(time);
    let min = Math.floor(time / 1000 / 60);
    let second = Math.ceil((time - min * 60 * 1000) / 1000);
    min = min >= 10 ? min : '0' + min ;
    second = second >= 10 ? second : '0' + second;
    return min + ' : ' + second;
}
export {
    toolFormatTime
}