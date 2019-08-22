(function(doc, win, designWidth) {
    var rootDom = doc.body || doc.documentElement;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'; //获取屏幕宽度是否改变
    var recalc = function() {
        var clientWidth = rootDom.clientWidth; //获取屏幕宽度
        if (!clientWidth) {
            return;
        }
        clientWidth = 1400 * 0.9;
        rootDom.style.fontSize = 32 * (clientWidth / designWidth) + 'px';
        doc.documentElement.style.fontSize = 32 * (clientWidth / designWidth) + 'px'; //文档的body根据屏幕大小与设计稿的比例进行变化，方便子节点试用rem方式进行屏幕调配
    };
    if (!doc.addEventListener) {
        return;
    }
    recalc();
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false); //屏幕宽度改变时执行一次屏幕适配
}(document, window, 1920));

function getStyle(obj, attr) {
    if (obj.currentStyle) { //针对ie获取非行间样式
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr]; //针对谷歌，火狐获取非行间样式
    }
}

function css(obj, name, value) {
    if (arguments.length == 2) { //arguments参数数组，当参数为2时表示获取行间样式                
        return getStyle(obj, name);
    } else {
        if (arguments.length == 3) { //arguments参数数组，当参数为3时表示设置样式                   
            return obj.style[name] = value;
        }
    }
}