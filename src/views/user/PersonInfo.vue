<template>
  <div class="background_div">
    <van-sticky>
      <van-nav-bar title="个人信息" style="margin-left: -10px;width: 100vw;">
        <template #right>
          <!--扫码ICON-->
          <van-icon name="scan" color="black" size="22px" @click="scan"/>
        </template>
      </van-nav-bar>
    </van-sticky>
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
                  :src="personInfo.value.userAvatarUrl?personInfo.value.userAvatarUrl:avatarImg"
              />
            </van-uploader>

          </template>
        </van-cell>
        <div v-if="userStore.userData.userName">
          <van-cell title="编号" size="large" :value="userStore.getIdCode"/>
          <van-cell title="手机号" size="large" :value="userStore.getPhone"/>
          <van-cell title="姓名" size="large" :value="personInfo.value.userName"/>
          <van-cell title="性别" size="large" :value="personInfo.value.userGender === 0?'女':'男'"/>
          <van-cell title="年龄" size="large" :value="personInfo.value.userAge"/>
          <van-cell title="生日" size="large" :value="personInfo.value.userBirthday"/>
          <van-cell title="病区号" size="large" :value="personInfo.value.userAreaCode"/>
          <van-cell title="病房号" size="large" :value="personInfo.value.userRoomCode"/>
          <van-cell title="病床号" size="large" :value="personInfo.value.userBedCode"/>
          <van-cell title="入院日期" size="large" :value="personInfo.value.userAdmissionDate"/>
          <van-cell title="出院日期" size="large" :value="personInfo.value.userDischargeDate"/>
          <van-cell title="责任护士" size="large" :value="personInfo.value.userNurse"/>
        </div>
        <div v-else-if="userStore.userData.nurseName">
          <van-cell title="编号" size="large" :value="personInfo.value.nurseCode"/>
          <van-cell title="手机号" size="large" :value="userStore.getPhone"/>
          <van-cell title="姓名" size="large" :value="personInfo.value.nurseName"/>
          <van-cell title="职称" size="large" :value="personInfo.value.nurseTitle"/>
          <van-cell title="所属科室" size="large" :value="personInfo.value.nurseDept"/>
          <van-cell title="擅长领域" size="large" :value="personInfo.value.areasOfExpertise"/>
          <van-cell title="执业经历" size="large" :value="personInfo.value.professionalExperience"/>
        </div>

      </van-cell-group>
      <van-button
          class="button"
          type="danger"
          round
          @click="logout"
      >退出登录</van-button>
    </el-card>
  </div>
</template>

<script setup>
import {useUserStore} from "@/stores/userStore.js";
import {onMounted, reactive,ref} from "vue";
import Request from "@/utils/Request.js";
import {getFormData} from "@/utils/ZhangG0CommonUtils.js";
import {Toast} from "vant";
import router from "@/router/index.js";
import avatarImg from '@/assets/img/defaultAvatar.png';

const userStore = useUserStore();
const personInfo = reactive({value: {}});
const scanShow = ref(false);

onMounted(() => {
  personInfo.value = userStore.userData;
})


/**扫码*/
const scan = () => {
  scanShow.value = !scanShow.value
  router.push('/scanner')
}
/**上传*/
const afterRead = (file) => {
  // 此时可以自行将文件上传至服务器
  const formData = getFormData({userCode: userStore.userData.userCode});
  formData.append("avatarImg", file.file, file.file.name)

  Request.post("/user/avatarChange", formData, {
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 20000
  }).then(res => {
    if (res.status === 200) {
      personInfo.value.userAvatarUrl = res.data.userAvatarUrl;
      personInfo.value.userAvatarName = res.data.userAvatarName;
      Toast("修改头像成功");
    } else {
      Toast.fail("头像修改失败，请重试");
    }
  })
};
/**限制大小*/
const oversize = () => {
  Toast.fail("图片不能大于2MB")
}
/**登出*/
const logout = () => {
  //pinia重置
  userStore.$reset();
  //token删除
  window.localStorage.removeItem("NurseToken");
  //pinia持久化删除
  window.sessionStorage.removeItem("user");
  Toast.success("登出成功");
  router.push("/community");
}
</script>

<style lang="scss" scoped>
.background_div {
  .button{
    margin-top: 15px;
    width: 100%;
    height: 40px;
  }

}
</style>
