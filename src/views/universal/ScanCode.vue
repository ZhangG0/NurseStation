<template>
  <div  v-if="props.show" :show="props.show" @click="closeScanner" class="fillContainer codeBackground">
    <div class="wrapper">
      <qr-stream @decode="onDecode" @init="onInit" class="mb">
<!--        <div style="color: #00B5AAFF;" class="frame">321</div>-->
      </qr-stream>
    </div>

  </div>
</template>

<script setup>
// QrCapture,
//     QrDropzone,
import {
  QrStream,
} from 'vue3-qr-reader';
import Request from '/src/utils/Request.js'
import {ElMessage, ElMessageBox} from "element-plus";
import {Toast} from "vant";
import router from "@/router/index.js";

const emit = defineEmits(["closeScanner"]);
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
})


const closeScanner = () => {
  router.back();
  emit("closeScanner",false);
}

const onDecode = (result) =>{
  Request.post("/admin/scanQrLogin",null,{
    params:{
      uuid:result,
    }
  }).then((res) => {
    if (res.status === 200 && res.msg === "请确认登录"){
      ElMessageBox.confirm(
          '请确认是否在电脑端登录您的账号',
          {
            title:'请确认登录',
            confirmButtonText: '确认登录',
            cancelButtonText: '取消',
          }
      )
          .then(() => {
            //确认登录
            Request.post("/admin/confirmQrLogin",null,{
              params:{
                uuid:res.data,
                token:window.localStorage.getItem("NurseToken")
              }
            }).then((res) =>{
              if (res.status === 200){
                Toast.success("登陆成功")
              }else {
                Toast.fail(res.msg)
              }
            }).catch((err) => {
              return Toast.fail("登陆失败:" + err.msg)
            })

          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消登录',
            })
          })
    }else {
      Toast.fail(res.msg);
    }
  }).finally(() =>{
    // closeScanner();
    router.back();
  })
}

async function onInit (promise) {
  try {
    await promise
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      this.error = "ERROR: you need to grant camera access permission"
    } else if (error.name === 'NotFoundError') {
      this.error = "ERROR: no camera on this device"
    } else if (error.name === 'NotSupportedError') {
      this.error = "ERROR: secure context required (HTTPS, localhost)"
    } else if (error.name === 'NotReadableError') {
      this.error = "ERROR: is the camera already in use?"
    } else if (error.name === 'OverconstrainedError') {
      this.error = "ERROR: installed cameras are not suitable"
    } else if (error.name === 'StreamApiNotSupportedError') {
      this.error = "ERROR: Stream API is not supported in this browser"
    } else if (error.name === 'InsecureContextError') {
      this.error = `ERROR: Camera access is only permitted in secure context.
          Use HTTPS or localhost rather than HTTP.`;
    } else {
      this.error = `ERROR: Camera error (${error.name})`;
    }
  }
  }

</script>

<style scoped>
.codeBackground{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.wrapper {
  height: 100%;
}


</style>
