import axios from "axios";


const Request = axios.create({
    baseURL:'http://localhost:9090',
    timeout:5000
})

Request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // 在浏览器的 Session Storage 中拿到 token 值
    config.headers.Authorization = window.localStorage.getItem("token");
    return config;
})

Request.interceptors.response.use(response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        // if (typeof res === 'string') {
        //     res = res ? JSON.parse(res) : res
        // }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default Request
