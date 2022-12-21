import dayjs from "dayjs";
import {ElMessage} from "element-plus";

/**
 * 将文字内容复制到剪切板(兼容版)
 * @param text 需要复制到剪切板的文字
 * @return {boolean}{Boolean}-代表复制成功与失败
 */
export function copyText(text){
    text.trim();
    if ("" !== text){
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard 向剪贴板写文本
            navigator.clipboard.writeText(text).then();
        } else {
            // 创建text area
            let textArea = document.createElement('textarea');
            textArea.value = text;
            // 使text area不在viewport，同时设置不可见
            textArea.style.position = 'absolute';
            textArea.style.opacity = '0';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            // 执行复制命令并移除文本框
            document.execCommand('copy');
            textArea.remove();
        }
            ElMessage({
                type:"success",
                message:"复制成功",
                center: true,
                duration:1000
            })
        return true
    }
    ElMessage.success("复制失败，值为空")
    return false;
}

/**
 * 将Date.getDay()方法的数字转为中文
 * @param day
 * @return {*}
 */
export function DayToChinese(day){
    switch (day){
        case 0:
            day = "星期日";break;
        case 1:
            day = "星期一";break;
        case 2:
            day = "星期二";break;
        case 3:
            day = "星期三";break;
        case 4:
            day = "星期四";break;
        case 5:
            day = "星期五";break;
        case 6:
            day = "星期六";break;
    }
    return day;
}

/**
 * 初始化时间，返回从今天开始后十四天的时间和星期几
 * @param startTime 开始时间，默认今天
 * @param loopTime 返回后几天，默认14天
 * @return {date,day} 返回一个对象里面有两个属性（数组），date和day
 */
export function initTime(startTime = dayjs(), loopTime = 14) {
    const res = {date:[],day:[]};
    for (let i = 0; i < loopTime; i++){
        res.date[i] = startTime.format('YYYY-MM-DD');
        res.day[i] = DayToChinese(startTime.day());

        startTime = startTime.add(1, 'day');

    }

    // console.log(res);
    return res;
}


/**
 * JS对象转FormData（一般供上传使用）
 * @param object
 * @return {FormData}
 */
export function getFormData(object) {
    const formData = new FormData()
    Object.keys(object).forEach(key => {
        const value = object[key]
        if (Array.isArray(value)) {
            value.forEach((subValue, i) =>
                formData.append(key + `[${i}]`, subValue)
            )
        } else {
            formData.append(key, object[key])
        }
    })
    return formData
}
