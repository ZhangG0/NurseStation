<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">Header</el-header>
      <el-container>
        <el-aside class="aside">Aside</el-aside>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "adminLayout"
}
</script>

<style lang="scss" scoped>
$headerHeight:80px;
  .header{
    background-color: lightskyblue;
    height: $headerHeight;
  }
  .aside{
    background-color: #3967FF;
    height: calc(100vh - $headerHeight);
    width: 200px;
  }
</style>
