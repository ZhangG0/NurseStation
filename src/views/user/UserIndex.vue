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

const rate = ref(30);
const currentRate = ref(0);
const text = computed(() => currentRate.value.toFixed(0) + '%');
const gradientColor = {
  '0%': '#d1f4ff',     //进度条初始颜色
  '100%': '#5286f3',   //进度条最终颜色
};
// const gridInfo = JSON.parse(new URL('./UserIndexGridInfo.json', import.meta.url).href);
console.log(gridInfo)
</script>

<style lang="scss" scoped>

.background_div{
  padding-top: 0;

  .FirstPart{
    width: 100%;
    margin-bottom: 10px;

    .TitleText{
      display: block;
      margin-bottom: 25px;

    }
    .progressBar{
      margin: 60px 10px 60px 10px;
      background-color: #ffffff;
    }
  }


  .girdItem{
    :deep(.van-grid-item__content){
      border-radius: 3px;
      border: 1px solid lightgrey;
      background-color: rgba(95, 144, 241, 0.09);
    }
    :deep(.van-badge__wrapper) {
      font-style: normal;
    }
  }
}

</style>
