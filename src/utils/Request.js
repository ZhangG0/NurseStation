import axios from "axios";
import {Toast} from "vant";
import router from "@/router/index.js";
import {useUserStore} from "@/stores/userStore.js";

const userStore = useUserStore();
const Request = axios.create({
    baseURL:'http://localhost:9090',
    timeout:5000
})

Request.interceptors.request.use(config => {
    if (config.headers['Content-Type'] === "" || config.headers['Content-Type'] === null) {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }
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
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        if (res.status === -99){
            sessionStorage.removeItem("user")
            userStore.$reset();
            router.replace('/community').then(() => Toast.fail("身份异常！请重新登录！！"))
        }
        return res;
    },
    error => {
        if (error.message === "timeout of 5000ms exceeded") {
            error.message = "【请求超时5秒】" + error.message
            Toast.fail("服务器连接超时请重试！")
        }
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default Request
