<template>
  <div class="background_div">
    <div class="article">
      <header>
        <van-image
            width="60px"
            height="60px"
            round
            :src="articleInfo.userAvatarUrl?articleInfo.userAvatarUrl:avatarImg"/>
        <div class="name-title">
          <span class="name">{{ articleInfo.userName }}</span>
          <span class="title" v-if="articleInfo.userTitle">{{ articleInfo.userTitle }}</span>
        </div>
      </header>
      <!--    文字部分-->
      <article>
        <h2 style="margin-left: 0">
          {{articleInfo.articleTitle}}
        </h2>
        <article>
          {{articleInfo.articleContent}}
        </article>
      </article>
      <div class="time">
        {{articleInfo.releaseTime}}
      </div>
    </div>
<!--    评论区-->
    <div class="article commentArea" ref="commentBar">
      <van-nav-bar>
        <template #left>
          <div style="font-size: 16px;font-weight: 500;color: #323233">
            全部评论
            <span class="time">
              ({{articleInfo.comment}}条)
            </span>
          </div>
        </template>
      </van-nav-bar>
      <div class="comment">
        <CommentCard
            v-for="(item,index) in commentInfo.value"
            :key="index"
            @submitSonComment="openSubmitComment"
            :comment-info="item"
            :author="articleInfo.userName"/>

      </div>
    </div>

<!--    点赞评论收藏动作吸底-->
    <van-action-bar class="footer" placeholder>
      <!--评论条      -->
      <div class="footerInput">
        <van-field @click="openSubmitComment({isSub:{value:false}})" disabled placeholder="请输入评论..."/>
      </div>
      <!--    尾部点赞评论收藏数量-->
      <div class="footerOther">
        <div class="footerItem">
          <span class="iconfont icon-dianzan "></span>
          <span>{{articleInfo.likes}}</span>
        </div>
        <div class="footerItem" @click="commentBar.scrollIntoView();">
          <span class="iconfont icon-xiaoxi"/>
          <span>{{articleInfo.comment}}</span>
        </div>
        <div class="footerItem">
          <span class="iconfont icon-xihuan" />
          <span>{{articleInfo.collection}}</span>
        </div>
      </div>

    </van-action-bar>

    <van-action-sheet v-model:show="show.inputComment" title="发表评论">
      <div class="inputComment">
        <van-form @submit="submitComment">
          <van-field
              v-model="inputComment.commentText"
              name="commentText"
              autofocus
              maxlength="50"
              placeholder="请输入评论...">
            <template #button>
              <van-button
                  style="min-width: 70px"
                  round
                  native-type="submit"
                  size="small">发送</van-button>
            </template>
          </van-field>
        </van-form>

      </div>
    </van-action-sheet>

  </div>

</template>

<script setup>
import {useRoute} from "vue-router";
import {reactive,ref} from "vue";
import {CommentCard} from "@/components/index.js"
import Request from "@/utils/Request.js"
import {Toast} from "vant";
import {useUserStore} from "@/stores/userStore.js";
import router from "@/router/index.js";
import avatarImg from '@/assets/img/defaultAvatar.png';

const getComments = (articleCode) => {
  Request.post('/article/getArticleComments', {articleCode: articleCode}).then(res => {
    if(res.status === 200){
      commentInfo.value =res.data
    }else {
      Toast.fail("评论获取异常");
    }
  })
}
const emit = defineEmits(['setTitle']);
emit("setTitle","医院论坛");
const route = useRoute();

const userStore = useUserStore();
const articleInfo = reactive(route.query);
const commentInfo = reactive({value:[]});
const show = reactive({
  inputComment:false
})

const commentBar = ref(null); //声明navBar的DOM
getComments(articleInfo.articleCode) //获得评论

const inputComment = reactive({
  commentText:"" //输入的评论
});
const subCommentCode = reactive({})

const openSubmitComment = (value) => {
  //判断登录态
  userStore.userData.userCode !== -1?show.inputComment = true:router.push('/user/login');
  if (value.isSub){
    subCommentCode.commentLink = value.commentLink
    subCommentCode.commentDadlink = value.commentDadlink;
  }else {
    return null;
  }
}
const submitComment = (value) => {
  value.commentLink = subCommentCode.commentLink;
  value.commentDadlink = subCommentCode.commentDadlink;
  value.articleCode = articleInfo.articleCode;
  value.userCode = userStore.userData.userCode;
  Request.post("/article/submitComment",value).then(res => {
    if (res.status === 200){
      commentInfo.value = res.data;
      articleInfo.comment++;
      inputComment.commentText = "";
      Toast(res.msg);
    }else {
      Toast(res.msg)
    }
  })
  show.inputComment = false;
}

</script>

<style lang="scss" scoped>
@import "@/assets/style/globalVariables.module.scss";

.background_div {
  padding: 0;
  .article{
    padding: 20px 30px;
    background-color: white;
    header {
      display: flex;
      flex-flow: row wrap;
      align-content: center;
      justify-content: flex-start;

      .name-title {
        margin-left: 5px;
        display: flex;
        flex-flow: column;
        justify-content: center;

        .name {

        }

        .title {
          color: var(--el-text-color-secondary);
          font-size: 14px;
          font-family: cursive;
        }
      }
    }

    .time{
      margin-top: 20px;
      color: #8c8b8b;
      font-size: 14px;
    }
  }

  .commentArea{
    border-top: 4px solid #f6f6f6;

    :deep(.van-nav-bar__left){
      padding: 0;
    }
  }

  .footer{
    position: relative;
    z-index: 100;
    display: flex;
    align-content: center;


    .footerInput{
      width: 70%;
      margin-left:10px;

      :deep(.van-field__control){
        background-color: #f6f6f6;
        padding-left: 10px;
        border-radius: 10px;

      }
    }

    .footerOther{
      width: 30%;
      display: flex;
      margin-right: 20px;
      justify-content: space-between;
      align-content: center;
      .footerItem{
        width: 33%;
        text-align: center;
      }
    }

  }

  .inputComment{
    height: 30px;
    padding-bottom: 30px;




  }

}

</style>
