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
              <el-descriptions-item label="患者名称">张三</el-descriptions-item>
              <el-descriptions-item label="患者编号">00000001</el-descriptions-item>
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
            :text="value.text" />
      </van-grid>
    </el-card>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import gridInfo from './UserIndexGridInfo.json'
import {Toast} from "vant";

/**进度条模块*/
const rate = ref(33.33);
const currentRate = ref(0);
const text = computed(() => currentRate.value.toFixed(2) + '%');
const gradientColor = {
  '0%': '#eaf8f5',     //进度条初始颜色
  '50%': '#88cec5',
  '100%': '#51b2a9',   //进度条最终颜色
};
/**详细治疗信息模块*/
const activeNames = ref(['0']);
/**倒计时模块*/
const onFinish = () => {
  Toast('倒计时结束');
  console.log("结束");
};
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
}

</style>
