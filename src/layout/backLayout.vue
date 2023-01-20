<template>
<div>
  <van-nav-bar
      class="navBar"
      left-arrow
      @click-left="onClickLeft"
      :title="title"
  />
  <div>
    <router-view @setTitle="setTitle" ></router-view>
  </div>
</div>
</template>

<script setup>
import {ref} from 'vue'

const onClickLeft = () => history.go(-1);
const title = ref("");
const setTitle = (theTitle) => {
  title.value = theTitle;
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/globalVariables.module.scss";

.navBar{
  :deep(.van-icon){
    color: black;
  }

  :deep(.van-nav-bar__content){
    border-bottom: 2px solid $DarkThemeGreen;
  }
}

</style>
