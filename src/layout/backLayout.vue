<template>
<div>
  <van-nav-bar
      class="navBar"
      left-arrow
      @click-left="onClickLeft"
  />
  <div>
    <router-view></router-view>
  </div>
</div>
</template>

<script setup>
const onClickLeft = () => history.back();
</script>

<style lang="scss" scoped>
.navBar{
  :deep(.van-icon){
    color: black;
  }
}
</style>
