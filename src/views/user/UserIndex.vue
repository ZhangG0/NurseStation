<template>
  <div class="flexCenter background_div">
    <el-card class="FirstPart flexCenter">
      <div class="progressBar flexCenter">
        <h3 class="TitleText">今日医疗任务已完成</h3>
        <van-circle
            v-model:current-rate="currentRate"
            layer-color="#f6f7f9"
            :rate="rate"
            :color="gradientColor"
            :size="140"
            :stroke-width="80"
            :text="text"
            :speed="120"
        />
      </div>
      <div class="nextTreatTime flexCenter">
        <div v-if="countDown">
          <h4 class="TitleText">据下次治疗时间还剩下</h4>
          <van-count-down  :time="countDown" @finish="onFinish">
            <template #default="timeData">
              <span class="block">{{ timeData.hours?timeData.hours:'-' }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes?timeData.minutes:'-' }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds?timeData.seconds:'-' }}</span>
            </template>
          </van-count-down>
        </div>

        <div class="text" v-else-if="!dtStatusNum.timeoutNum">今日治疗已全部完成</div>
        <div class="text" v-else>今日已超时任务：<span style="color:#EE0A24;">{{dtStatusNum.timeoutNum}}个</span></div>
      </div>

      <div class="detailInfo">

        <van-collapse v-model="activeNames">
          <van-badge
              style="width: 100%"
              :content="dtStatusNum.timeoutNum"
              :offset="[-44,14]"
              :show-zero="false">
            <van-collapse-item
                title=""
                size="large"
                value="详细治疗信息"
                name="detailInfo">
              <template #value>
                <div style="margin-right: 10px">详细治疗信息</div>
              </template>
              <template v-for="(item,index) in dailyTasks.value">
                <el-descriptions
                    :key="index"
                    v-if="dailyTasks.value.length !== 0"
                    :column="2">
                  <template #title>
                    <span class="title">治疗档案</span>
                    <el-tooltip
                        placement="right"
                    >
                      <template #content>
                        <div style="max-width: 180px">
                          该治疗时间为任务分发系统自动生成的建议时间，具体时间可遵照医生建议提前或延迟进行治疗。
                        </div>
                      </template>
                      <span class="iconfont icon-wenhao"/>
                    </el-tooltip>
                  </template>
                  <template #extra>
                    <el-tag
                        @click="changeDtStatus(item.dtCode,index,item.dtStatus,item.dtTime,item.dtDetail)"
                        :type="getStatusType(item.dtStatus)">
                      {{getStatusText(item.dtStatus)}}
                    </el-tag>
                  </template>
                  <el-descriptions-item label="患者名称" :span="2">{{item.userName??userStore.userData.userName}}</el-descriptions-item>
                  <!--                <el-descriptions-item label="患者编号" :span="2">{{userStore.userData.userCode}}</el-descriptions-item>-->
                  <el-descriptions-item label="治疗方式" :span="2">{{item.treatType}}</el-descriptions-item>
                  <el-descriptions-item label="治疗时间">{{item.dtTime}}</el-descriptions-item>
                  <el-descriptions-item label="责任护士" >{{userStore.userData.userNurse??userStore.userData.nurseName}}</el-descriptions-item>
                  <el-descriptions-item v-if="!userStore.userData.nurseCode" label="医嘱详情" :span="2">{{item.dtDetail}}</el-descriptions-item>
                </el-descriptions>

              </template>
              <el-empty v-if="dailyTasks.value.length === 0" :image-size="60" description="暂无治疗任务" />

            </van-collapse-item>
          </van-badge>


        </van-collapse>

      </div>
    </el-card>
    <el-card v-if="userStore.userData.userCode > 0">
      <van-grid :gutter="5" column-num="2">
        <van-grid-item
            v-for="value in gridInfo"
            :key="value"
            class="iconfont girdItem"
            icon-prefix="icon"
            :icon="value.icon"
            :text="value.text"
            @click="openDialog(value.text)"
        />
        <van-dialog
            v-model:show="show"
            @closed="closed(0)"
            :title="dialogInfo.value.title">
          <div class="dialogBody" :class="{flexCenter:isInfoCenter}">
            <!-- 正常显示单个数据内容-->
            <el-descriptions
                title=""
                :column="2"
                v-if="showDescriptions === 0">
              <el-descriptions-item
                  v-for="(item,index) in dialogInfo.value.info"
                  :key="index"
                  :label="item.label"
                  span="2"
              >{{item.text}}</el-descriptions-item>
            </el-descriptions>
            <!-- 无数据内容-->
            <el-empty v-else :image-size="60" description="暂无数据" />

          </div>
        </van-dialog>

        <van-dialog
            v-model:show="show2"
            @closed="closed(1)">
          <!-- 显示一组数据内容（即多个单个）-->
          <div  class="dialogBody" style="padding: 0">
            <SlidingTab v-if="showSlidingTab"  :tab-list="tabList.value" width="300px">
              <el-descriptions
                  title=""
                  :column="1"
                  v-for="(item,index) in dialogInfo.value.info2"
                  :key="index"
              >
                <el-descriptions-item
                    v-for="(subItem,subIndex) in item"
                    :label="subItem.label"
                    :key="subIndex"
                >{{subItem.text}}</el-descriptions-item>
                <el-divider></el-divider>
              </el-descriptions>
            </SlidingTab>

          </div>

        </van-dialog>
      </van-grid>
    </el-card>
  </div>
