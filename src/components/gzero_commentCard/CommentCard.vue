<template>
  <div class="commentCard">
    <div @click="submitSonComment(null)">
      <header>
        <div class="name-title-avatar">
          <van-image
              width="40px"
              height="40px"
              round
              :src="props.commentInfo.userAvatarUrl?props.commentInfo.userAvatarUrl:avatarImg"/>
          <div class="name-title">
            <span class="name">{{ props.commentInfo.userName }}</span>
            <span class="title" v-if="props.commentInfo.userTitle">{{ props.commentInfo.userTitle }}</span>
          </div>
        </div>
        <div>
          <el-tag type="info" effect="plain" v-if="props.commentInfo.userName === props.author">楼主</el-tag>
        </div>
      </header>
      <article class="commentText">
        {{props.commentInfo.commentText}}
      </article>

      <footer >
        <!--    时间戳-->
        <div class="time">
          {{props.commentInfo.releaseTime}}
        </div>
        <div class="subCommentNum">
          <span class="iconfont icon-xiaoxi" style="font-size: 14px"/>
          <span>{{props.commentInfo.subComment.length??0}}</span>
        </div>

      </footer>
    </div>

    <!-- 二级和三级评论-->
    <div class="sub-comment-list" v-if="props.commentInfo.subComment.length > 0">
      <div
          v-for="(item,index) in props.commentInfo.subComment"
          :key="index"
          class="subComment">
        <div v-if="!item.replyName">
<!--         二级评论-->
          <div @click="submitSonComment(item.commentCode)">
            <el-tag type="info" color="#f9fafb" v-if="item.userName === props.author">楼主</el-tag>
            <span class="textName">{{item.userName}} :</span>
            {{item.commentText}}
          </div>
        </div>
<!--        三级评论-->
        <div v-else >
          <div @click="submitSonComment(item.commentCode)">
            <el-tag type="info" color="#f9fafb" v-if="item.userName === props.author">楼主</el-tag>
            <span class="textName">{{item.userName}}</span>
            <span class="text">回复</span>
            <el-tag type="info" color="#f9fafb" v-if="item.replyName === props.author">楼主</el-tag>
            <span class="textName">{{item.replyName}} :</span>
            {{item.commentText}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import avatarImg from '@/assets/img/defaultAvatar.png';

const emit = defineEmits(['submitSonComment']);
const props = defineProps({
  commentInfo:{
    type:Object,
    default: () => {return {
      userName:"地区医院骨科第一钻头王医生",
      userAvatarUrl:"",
      userTitle:"骨科 打杂的",
      releaseTime:"2022年12月22日",
      commentText:"我觉得顶啊!",
      subCommentNum:10,
      subComment:[
        {
          userName:"地区医院骨科第二钻头李医生",
          replyName:"",
          commentText:"老王头 6 ",
        },
        {
          userName:"王翠花",
          replyName:"地区医院骨科第二钻头李医生",
          commentText:"老王头 6 ",
        }
      ],
    }}
  },
  author:String
})
const submitSonComment = (commentDadlink) => {
  emit('submitSonComment',{
  commentLink:props.commentInfo.commentCode,
  commentDadlink:commentDadlink
  ,isSub:true})
};
</script>

<style lang="scss" scoped>
.commentCard{
  padding: 15px 0;
  border-top: 1px solid lightgray;

  header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;

    .name-title-avatar{
      display: flex;
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



  }

  .commentText{
    padding-top: 10px;



  }

  footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    font-size: 14px;
    color: #8c8b8b;
    filter: grayscale(100%);


    .time{
      display: inline-block;
    }

    .subCommentNum{
      display: inline-block;
      margin-right: 30px;
    }
  }

  .sub-comment-list{
    font-size: 14px;
    padding: 10px;
    background-color: #f9fafb;
    border-radius: 10px;

    .subComment{
      line-height: 24px;
      .text{
        font-size: 14px;
        color: #909399;
      }

      .textName{
        font-weight: bold;
        margin: 0 5px;
        font-size: 14px;
        color: #909399;
      }
    }


    span{
      line-height: 24px;
      vertical-align: middle;
    }
  }

}
</style>
