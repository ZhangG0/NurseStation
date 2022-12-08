<template>
<div class="background_div">
  <el-card class="flexAllCenter" style="width: 100%">
    <van-cell-group
        style="margin: 0;"
        inset
        class="content">
      <van-cell
          title="头像"
          center
          size="large">
        <template #right-icon>
          <van-uploader
              :max-size="2 * 1000 * 1024"
              :max-count="1"
              >
            <van-image
                round
                width="60px"
                height="60px"
                :src="personInfo.USER_AVATAR_URL?personInfo.USER_AVATAR_URL:'src/assets/img/defaultAvatar.png'"
            />
          </van-uploader>

        </template>
      </van-cell>
      <van-cell title="编号" size="large" :value="personInfo.USER_CODE"/>
      <van-cell title="姓名" size="large" :value="personInfo.USER_NAME"/>
      <van-cell title="性别" size="large" :value="personInfo.USER_GENDER === 0?'女':'男'"/>
      <van-cell title="年龄" size="large" :value="personInfo.USER_AGE"/>
      <van-cell title="生日" size="large" :value="personInfo.USER_BIRTHDAY"/>
      <van-cell title="病区号" size="large" :value="personInfo.USER_AREA"/>
      <van-cell title="病房号" size="large" :value="personInfo.USER_ROOM_CODE"/>
      <van-cell title="病床号" size="large" :value="personInfo.USER_BED_ROOM"/>
      <van-cell title="责任护士" size="large" :value="personInfo.USER_NURSE"/>
    </van-cell-group>
  </el-card>

</div>
</template>

<script setup>
import {reactive} from "vue";

const personInfo = reactive({
  USER_AVATAR_URL:"",
  USER_NAME:"小江同学",
  USER_AGE:0,
  USER_BIRTHDAY:"1999-07-02",
  USER_CODE:"0000010001",
  USER_GENDER:0,
  USER_AREA:"A",
  USER_ROOM_CODE:"508",
  USER_BED_ROOM:"02",
  USER_NURSE:"小傅医生"
})

</script>

<style scoped>

</style>