</template>

<script setup>
import {computed, reactive, ref} from "vue";
import gridInfo from '../../assets/json/UserIndexGridInfo.json'
import cssVar from "/src/assets/style/globalVariables.module.scss"
import {Dialog, Toast} from "vant";
import {useUserStore} from "@/stores/userStore.js";
import Request from "@/utils/Request.js";
import {getObjLength} from "@/utils/ZhangG0CommonUtils.js";
import {SlidingTab} from "@/components/index.js";
const VanDialog = Dialog.Component;

const userStore = useUserStore();

/**每日任务-详细治疗信息模块*/
const activeNames = ref([userStore.userData.userCode<0?'detailInfo':'0']);
const dailyTasks = reactive({value:[]});
const dtStatusNum = computed(() => {
  let finishNum = 0;
  let timeoutNum = 0;
  dailyTasks.value.forEach( item => {
    if (item.dtStatus === "1"){
      //计算完成的有几个
      finishNum++;
    }else if (item.dtStatus === "-1"){
      timeoutNum++
    }
  })

  return {
    finishNum:finishNum,
    timeoutNum:timeoutNum
  };
})
const getStatusText = (statusNum) => {
  let text;
  switch (statusNum) {
    case "0":
      text = "未完成";
      break;
    case "1":
      text = "已完成";
      break;
    case "-1":
      text = "已超时";
  }

  return text;
}
const getStatusType = (statusNum) => {
  let type;
  switch (statusNum) {
    case "0":
      type = "warning";
      break;
    case "1":
      type = "success";
      break;
    case "-1":
      type = "danger"
  }

  return type;
}
  /**改变任务状态*/
const changeDtStatus = (dtCode,index,dtStatus,dtTime,detail) => {
    console.log(detail);
    console.log(userStore.userData.nurseCode)
  if (detail === "日常查房" && userStore.userData.userCode>0 && dtStatus !== "0"){
    return Toast(`若已完成${detail}请联系责任护士更改`);
  }
  if (dtStatus !== "1"){
    Dialog.confirm({
      title: '是否已经完成该项治疗？',
      message: `【${dtTime}】${detail} \n 【请确认是否已完成该项治疗任务！】`,
      confirmButtonColor: cssVar.DarkThemeGreen,
      cancelButtonText: '未完成',
      confirmButtonText: '已完成'
    })
        .then(() => {
          dailyTasks.value[index].dtStatus = "1";
          // on confirm
          Request.post('/daily/changeStatus',{dtCode:dtCode}).then(res => {
            if (res.status === 200){
              dailyTasks.value[index].dtStatus = "1";
            }else {
              dailyTasks.value[index].dtStatus = dtStatus;
              Toast.fail("确认失败！请重新确认！")
            }
          }).catch(() => {
            dailyTasks.value[index].dtStatus = dtStatus;
            Toast.fail("确认失败！请重新确认！")
          })
        })
        .catch(() => {
          // on cancel
          Toast("请完成治疗后再确认！")
        });
  }else {
    Toast("已完成任务，无需重复确认")
  }
}
Request.post("/daily/getDailyTask",{userCode: userStore.userData.userCode === -1?userStore.userData.nurseCode:userStore.userData.userCode}).then(res => {
  if (res.status === 200){
    dailyTasks.value = res.data;
  }else {
    Toast.fail("获取每日治疗详细信息失败");
  }

})
/**END*/

