<template>
  <div class="flexCenter container">
    <el-card class="card">
      <span>欢迎登录<br/></span>
      <span>护士站管理系统</span>
      <el-form
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

        <el-form-item class="myFormItem">
          <el-button
              style="width: 250px;margin-top: 5px"
              type="primary"
              @click="login"
          >登录</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import {reactive} from "vue";
import Request from "../../utils/Request";

export default {
  name:"AdminLogin",
  data(){
    return {
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
      })
    }
  },
  methods:{
    login(){
      this.$refs.form.validate( (val) => {
        if (val){
          Request.post('/admin/login',this.formData).then( res => {
            if (res.status === 200){
              let data = res.data
              window.localStorage.setItem("token",data.token);
              this.$message({
                type:'success',
                message:'登陆成功,'+res.msg,
                center: true,
                duration:1000
              })
              this.$router.push('/adminHome');
            }else {
              this.$message({
                type:'error',
                message:'登陆失败,'+res.msg,
                center: true,
                duration:1000
              })
            }
          }).catch((err) => {
            console.log(err);
            this.$message({
              type:'error',
              message:'网络异常'
            })
          })

        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.container{
  background-color: #e3e1e1;
  width: 100vw;
  height: 100vh;
  justify-content: center;

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




</style>
