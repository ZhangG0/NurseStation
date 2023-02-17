<template>
  <el-config-provider :locale="zhCn">
    <el-card class="adminHome">
      <el-header class="header">护士站数据统计平台</el-header>
      <el-divider/>
      <el-container class="flexCenter">
        <div class="flexItem fillWidth">
          <div class="fillContainer progressBlock">
            <div class="progressText">今日患者评估完成度</div>
            <el-progress
                :text-inside="true"
                :stroke-width="24"
                :percentage="50"
                :color="style.DarkThemeGreen"
            />
          </div>
        </div>
        <div class="flexItem fillWidth">
          <div id="pieChart1" class="chart blockBackGround" />
          <div id="lineChart1" class="chart blockBackGround" style="width: 40%;"/>
          <div id="pieChart2" class="chart blockBackGround" />

        </div>
        <div class="flexItem fillWidth">

        </div>
      </el-container>

    </el-card>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import style from '@/assets/style/globalVariables.module.scss';
import * as echarts from "echarts";
import {onMounted} from "vue";
import dayjs from "dayjs";


onMounted(() => {//需要获取到element,所以是onMounted的Hook
  //各科室病患表
  let pieChart1 = echarts.init(document.getElementById("pieChart1"));
  pieChart1.setOption({
    title: {
      text: '各科室病患分布表',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      itemGap:5,
      itemWidth:15,
    },
    series: [
      {
        type: 'pie',
        radius: ['20%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '骨科' },
          { value: 735, name: '耳鼻喉科' },
          { value: 580, name: '产科' },
          { value: 484, name: '皮肤科' },
          { value: 484, name: '口腔科' },
        ]
      }
    ]
  });
  //xxxxx
  let pieChart2 = echarts.init(document.getElementById("pieChart2"));
  // 绘制图表
  pieChart2.setOption({
    title: {
      text: '各级护士分布表',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      itemGap:5,
      itemWidth:15
    },
    series: [
      {
        type: 'pie',
        radius: ['20%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 100, name: '初级护士' },
          { value: 80, name: '初级护师' },
          { value: 50, name: '中级护师' },
          { value: 10, name: '副主任护师' },
          { value: 6, name: '主任护师' },
        ]
      }
    ]
  });
  let lineChart1 = echarts.init(document.getElementById("lineChart1"));
  lineChart1.setOption({
    title: {
      text: '医院患者出入院及在院情况',
      position:'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top:25,
      data: ['在院患者', '入院患者','出院患者']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      show: true,
      showTitle:false,
      feature: {
        magicType: { type: ['line', 'bar'] },
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getBeforeDate()
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '在院患者',
        type: 'line',
        data: [1120, 1132, 1101, 1134, 190, 1230, 1210]
      },
      {
        name: '入院患者',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '出院患者',
        type: 'line',
        data: [100, 82, 11, 224, 20, 33, 10]
      }
    ]
  })
})

const getBeforeDate = () => {
  const DataX = [];
  //X轴数据数组初始化
  for (let i = 0; i < 7; i++) {
    DataX.push(dayjs().subtract(i, "day").format("MM月DD日"));
  }
  return DataX.reverse();
  //JS异常图表 X轴
}

</script>

<style lang="scss" scoped>
@import "@/assets/style/globalVariables.module.scss";

.adminHome {
  margin: 2px;
  width: 100%;

  .header {
    text-align: center;
    font-size: xx-large;
    font-family: cursive;
    font-weight: bolder;
    color: #252525;
  }

  .flexItem {
    margin-top: 35px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;

    .progressBlock {
      width: 60%;

      .progressText {
        font-size: x-large;
        text-align: center;
        margin-bottom: 20px;
        font-family: cursive;
        font-weight: bolder;

      }
    }
  }

  .fillWidth{
    width: 100%;
  }

  :deep(.el-divider--horizontal) {
    margin-top: 0;
    margin-bottom: 10px;
  }
}

.chart{
  width: 350px;
  height: 300px;

}
.blockBackGround{
  padding: 10px;
  margin: 10px;
  border-radius: 20px;
  background-color: $LightThemeGreen;
}
</style>