/**进度条模块*/
const rate = computed(() => {
  return dailyTasks.value.length === 0?0:(dtStatusNum.value.finishNum/dailyTasks.value.length) * 100;
})
const currentRate = ref(0);
const text = computed(() => currentRate.value.toFixed(2) + '%');
const gradientColor = {
  '0%': '#eaf8f5',     //进度条初始颜色
  '50%': '#88cec5',
  '100%': '#51b2a9',   //进度条最终颜色
};
/**END*/

/**下一次用药倒计时模块*/
  /**下一次用药倒计时时间*/
const countDown = computed(() => {
  let countDownTime;
  for (let i = 0; i < dailyTasks.value.length; i++) {
    if (dailyTasks.value[i].dtStatus === "0"){
      const timeArr = dailyTasks.value[i].dtTime.split(":");
      let date = new Date();
      let now = new Date();
      date.setHours(timeArr[0],timeArr[1]);
      countDownTime = date - now;
      break;
    }
  }

  return countDownTime;
})
  /**倒计时结束时触发的Dialog*/
const onFinish = () => {
    for (let i = 0; i < dailyTasks.value.length; i++) {
      if (dailyTasks.value[i].dtStatus === "0"){
        Dialog.confirm({
          title: '是否已经完成该项治疗？',
          message: `【${dailyTasks.value[i].dtTime}】${dailyTasks.value[i].dtDetail}\n【请确认是否已完成该项药物治疗任务！】`,
          confirmButtonColor: cssVar.DarkThemeGreen,
          cancelButtonText: '未完成',
          confirmButtonText: '已完成'
        })
            .then(() => {
              // on confirm
              Request.post('/daily/changeStatus',{dtCode:dailyTasks.value[i].dtCode}).then(res => {
                if (res.status === 200){
                  dailyTasks.value[i].dtStatus = "1";
                }else {
                  dailyTasks.value[i].dtStatus = "-1";
                  Toast.fail("确认失败！请重新确认！")
                }
              }).catch(() => {
                dailyTasks.value[i].dtStatus = "-1";
                Toast.fail("确认失败！请重新确认！")
              })
            })
            .catch(() => {
              // on cancel
              dailyTasks.value[i].dtStatus = "-1";
              Toast("请完成治疗后再确认！")
            });
        break;

      }
      }


  console.log("结束");
};
/**END*/

/**Grid模块*/
let myOrder = reactive({
  doctorsorder:{},
  doctor:{},
  nurse:{},
  treatList:[]
});
const treat = {
  medicine:[],
  other:[],
}
  //如果登录态是用户则返回医嘱
if (userStore.userData.userCode > 0){
  Request.post("/order/getMyOrder",{userCode:userStore.userData.userCode}).then( res => {
    if (res.status === 200){
      myOrder = res.data;
      for (const obj of myOrder.treatList) {
        if (obj.treatType.includes("口服/外用")){
          treat.medicine.push(obj);
        }else {
          treat.other.push(obj);
        }
      }
    }else {
      Toast.fail("请求个人医疗信息异常！"+res.msg);
    }
  })

}
const show = ref(false);            //控制dialog
const show2 = ref(false);
const showSlidingTab = ref(false);
const tabList = reactive({value: ['阿莫西林胶囊', '针管']})
const showDescriptions = ref(0);//控制是否限制Descriptions
const isInfoCenter = ref(false);    //控制是否居中
const dialogInfo = reactive({
  value: {
    title: "标题",
    info: [{}],  //用于一般介绍
    info2: [[]]  //用于一个grid内有多个信息的
  }
});
  /**关闭时默认关闭居中,默认显示描述行*/
const closed = (text) => {
  isInfoCenter.value = false;
  showDescriptions.value = 0;
  //保证滑动Tab晚于dialog关闭
  if (text === 1){
    setTimeout(() => {
      showSlidingTab.value = false;
    },10)
  }

}
  /**生成数组内的对象*/
const createObj = (loopTime) => {
  dialogInfo.value.info.length = loopTime;
    for (let i = 0; i < loopTime; i++) {
      dialogInfo.value.info[i] = {};
    }
}
  /**生成数组并且生成数组内的对象*/
