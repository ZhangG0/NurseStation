<template>
  <div>
    <div>
      <router-view></router-view>
    </div>

    <div style="margin-top: 10px">
      <van-tabbar
          v-model="active"
          placeholder
          route
          :active-color="$style['ThemeGreen']">
        <van-tabbar-item name="User-Today" to="/user/today">
          <span>今日医疗</span>
          <template #icon="">
            <van-icon class-prefix="icon" class="iconfont myIcon" :name="icon.inactive"></van-icon>
          </template>
        </van-tabbar-item>
        <van-tabbar-item icon="wap-home-o" name="Community" to="/community">互动社区</van-tabbar-item>
        <van-tabbar-item icon="chat-o" name="MyMessage" to="/myMessage">消息</van-tabbar-item>
        <van-tabbar-item icon="user-o" name="PersonInfo" to="/personInfo">我的</van-tabbar-item>
      </van-tabbar>
    </div>

  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
const nowRouterName = useRouter().currentRoute.value.name;
const active = ref(nowRouterName)
const icon = {
  inactive: 'hushi2',
};
</script>

<style lang="scss" scoped>

.myIcon{
  height: 22px;
  width: 22px;
  font-size: 22px;
}
</style>
<style module lang="scss" src="/src/assets/style/globalVariables.module.scss"></style>
