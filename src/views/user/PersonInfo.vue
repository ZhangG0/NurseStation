<template>
<div class="background_div">
  <el-card style="width: 100%">
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
              :after-read="afterRead"
              @oversize="oversize"
              :max-size="2 * 1000 * 1024"
              :max-count="1"
              >
            <van-image
                round
                width="60px"
                height="60px"
                :src="personInfo.value.userAvatarUrl?personInfo.value.userAvatarUrl:'src/assets/img/defaultAvatar.png'"
            />
          </van-uploader>

        </template>
      </van-cell>
      <van-cell title="编号" size="large" :value="userStore.getIdCode"/>
      <van-cell title="手机号" size="large" :value="userStore.getPhone"/>
      <van-cell title="姓名" size="large" :value="personInfo.value.userName"/>
      <van-cell title="性别" size="large" :value="personInfo.value.userGender === 0?'女':'男'"/>
      <van-cell title="年龄" size="large" :value="personInfo.value.userAge"/>
      <van-cell title="生日" size="large" :value="personInfo.value.userBirthday"/>
      <van-cell title="病区号" size="large" :value="personInfo.value.userAreaCode"/>
      <van-cell title="病房号" size="large" :value="personInfo.value.userRoomCode"/>
      <van-cell title="病床号" size="large" :value="personInfo.value.userBedCode"/>
      <van-cell title="责任护士" size="large" :value="personInfo.value.userNurse"/>
    </van-cell-group>
  </el-card>
</div>
</template>

<script setup>
import {useUserStore} from "@/stores/userStore.js";
import {onMounted, reactive} from "vue";
import Request from "@/utils/Request.js";
import {getFormData} from "@/utils/ZhangG0CommonUtils.js";
import {Toast} from "vant";

const userStore = useUserStore();
const personInfo = reactive({value:{}});

onMounted(() => {
  personInfo.value = userStore.userData;
  console.log();
})
/**上传*/
const afterRead = (file) => {
  // 此时可以自行将文件上传至服务器
  console.log(file.file)
  const formData = getFormData({userCode: userStore.userData.userCode});
  formData.append("avatarImg",file.file,file.file.name)

  Request.post("/user/avatarChange",formData,{
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 20000
  }).then(res => {
    if (res.status === 200){
      personInfo.value.userAvatarUrl = res.data.userAvatarUrl;
      personInfo.value.userAvatarName = res.data.userAvatarName;
      Toast("修改头像成功");
    }else {
      Toast.fail("头像修改失败，请重试");
    }
  })
  console.log(file);
};
/**限制大小*/
const oversize = () => {
  Toast.fail("图片不能大于2MB")
}
</script>

<style scoped lang="scss">
.background_div{

}
</style>
