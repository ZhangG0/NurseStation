<template>
  <div>
    <div>
      <router-view></router-view>
    </div>

    <div style="margin-top: 50px">
      <van-tabbar v-model="active">
        <van-tabbar-item name="today" to="/user/today">
          <span>今日医疗</span>
          <template #icon="props">
            <van-icon class-prefix="icon" class="iconfont myIcon" :name="props.active ? icon.active : icon.inactive"></van-icon>
          </template>
        </van-tabbar-item>
        <van-tabbar-item icon="wap-home-o" name="community" to="/community">互动社区</van-tabbar-item>
        <van-tabbar-item icon="chat-o" name="chat" to="/myMessage">消息</van-tabbar-item>
        <van-tabbar-item icon="user-o" name="user" to="/personInfo">我的</van-tabbar-item>
      </van-tabbar>
    </div>

  </div>
</template>

<script setup>
import {ref} from "vue";

const active = ref('today')
const icon = {
  active: 'hushi1',
  inactive: 'hushi',
};
</script>

<style lang="scss" scoped>
.myIcon{
  height: 22px;
  width: 22px;
  font-size: 22px;
}
</style>