const createArr = (arrLoopTime,type,objLoopTime = 6) => {
  //循环数组  有几组治疗的数据就生成几组数组
  dialogInfo.value.info2.length = arrLoopTime;
  tabList.value.length = arrLoopTime;
  let tabText = type === 0?"药物":"治疗";
  for (let i = 0; i < arrLoopTime; i++) {
    tabList.value[i] = tabText + (i+1);
    dialogInfo.value.info2[i] = [];
    //每组数组内循环，生成对应条数的对象
    for (let j = 0; j < objLoopTime; j++) {
      dialogInfo.value.info2[i][j] = {}
    }
  }
}
  //grid的dialog的信息动态赋值
const openDialog = (text) => {
  dialogInfo.value.title = text;
  switch (text) {
    case "我的医生":
      createObj(getObjLength(myOrder.doctor)-3);
      dialogInfo.value.info[0].label = "医生编号";
      dialogInfo.value.info[0].text = myOrder.doctor.doctorCode;
      dialogInfo.value.info[1].label = "医生姓名";
      dialogInfo.value.info[1].text = myOrder.doctor.doctorName;
      dialogInfo.value.info[2].label = "医生科室";
      dialogInfo.value.info[2].text = myOrder.doctor.doctorDept;
      dialogInfo.value.info[3].label = "医生职称";
      dialogInfo.value.info[3].text = myOrder.doctor.doctorTitle;
      dialogInfo.value.info[4].label = "擅长领域";
      dialogInfo.value.info[4].text = myOrder.doctor.areasOfExpertise;
      dialogInfo.value.info[5].label = "执业经历";
      dialogInfo.value.info[5].text = myOrder.doctor.professionalExperience;
      break;
    case "我的护士":
      createObj(getObjLength(myOrder.nurse)-3);
      dialogInfo.value.info[0].label = "护士编号";
      dialogInfo.value.info[0].text = myOrder.nurse.nurseCode;
      dialogInfo.value.info[1].label = "护士姓名";
      dialogInfo.value.info[1].text = myOrder.nurse.nurseName;
      dialogInfo.value.info[2].label = "护士科室";
      dialogInfo.value.info[2].text = myOrder.nurse.nurseDept;
      dialogInfo.value.info[3].label = "护士职称";
      dialogInfo.value.info[3].text = myOrder.nurse.nurseTitle;
      dialogInfo.value.info[4].label = "擅长领域";
      dialogInfo.value.info[4].text = myOrder.nurse.areasOfExpertise;
      dialogInfo.value.info[5].label = "执业经历";
      dialogInfo.value.info[5].text = myOrder.nurse.professionalExperience;
      break;
    case "用药":
      if (treat.medicine.length > 0){
        showDescriptions.value = 1;
        showSlidingTab.value = true;
        createArr(treat.medicine.length,0);
        for (let i = 0; i < treat.medicine.length; i++) {
          dialogInfo.value.info2[i][0].label = "药物类型";
          dialogInfo.value.info2[i][0].text = treat.medicine[i].treatType;
          dialogInfo.value.info2[i][1].label = "药物名称";
          dialogInfo.value.info2[i][1].text = treat.medicine[i].treatDetail;
          dialogInfo.value.info2[i][2].label = "单次计量";
          dialogInfo.value.info2[i][2].text = treat.medicine[i].treatDosage;
          dialogInfo.value.info2[i][3].label = "用药频率";
          dialogInfo.value.info2[i][3].text = treat.medicine[i].treatFrequency + treat.medicine[i].frequencyUnit + treat.medicine[i].treatTime + "次";
          dialogInfo.value.info2[i][4].label = "用药周期";
          dialogInfo.value.info2[i][4].text = treat.medicine[i].treatCycle + treat.medicine[i].treatUnit;
          dialogInfo.value.info2[i][5].label = "注意事项";
          dialogInfo.value.info2[i][5].text = treat.medicine[i].treatNote || "无";
        }
      }else {
        showDescriptions.value = -1;
      }
      break;
    case "治疗":
      if (treat.other.length > 0){
        showDescriptions.value = 1;
        showSlidingTab.value = true;
        createArr(treat.other.length,1);
        for (let i = 0; i < treat.other.length; i++) {
          dialogInfo.value.info2[i][0].label = "治疗方式";
          dialogInfo.value.info2[i][0].text = treat.other[i].treatType;
          dialogInfo.value.info2[i][1].label = "治疗名称";
          dialogInfo.value.info2[i][1].text = treat.other[i].treatDetail;
          dialogInfo.value.info2[i][2].label = "单次计量";
          dialogInfo.value.info2[i][2].text = treat.other[i].treatDosage || "无";
          dialogInfo.value.info2[i][3].label = "治疗频率";
          dialogInfo.value.info2[i][3].text = treat.other[i].treatFrequency + treat.other[i].frequencyUnit + treat.other[i].treatTime + "次";
          dialogInfo.value.info2[i][4].label = "治疗周期";
          dialogInfo.value.info2[i][4].text = treat.other[i].treatCycle + treat.other[i].treatUnit;
          dialogInfo.value.info2[i][5].label = "注意事项";
          dialogInfo.value.info2[i][5].text = treat.other[i].treatNote || "无";
        }
      }else {
        showDescriptions.value = -1;
      }
      break;
    case "手术安排":
      if (myOrder.operation){
        createObj(6);
        dialogInfo.value.info[0].label = "手术编号";
        dialogInfo.value.info[0].text = myOrder.operation.operationCode;
        dialogInfo.value.info[1].label = "手术医生";
        dialogInfo.value.info[1].text = myOrder.operation.doctorName;
        dialogInfo.value.info[2].label = "手术科室";
        dialogInfo.value.info[2].text = myOrder.operation.operationDept;
        dialogInfo.value.info[3].label = "手术时间";
        dialogInfo.value.info[3].text = myOrder.operation.operationDatetime;
        dialogInfo.value.info[4].label = "预计时长";
        dialogInfo.value.info[4].text = myOrder.operation.operationDuration;
        dialogInfo.value.info[5].label = "注意事项";
        dialogInfo.value.info[5].text = myOrder.operation.operationNote;
      }else {
        showDescriptions.value = -1;
      }
      break;
    case "饮食建议":
      if (!myOrder.doctorsorder.dietType && !myOrder.doctorsorder.dietAdvice){
        showDescriptions.value = -1;
      }else {
        createObj(2);
        dialogInfo.value.info[0].label = "饮食类型";
        dialogInfo.value.info[0].text = myOrder.doctorsorder.dietType;
        dialogInfo.value.info[1].label = "饮食建议";
        dialogInfo.value.info[1].text = myOrder.doctorsorder.dietAdvice;
        isInfoCenter.value = true;
      }
      break;
    case "病房信息":
      createObj(3);
      dialogInfo.value.info[0].label = "病房区域";
      dialogInfo.value.info[0].text = userStore.userData.userAreaCode;
      dialogInfo.value.info[1].label = "病房编号";
      dialogInfo.value.info[1].text = userStore.userData.userRoomCode;
      dialogInfo.value.info[2].label = "病房床号";
      dialogInfo.value.info[2].text = userStore.userData.userBedCode;
      //居中显示
      isInfoCenter.value = true;
      break;
  }

  //打开dialog
  if (text !== "用药" && text !== "治疗"){
    show.value = !show.value;
  }else {
    show2.value = !show2.value
  }
}
/**END*/

