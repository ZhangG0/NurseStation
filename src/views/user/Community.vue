<template>
  <div class="background_div flexCenter">
<!--    header-->
    <van-sticky>
      <van-nav-bar title="互动社区" style="width: 100vw;" />
    </van-sticky>
<!--轮播图-->
    <el-card>
      <van-swipe class="swipe" :autoplay="3000" lazy-render>
        <van-swipe-item v-for="image in images" :key="image">
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
          <el-button size="small">+</el-button>
        </template>
      </van-nav-bar>

      <div
          class="theContent"
      >

        <div>

          <dynamic-card
              v-for="(item,index) in showData.value"
              :showData="item"
              :key="index"
          ></dynamic-card>

        </div>

      </div>

    </el-card>

  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Community"
}
</script>
<script setup>
import {dynamicCard} from "@/components/index.js";
import {reactive} from "vue";

const showData = reactive({value:[
    {
      userName:"地区医院骨科第一钻头王医生",
      userAvatarUrl:"",
      userTitle:"骨科",
      articleTitle:"小儿发烧该如何治疗？",
      articleContent:"多半是装的，打一顿就好！怎么打呢？这个很简单我们首先拿起一个扫把，然后去往他的屁股上咚咚咚。多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！多半是装的，打一顿就好！",
      lastTime:"2022年12月22日",
      info:{
        like:15,
        comment:23,
        collection:20
      }

    },
    {
      userName:"地区医院骨科第一锤子李医生",
      userAvatarUrl:"",
      userTitle:"骨科",
      articleTitle:"小儿发烧该如何治疗！！？",
      articleContent:"我一个榔头包治百病",
      lastTime:"2022年12月12日",
      info:{
        like:10,
        comment:23,
        collection:20
      }

    }
  ]})

const images = [
  'src/assets/img/LBT-IMG.png',
  'src/assets/img/LBT-IMG2.png',
  'src/assets/img/LBT-IMG.png',
];
</script>

<style lang="scss" scoped>
.background_div{
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
