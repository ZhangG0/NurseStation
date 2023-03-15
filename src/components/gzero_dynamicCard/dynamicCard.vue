<template>
  <div class="info-card">
    <!--    头部用户信息-->
    <header>
      <van-image
          width="50px"
          height="50px"
          round
          :src="props.showData.userAvatarUrl?props.showData.userAvatarUrl:avatarImg"/>
      <div class="name-title">
        <span class="name">{{props.showData.userName}}</span>
        <span class="title" v-if="props.showData.userTitle">{{props.showData.userTitle}}</span>
      </div>
    </header>
    <!--    文字部分-->
    <article>
      <h4 style="margin-left: 0">
        {{props.showData.articleTitle}}
      </h4>
      <article>
        {{props.showData.articleContent}}
      </article>
    </article>
    <!--    时间戳-->
    <div class="time">
      {{props.showData.releaseTime}}
    </div>
    <!--    尾部点赞评论收藏数量-->
    <footer>
      <div class="footerItem">
        <span class="iconfont icon-dianzan "></span>
        <span>{{props.showData.likes}}</span>
      </div>
      <div class="footerItem">
        <span class="iconfont icon-xiaoxi"/>
        <span>{{props.showData.comment}}</span>
      </div>
      <div class="footerItem">
        <span class="iconfont icon-xihuan" />
        <span>{{props.showData.collection}}</span>
      </div>
    </footer>

  </div>
</template>


<script setup>
import avatarImg from '@/assets/img/defaultAvatar.png'

const props = defineProps({
  showData:{
    type:Object,
    default: () => ({
      userName:"地区医院骨科第一钻头王医生",
      userAvatarUrl:"",
      userTitle:"骨科",
      articleTitle:"小儿发烧该如何治疗？",
      articleContent:"多半是装的，打一顿就好！怎么打呢？这个很简单我们首先拿起一个扫把，然后去往他的屁股上咚咚咚。多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！",
      releaseTime:"2022年12月22日",
      like:15,
      comment:23,
      collection:20
    })
  }
})
</script>

<style lang="scss" scoped>
.info-card{
  padding: 10px;


  header{
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    justify-content: flex-start;

    .name-title{
      margin-left: 5px;
      display: flex;
      flex-flow: column;
      justify-content: center;

      .name{

      }
      .title{
        color: var(--el-text-color-secondary);
        font-size: 14px;
        font-family: cursive;
      }
    }
  }

  .time{
    margin: 5px 0;
    color: #8c8b8b;
    font-size: 14px;
  }

  article{

    h4{
      margin: 5px 0 10px 5px;
    }

    article{
      display: -webkit-box;         //定义为盒子模型显示
      -webkit-line-clamp: 2;        //用来限制在一个块元素显示的文本的行数
      -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
      overflow: hidden;             //超出隐藏
      text-overflow: ellipsis;      //隐藏显示...
      //white-space: nowrap;          //不换行
    }
  }

  footer{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-content: center;

    .footerItem{
      width: 33%;
      text-align: center;
    }
  }
}
</style>
