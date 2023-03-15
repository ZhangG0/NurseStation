<template>
  <div class="background_div flexCenter">
    <van-sticky>
      <van-nav-bar title="消息" style="width: 100vw;" />
    </van-sticky>
    <el-card class="message">
      <div class="collection Msg">
        <span class="icon iconfont icon-shoucang"></span>
        <span class="divText">收藏</span>

      </div>
<!--      <div class="collection Msg">-->
<!--        评论和@-->
<!--      </div>-->
     <div class="system Msg">
       <span class="icon iconfont icon-xitong"></span>
       <span class="divText">系统消息</span>
     </div>
    </el-card>
    <el-card class="friends">
      <van-badge
          v-for="(item,index) in mock"
          :key="index"
          style="width: 100%"
          :content="index"
          :show-zero="false"
          :offset="[-20,40]">
        <div class="card"
>
          <van-image
              class="card-avatar"
              round
              width="60px"
              height="60px"
              :src="item.userAvatarUrl?item.userAvatarUrl:avatarImg"
          />

          <span class="card-name">{{item.userName}}</span>
        </div>
      </van-badge>

    </el-card>
  </div>
</template>

<script setup>
import avatarImg from '@/assets/img/defaultAvatar.png';

const mock = [
  {
    userAvatarUrl: "",
    userName:"傅医生",
    userCode:""
  },
  {
    userAvatarUrl: "",
    userName:"陈医生",
    userCode:""
  },
  {
    userAvatarUrl: "",
    userName:"王老头",
    userCode:""
  }
]
</script>

<style lang="scss" scoped>
@import "@/assets/style/globalVariables.module.scss";

.message{
  margin-top: -10px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-content: center;
  justify-content: center;

  .collection{
    background-color: #ed806e;
  }

  .system{
    background-color: $ThemeGreen;
  }

  .Msg{
    width: 70px;
    height: 70px;
    margin: 10px 15px;
    display: inline-flex;
    text-align: center;
    border: 1px solid transparent;
    color: white;
    border-radius: 15px;
    flex-direction: column;
    justify-content: center;
    vertical-align: middle;

    .icon{
      font-size: 26px !important;
    }

    .divText{
      font-size: 13px;
      margin-top: 5px;
    }
  }
}

.friends{
  width: 100%;
  margin-top: 10px;
  min-height: 70vh;

  :deep(.el-card__body){
    padding: 0;
  }

  .card{
    width: 100%;
    height: 75px;
    border-bottom: 0.8px solid lightgrey;
    display: flex;
    justify-content: start;
    flex-flow: row wrap;
    align-content: center;


    .card-avatar{
      margin: 0 15px;
    }

    .card-name{
      font-size: large;
      text-align: center;
      padding-top: 20px;
    }
  }
}
</style>
