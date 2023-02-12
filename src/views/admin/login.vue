<template>
  <div class="flexCenter container">
    <el-card class="card">
      <span>欢迎登录<br/></span>
      <span>护士站管理系统</span>
      <div class="main flexCenter">
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
        >
          <el-menu-item index="1" @click="isAdmin = false">扫码登录</el-menu-item>
          <el-menu-item index="2" @click="isAdmin = true">账号密码</el-menu-item>
        </el-menu>

        <div class="loginBlock">
          <el-form
              v-if="isAdmin"
              class="myForm"
              :model="formData"
              :rules="rules"
              ref="form"
          >
            <el-form-item
                class="myFormItem"
                prop="phone"
            >
              <el-input
                  style="width: 250px;background-color:white"
                  placeholder="请输入用户名"
                  clearable
                  v-model="formData.phone"
              >
                <template #prepend>
                  <el-button class="iconfont icon-hushizhan" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item
                class="myFormItem"
                prop="password"
            >
              <el-input
                  style="width:250px"
                  placeholder="请输入密码"
                  show-password
                  v-model="formData.password"
              >
                <template #prepend>
                  <el-button class="iconfont icon-ziyuanxhdpi" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="护士登录"><el-switch v-model="isNurseLogin" /></el-form-item>

            <el-form-item class="myFormItem">
              <el-button
                  style="width: 250px;margin-top: 5px"
                  type="primary"
                  @click="login"
              >登录</el-button>
            </el-form-item>
          </el-form>
          <div style="margin: 10px" v-else>
            <qrcode-vue :value="qrCode" :size="130"></qrcode-vue>
            <div style="margin-top: 5px;font-family: cursive;font-weight: bolder ">请在手机端扫码登录</div>
          </div>

        </div>
      </div>




    </el-card>
  </div>
</template>

<script>
import {reactive} from "vue";
import Request from "../../utils/Request";
import {useUserStore} from "@/stores/userStore.js";
import {Toast} from "vant";

export default {
  name:"AdminLogin",
  data(){
    return {
      userStore:useUserStore(),
      formData:{},
      rules:reactive({
        phone:[
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '请输入十一位手机号',
            trigger: 'blur',
          },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
            message: '请输入正确手机号',
            trigger: 'blur'
          },
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            pattern:/^(?!\d+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/,
            message: '请输入6-20位包含英文字母、数字或者符号',
            trigger: 'blur'
          },
        ],
      }),
      isNurseLogin:true
    }
  },
  methods:{
    login(){
      this.$refs.form.validate( (val) => {
        if (val){
          if (this.isNurseLogin){
            const nurseLoginData = {
              userPhone:this.formData.phone,
              userPassword: this.formData.password,
              role:'1'
            }
            Request.post('/user/login',nurseLoginData).then(res =>{
              if (res.status === 200){
                Toast("登录成功");
                //初始化个人信息
                this.userStore.initUser(res.data);
                localStorage.setItem("NurseToken",res.data.userPassword);
                this.$router.push('/admin');
              }else {
                Toast.fail(res.msg);
              }
            })
          }else {
            Request.post('/admin/login',this.formData).then( res => {
              if (res.status === 200){
                let data = res.data
                window.localStorage.setItem("NurseToken",data.token);
                useUserStore().userData.nurseRole = 100;
                this.$message({
                  type:'success',
                  message:'登陆成功,'+res.msg,
                  center: true,
                  duration:1000
                })
                this.$router.push('/admin');
              }else {
                this.$message({
                  type:'error',
                  message:'登陆失败,'+res.msg,
                  center: true,
                  duration:1000
                })
              }
            }).catch(() => {
              this.$message({
                type:'error',
                message:'网络异常'
              })
            })
          }


        }
      })
    }
  }

}
</script>
<script setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const activeIndex = ref('1');
const isAdmin = ref(false);
const qrCode = ref("123456")
</script>



<style lang="scss" scoped>
.container{
  background-color: #e3e1e1;
  width: 100vw;
  height: 100vh;
  justify-content: center;

  :deep(.el-card__body){
    min-height: 290px;
  }

}

.card{
  width: 450px;
  text-align: center;

  span{
    font-size:larger ;
    font-weight: bolder;
  }

  //样式穿透
  :deep(.el-input-group__prepend){
    background-color: var(--el-fill-color-blank);
  }
}

.main{
  min-width: 200px;
  .loginBlock{

  }
}




</style>
