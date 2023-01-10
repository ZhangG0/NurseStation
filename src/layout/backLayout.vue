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

const onClickLeft = () => history.back();
const title = ref("");
const setTitle = (theTitle) => {
  title.value = theTitle;
  console.log(theTitle);
}
</script>

<style lang="scss" scoped>
.navBar{
  :deep(.van-icon){
    color: black;
  }
}
</style>
