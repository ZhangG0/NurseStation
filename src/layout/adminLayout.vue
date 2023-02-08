<template>
  <div class="common-layout">
    <el-container >
      <el-header class="header">
        <div class="logo flexRowCenter">
          <el-image style="width: 50px; height: 50px" :src="'src/assets/img/hospital.png'" fit="fill" />
          <span class="text">XX医院护士站系统</span>
        </div>
        <div class="user flexRowCenter">
          <el-dropdown class="text">
            <span class="el-dropdown-link">
             <div style="display: inline-block;cursor: pointer">{{ userStore.userData.userName }}</div>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/person')">个人信息</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/login')">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-avatar style="background-color: white" :src="userStore.userData.userAvatarUrl??'src/assets/img/defaultAvatar.png'"/>
        </div>
      </el-header>
      <el-container class="container fillContainer">
        <el-aside class="aside">
          <aside-block
              v-for="(item,index) in textName"
              :key="index"
              :index="index"
              :active="current"
              :text="item"
              @click="changeCurrent(index)"
              @toPage="toPage"
          />
        </el-aside>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/userStore.js";
import { ArrowDown } from '@element-plus/icons-vue'
import AsideBlock from "@/layout/AsideBlock.vue";
import textName from "@/assets/json/asideName.json";
import { ref } from 'vue';
import router from "@/router/index.js";
const userStore = useUserStore();

const current = ref();
const changeCurrent = (index) => {
  current.value = index;
}
const toPage = (value) => {
  router.push(value);
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/globalVariables.module.scss";

$headerHeight:60px;
.header{
  width: 100vw;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  height: $headerHeight;
  border-bottom: 1px solid lightgray;

  .logo{
    .text{
      font-family: cursive;
      font-weight: bolder;
      margin-left: 10px;
    }
  }
  .user{
    .text{
      color: $grayColor;
      margin-right: 10px;
      font-size: 14px;
    };
  }


}

.container{
  display: flex;
  flex-flow: row nowrap;

  .aside{
    background-color: white;
    border-right: 1px solid lightgray;
    min-height: calc(100vh - $headerHeight);
    width: 180px;
  }
}

</style>
