<template>
  <div class="asideBlock flexAllCenter" :class="{isActive:props.active === props.index}">
    <div class="fillContainer" v-if="typeof props.text.value === 'string'" @click="toPage(props.text.url)">
      <span class="text">{{props.text.value}}</span>
    </div>
    <el-collapse class="collapse" accordion v-else>
      <el-collapse-item class="item fillContainer">
        <template #title>
          <div class="text" style="margin-left: 21px;width: 100%;">{{props.text.title}}</div>
        </template>
          <aside-block
              v-for="(subItem,index) in props.text.subTitle"
              :key="index"
              :index="props.index + '-' + index"
              :active="props.active + '-' + current"
              :text="subItem"
              class="itemBlock"
              @click="changeCurrent(index,subItem.url)"
              @toPage="toPage"
              />
        </el-collapse-item>
    </el-collapse>
  </div>

</template>

<script setup>
import {ref} from "vue";
import router from "@/router/index.js";
const emit = defineEmits(["toPage"]);
const props = defineProps({
  text:{
    type:[String,Object],
    required:true,
    default: () => {
      return '人员管理'
    }
  },
  active:[Number,String],
  index:[Number,String]
})
const current = ref(-1);
const changeCurrent = (index,url) => {
  current.value = index;
  router.push(url);
}
const toPage = (url) => {
  emit("toPage",url);

}
</script>

<style lang="scss" scoped>
@import "@/assets/style/globalVariables.module.scss";

.asideBlock{
  text-align: center;
  color: black;
  border-bottom: 1px solid lightgray;
  width: 100%;
  min-height: 50px;
  &:active{
    color: $ThemeGreen;
  }
  &:hover{
    background-color: $LessThemeGreen;
    color: white;
    cursor: pointer;
  }
  :deep(.el-collapse-item__header){
    &:hover{
      background-color: $LessThemeGreen;
      color: white;
      cursor: pointer;
    }
  }

  .text{
    font-size: 14px;
  }

  .collapse{
    width: 100%;
   .itemBlock{
     &:last-child{
       border-bottom:0;
     }
     :deep(.text){
       font-size: 13px;
     }
   }
  }

  :deep(.el-collapse-item__content){
    padding-bottom: 0;
    &:first-child{
      border-top: 1px solid lightgray;
    }
  }
  :deep(.el-collapse-item){
    border: 0;
  }
}

.isActive{
  color: white;
  background-color: $LessThemeGreen;
}

</style>
