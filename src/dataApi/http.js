import $ from 'jquery'
import config from '../tool/config'
function ajax(option, another) {
    
    return new Promise((resolve, rejected) => {
        $.ajax({
            url: config.baseUrl + option.url,
            type: option.type,
            data: option.data,
            async: option.async,
            headers: {
                contentType: 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                resolve(res);
            },
            error: (err) => {
                rejected(err)
            }

        })
    });
}

function get(option, another) {
    option.type = 'get';
    return ajax(option, another)
}
export default {
    get,
}