</script>

<style lang="scss" scoped>
@import "src/assets/style/globalVariables.module";

.background_div{
  padding-top: 0;

  .FirstPart{
    width: 100%;
    margin-bottom: 5px;
    :deep(.el-card__body){
      width: 90%;
    }

    .progressBar{
      margin: 30px 10px 30px 10px;
      background-color: #ffffff;
    }
    .TitleText{
      display: block;
      margin-bottom: 20px;
    }

    .nextTreatTime{
      text-align: center;
      margin-bottom: 15px;

      .colon {
        display: inline-block;
        margin: 0 4px;
        color: $DarkThemeGreen;
      }
      .block {
        display: inline-block;
        width: 22px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        background-color: $ThemeGreen;
      }

      .text{
        color: $grayColor;
        font-size: 15px;
      }
    }

    .detailInfo{

      .title{
        margin-right: 5px;
      }

      :deep(.el-empty){
        padding: 0;
      }

      :deep(.el-descriptions__cell){
        padding-bottom: 5px;
      }
    }

  }



  .girdItem{
    :deep(.van-grid-item__content){
      border-radius: 3px;
      border: 1px solid lightgrey;
      background-color: #f4faf8;
    }
    :deep(.van-badge__wrapper) {
      font-style: normal;
    }
  }

  :deep(.van-button__text){
    color: $DarkThemeGreen;
  }

  :deep(.van-dialog__header){
    font-weight: bold;
    font-size: large;
  }

  .dialogBody{
    padding: 15px 30px;

    :deep(.el-descriptions__cell){
      padding-bottom: 5px;
    }

    :deep(.el-descriptions__label){
      font-weight: bold;
    }
  }
}

</style>
