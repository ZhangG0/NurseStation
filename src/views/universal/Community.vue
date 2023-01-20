<template>
  <div class="background_div flexCenter">
<!--    header-->
    <van-sticky>
      <van-nav-bar title="互动社区" style="width: 100vw;" />
      <van-notice-bar
          class="noticeBar"
          left-icon="volume-o"
          text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。"
      />
    </van-sticky>
<!--轮播图-->
    <el-card style="width: 98vw">
      <van-swipe class="swipe" :autoplay="3000">
        <van-swipe-item v-for="(image,index) in images" :key="index">
          <img :src="image"  alt="图片"/>
        </van-swipe-item>
      </van-swipe>
    </el-card>
<!--    内容-->
    <el-card class="container">
      <van-nav-bar
          title=""
          class="theBar">
        <template #right>
<!--          <el-button  size="small"></el-button>-->
          <van-icon @click="addNewArticle" :color="cssVar.DarkThemeGreen" name="add-o" size="25px" />
        </template>
      </van-nav-bar>
<!--      新增文章-->
      <van-dialog
          style="padding: 0 10px"
          v-model:show="showDialog"
          title="新增文章"
          show-cancel-button
          @confirm="submitArticle"
      >
        <van-divider/>
        <van-form @submit="submitArticle">
          <van-cell-group inset>
            <van-field
                v-model="newArticleInfo.articleTitle"
                name="articleTitle"
                label="文章标题"
                :maxlength="20"
                placeholder="请输入文章标题"
                :rules="[{ required: true, message: '请输入文章标题' }]"
            />

            <van-field
                v-model="newArticleInfo.articleContent"
                rows="2"
                autosize
                label="文章内容"
                type="textarea"
                maxlength="250"
                placeholder="请输入文章内容"
                show-word-limit
                :rules="[{ required: true, message: '请输入文章内容' }]"
            />
          </van-cell-group>

        </van-form>
      </van-dialog>
      <div class="theContent">
<!--      论坛帖子-->
          <van-pull-refresh v-model="loading.pullRefresh" @refresh="onRefresh">
            <van-skeleton v-for="(item,index) in [].length = 3" :key="item+index" style="padding: 20px 10px" title avatar :row="3" :loading="loading.skeleton"/>
            <van-skeleton style="padding: 20px 10px" title avatar :row="3" :loading="loading.skeleton">
              <div v-if="showData.value.length">
                <DynamicCard
                    v-for="(item,index) in showData.value"
                    :showData="item"
                    :key="index"
                    @click="  router.push({name:'ArticleDetail',query: item})"/>
              </div>
              <van-empty style="min-height: 58vh" v-else image="search" description="没有帖子呢" />
            </van-skeleton>


          </van-pull-refresh>



      </div>

    </el-card>

  </div>
</template>

<script setup>
import {DynamicCard} from "@/components/index.js";
import {ref} from 'vue';
import {reactive} from "vue";
import {Dialog, Toast} from "vant";
import {useUserStore} from "@/stores/userStore.js";
import cssVar from "@/assets/style/globalVariables.module.scss";
import router from "@/router/index.js";
import Request from "@/utils/Request.js"
const VanDialog = Dialog.Component;
const userStore = useUserStore();

/**轮播图图片地址*/
const images = [
  'src/assets/img/LBT-IMG.png',
  'src/assets/img/LBT-IMG2.png',
  'src/assets/img/LBT-IMG.png',
];
/**End*/

/**论坛*/
const showData = reactive({value:[]});
Request.get("/article/getArticle").then(res => {
  if (res.status === 200){
    showData.value = res.data;
  }else {
    Toast.fail(res.msg)
  }
}).catch(() =>{Toast.fail("请求异常！")})
    .finally(() =>{loading.skeleton = false;});
const addNewArticle = () => {
  if (localStorage.getItem("NurseToken") && userStore.userData.userId === -1){
    Dialog.alert({
      message: '请先登录！',
      confirmButtonColor: cssVar.DarkThemeGreen,
      confirmButtonText: '登录'
    })
    router.push('/user/login');
  }else {
    showDialog.value = true;
  }
  //新增文章
}
const newArticleInfo = reactive({
  articleTitle:"",
  articleContent:""
})
const submitArticle = () => {
  newArticleInfo.userCode = userStore.userData.userCode;
  console.log(newArticleInfo)
  Request.post("/article/addNewArticle",newArticleInfo).then(res => {
    if (res.status === 200){
      newArticleInfo.articleContent = "";
      newArticleInfo.articleTitle = "";
      Toast.success("帖子发布成功");
    }else {
      Toast.fail(res.msg);
    }
  })
}
const showDialog = ref(false)
const loading = reactive({
  skeleton:true,  //骨架屏
  pullRefresh:false //下拉刷新
})
const onRefresh = () => {
  Request.get("/article/getArticle").then(res => {
    if (res.status === 200){
      showData.value = res.data;
      Toast("刷新成功");
    }else {
      Toast.fail(res.msg)
    }
  }).catch(() =>{
    Toast.fail("请求异常！")
  }).finally(()=>{loading.pullRefresh = false;});

};
/**End*/
</script>

<style lang="scss" scoped>
.background_div{

  .noticeBar{
    width: 100vw;
    padding: 0;

    :deep(.van-notice-bar__left-icon){
      padding-left: 15px;
    }
  }

  :deep(.el-card__body){
    padding: 5px;
  }
  .swipe{
    width: 100%;
    height: 160px;

    img{
      width: 100%;
      height: 100%;
    }
  }

  .container{
    width: 100%;
    .theBar{
      width: 100%;
    }
  }
}

</style>
<style module lang="scss" src="/src/assets/style/globalVariables.module.scss"></style>
<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Community"
}
</script>
