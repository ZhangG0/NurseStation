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
        />
      </div>
      <div class="nextTreatTime flexCenter">
        <h4 class="TitleText">据下次治疗时间还剩下</h4>
        <van-count-down :time="3*60*60*1000" @finish="onFinish">
          <template #default="timeData">
            <span class="block">{{ timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>

      <div class="detailInfo">
        <van-collapse v-model="activeNames">
          <van-collapse-item
              title=" "
              size="large"
              value="详细治疗信息"
              name="detailInfo">
            <el-descriptions title="治疗档案" :column="2">
              <template #extra>
                <el-tag type="success">已完成</el-tag>
              </template>
              <el-descriptions-item label="患者名称" :span="2">{{userStore.userData.userName}}</el-descriptions-item>
              <el-descriptions-item label="患者编号" :span="2">{{userStore.userData.userCode}}</el-descriptions-item>
              <el-descriptions-item label="治疗方式">药物治疗</el-descriptions-item>
              <el-descriptions-item label="治疗时间">11: 00</el-descriptions-item>
              <el-descriptions-item label="责任护士" :span="2">张翠花</el-descriptions-item>
              <el-descriptions-item label="医嘱详情" :span="2">饭后，阿莫西林胶囊，2片，一天三次</el-descriptions-item>
            </el-descriptions>

            <el-descriptions title="治疗档案" :column="2">
              <template #extra>
                <el-tag type="danger">已超时</el-tag>
              </template>
              <el-descriptions-item label="患者名称" >张三</el-descriptions-item>
              <el-descriptions-item label="患者编号">00000001</el-descriptions-item>
              <el-descriptions-item label="治疗方式">注射治疗</el-descriptions-item>
              <el-descriptions-item label="治疗时间">13: 00</el-descriptions-item>
              <el-descriptions-item label="责任护士" :span="2">张翠花</el-descriptions-item>
              <el-descriptions-item label="医嘱详情" :span="2">屁股针一次</el-descriptions-item>
            </el-descriptions>

            <el-descriptions title="治疗档案" :column="2">
              <template #extra>
                <el-tag type="warning">未完成</el-tag>
              </template>
              <el-descriptions-item label="患者名称" >张三</el-descriptions-item>
              <el-descriptions-item label="患者编号">00000001</el-descriptions-item>
              <el-descriptions-item label="治疗方式">注射治疗</el-descriptions-item>
              <el-descriptions-item label="治疗时间">16: 00</el-descriptions-item>
              <el-descriptions-item label="责任护士" :span="2">张翠花</el-descriptions-item>
              <el-descriptions-item label="医嘱详情" :span="2">屁股针一次</el-descriptions-item>
            </el-descriptions>

          </van-collapse-item>
        </van-collapse>

      </div>
    </el-card>
    <el-card>
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
import gridInfo from './UserIndexGridInfo.json'
import {Dialog, Toast} from "vant";
import {useUserStore} from "@/stores/userStore.js";
import Request from "@/utils/Request.js";
import {getObjLength} from "@/utils/ZhangG0CommonUtils.js";
import {SlidingTab} from "@/components/index.js";
const VanDialog = Dialog.Component;

/**进度条模块*/
const rate = ref(33.33);
const currentRate = ref(0);
const text = computed(() => currentRate.value.toFixed(2) + '%');
const gradientColor = {
  '0%': '#eaf8f5',     //进度条初始颜色
  '50%': '#88cec5',
  '100%': '#51b2a9',   //进度条最终颜色
};
/**END*/

/**详细治疗信息模块*/
const activeNames = ref(['0']);
const userStore = useUserStore();
/**END*/

/**下一次用药倒计时模块*/
const onFinish = () => {
  Toast('倒计时结束');
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
    console.log(myOrder);
    console.log(treat);
  }else {
    Toast.fail("请求异常！"+res.msg);
  }
})
const show = ref(false);            //控制dialog
const show2 = ref(false);
const showSlidingTab = ref(false);
const tabList = reactive({value: ['阿莫西林胶囊', '针管']})
const showDescriptions = ref(0);//控制是否限制Descriptions
const isInfoCenter = ref(false);    //控制是否居中
const dialogInfo = reactive({
  value: {
    title: "标题",
    info: [{}],
    info2: [
        [

        ]
    ]
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
const openDialog = (text) => {
  dialogInfo.value.title = text;
  switch (text) {
    case "我的医生":
      createObj(getObjLength(myOrder.doctor)-1);
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
      createObj(getObjLength(myOrder.nurse)-1);
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
@import "@/assets/style/globalVariables.module.scss";

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
    }

    .detailInfo{

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
    color: $ThemeGreen;
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
