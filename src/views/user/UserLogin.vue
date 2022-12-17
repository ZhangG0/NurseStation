<template>
  <div class="background">
    <div class="container">

      <!--      登录-->
      <div class="login" v-if="loginPage">
        <h2 class="headerTitle">
          欢迎使用住院护士站系统
        </h2>
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
                v-model="username"
                name="userPhone"
                label="手机号"
                placeholder="请输入手机号"
                :rules="[{ required: true, message: '请填写手机号' }]"
            />
            <van-field
                v-model="password"
                type="password"
                name="userPassword"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>
          <span class="subText" @click="loginPage = false">没有账号？请点击注册</span>
          <div style="margin: 16px;">
            <van-button :color="cssVar.ThemeGreen" block native-type="submit">
              登录
            </van-button>
          </div>
          <div style="margin: 16px;">
            <van-button :color="cssVar.DarkThemeGreen" block native-type="submit">
              手机号一键登录
            </van-button>
          </div>
        </van-form>
      </div>
      <!--      注册-->
      <div class="register" v-else>
        <h2 class="headerTitle">
          欢迎注册住院护士站系统
        </h2>
        <van-form @submit="onRegister">
          <van-cell-group inset>
            <van-field
                v-model="registerData.USER_NAME"
                name="userName"
                label="姓名"
                placeholder="请输入姓名"
                :rules="[
                    { required: true, message: '请输入正确中文姓名' },
                    { pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,message: '请输入正确中文姓名'}
                    ]"
            />
            <van-field
                v-model="registerData.USER_CODE"
                name="userCode"
                label="身份证号"
                placeholder="输入身份证"
                :rules="[
                    { required: true, message: '输入身份证' },
                    { pattern:/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,message: '请输入正确身份证号'}]"
            />
            <van-field
                v-model="registerData.USER_PHONE"
                name="userPhone"
                label="手机号"
                placeholder="请输入手机号"
                :rules="[
                    { required: true, message: '请填写手机号' },
                    {pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,message: '请填写正确手机号！'}
                ]"
            />
            <van-field
                v-model="registerData.USER_PASSWORD"
                type="password"
                name="userPassword"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
                v-model="registerData.confirmPassword"
                type="password"
                name="confirmPassword"
                label="确认密码"
                placeholder="请确认密码"
                :rules="[
                    { required: true, message: '请再次输入密码' },
                    { validator: confirmPassword,message: '两次密码不一致'}
                ]"
            />
            <van-field name="userGender" label="性别" :rules="[{ required: true, message: '请选择性别' }]">
              <template #input>
                <van-radio-group v-model="registerData.USER_GENDER" direction="horizontal">
                  <van-radio name="0">女</van-radio>
                  <van-radio name="1">男</van-radio>
                </van-radio-group>
              </template>
            </van-field>

          </van-cell-group>
          <div style="margin: 16px;">
            <van-button :color="cssVar.DarkThemeGreen" block native-type="submit">
              注册
            </van-button>
          </div>
          <div style="margin: 16px;">
            <van-button @click="loginPage = true" block>
              返回
            </van-button>
          </div>
        </van-form>

      </div>
    </div>
  </div>

</template>

<script setup>
import {reactive, ref} from "vue";
import Request from "@/utils/Request.js"
import cssVar from "/src/assets/style/globalVariables.module.scss"
import {Toast} from "vant";
import {useUserStore} from "@/stores/userStore.js";
import router from "@/router/index.js";

//引入pinia实体
const userStore = useUserStore();
//登录表单：true  注册表单：false
const loginPage = ref(true);

//登录-----------------------------------
const username = ref('');
const password = ref('');

/**登录*/
const onSubmit = (values) => {
  values.role = "0"  //0代表用户
  Request.post('/user/login',values).then(res =>{
    if (res.status === 200){
      Toast("登录成功");
      //初始化个人信息
      userStore.initUser(res.data);
      localStorage.setItem("NurseToken",res.data.userPassword);
      router.back();
    }else {
      Toast.fail(res.msg);
    }
  })
};


//注册-----------------------------------
const registerData = reactive({
  USER_CODE:"",
  USER_PHONE:"",
  USER_PASSWORD:"",
  confirmPassword:"",
  USER_GENDER:"",
  USER_NAME:""
})
/**验证密码是否一直*/
const confirmPassword = (val) => {
  return val === registerData.USER_PASSWORD;
}
/**注册*/
const onRegister = (values) =>{
  console.log(values)
  Request.post("/user/register",values).then(res => {
    if (res.status === 200){
      Toast("注册成功，请登录！")
      loginPage.value = true
    }else {
      Toast("注册失败"+res.msg)
    }
  })
}


</script>

<style lang="scss" scoped>
.background {
  background-color: white;
  min-height: 100vh;

  .container {
    padding: 5px;

    .headerTitle {
      margin: 16px 16px 40px 16px;
      text-align: center;
    }

    :deep(.van-field) {
      padding: 10px 0;
    }

    .login {

      .subText {
        margin: 5px 16px;
        color: lightgrey;
        font-size: smaller;
      }
    }

    .register {

    }


  }

}
</style>
