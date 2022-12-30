<template>
  <div class="SlidingTab">
    <div class="SlidingTab-header">
      <div class="SlidingTab-header-item">
        <div
            class="tab-item"
            v-for="(item, index) in tabList"
            :key="index"
            :class="[currentIndex === index ? 'active':'']"
            @click="changeTab(index)"
        >{{ item }}
        </div>
        <div class="active-line"></div>
      </div>
    </div>
    <div class="SlidingTab-content">
      <div class="SlidingTab-content-box"
           @touchstart="touchStart"
           @touchmove="touchmove"
           @touchend="touchend">
        <slot>
          <div
              v-for="(item, index) in dataList"
              :key="index"
          >
            <div class="absoluteCenterCol" style="height: 100%">
              <template
                  v-for="(value,key) in item"
                  :key="key"
              >

              </template>
            </div>

          </div>


        </slot>

      </div>
    </div>

  </div>

</template>

<script setup>
import smoothscroll from 'smoothscroll-polyfill';
import {onMounted, ref} from "vue";

/** 传入的props*/
const props = defineProps({
  /**
   * tabs显示文字的数组
   * @type Array
   */
  tabList: {
    type: Array,
    required: true,
    default: () => {
      return []
    }
  },
  dataList: {
    type: Array,
    default: () => {
      return []
    }
  },
  width: {
    type: String,
    default: "90vw"
  },
  tabWidth: {
    type: String,
    default: "60px"
  }
})
/**与tabsList长度相同*/
const dataLength = ref(props.tabList.length);
//分割tabWidth成数字和字母两个数组 然后计算线的宽度等等
/**单个tab宽度*/
const tabWidthNum = Number(props.tabWidth.match(/[a-z]+|[^a-z]+/gi)[0]);    //tab宽度
const tabWidthUnit = props.tabWidth.match(/[a-z]+|[^a-z]+/gi)[1];           //tab的计量单位
const lineWidth = (tabWidthNum * 0.8) + tabWidthUnit;                               //拼接移动线的宽
const lineMarginWidth = (tabWidthNum * 0.1) + 10 + tabWidthUnit;                    //拼接移动线的左margin(为了居中 10为tab的margin)
let currentIndex = ref(0);                                                    //游标 保证下划线和选中的tab一致
let index = 0;                                                                      //目前下标
/**判断移动方向*/
let startX = 0;                                                                     //开始的X坐标
let moveX = 0;                                                                      //移动中的X坐标
let headerScrollLength = undefined;                                                 //为了使被选择的tab居中主动去滚动滚动条的距离
/**挂载钩子*/
onMounted(() => {
  /**动态的把‘SlidingTab-content-box’赋值给展示框的每个元素*/
  for (let i = 0; i < dataLength.value; i++) {
    document.querySelector(".SlidingTab-content-box").children[i].className = "SlidingTab-content-item";
  }
  let itemWidth = document.querySelector(".SlidingTab-content-item").offsetWidth; //单个内容长度
  document.querySelector(".SlidingTab-content-box").style.width = itemWidth * dataLength.value + 'px'; //定内容box长为所有内容之和
  document.querySelector(".SlidingTab-header-item").style.width = (tabWidthNum + 20) * props.tabList.length + tabWidthUnit; //同上定tabs
  document.querySelector(".SlidingTab-content-box").style.left = -(itemWidth * (index)) + 'px'; //默认定位为今天
  document.querySelector(".active-line").style.left = ((tabWidthNum + 20) * (index)) + tabWidthUnit;   //下移动条位置
  /**滚动距离 = 使星期X到最左边（最初距离） 再往回（左边） -（减去） [整个header - 单个tab - 单个tab的左右margin ]/2   */
  headerScrollLength = (tabWidthNum + 20) * index - (document.querySelector(".SlidingTab-header").offsetWidth - tabWidthNum - 20) / 2;//可见框的宽度
  document.querySelector(".SlidingTab-header").scrollTo(headerScrollLength, 0);  //默认跳转定位（今天放中间）
})
/** 改变tab*/
function changeTab(indexTab) {
  index = indexTab;
  currentIndex.value = index;
  setMove(indexTab);
}

/** 设置偏移*/
function setMove(index) {
  let itemWidth = document.querySelector(".SlidingTab-content-item").offsetWidth;
  document.querySelector(".active-line").style.left = ((tabWidthNum + 20) * (index)) + tabWidthUnit;
  document.querySelector(".SlidingTab-content-box").style.left = -(itemWidth * (index)) + 'px';
  smoothscroll.polyfill(); //ios流畅滑动
  headerScrollLength = (tabWidthNum + 20) * index - (document.querySelector(".SlidingTab-header").offsetWidth - tabWidthNum - 20) / 2;//可见框的宽度
  document.querySelector(".SlidingTab-header").scrollTo({top: 0, left: headerScrollLength, behavior: 'smooth'});
}

/** 触摸开始事件*/
function touchStart(e) {
  startX = e.touches[0].clientX;

}

/**用于判断使点击事件还是触摸移动事件*/
let isClick = true;

/** 触摸移动事件*/
function touchmove(e) {
  moveX = e.touches[0].clientX;
  isClick = false;
}

/** 触摸结束事件*/
function touchend() {
  if (isClick) {
    console.log("is click");
    return null;
  } else {
    isClick = true
    /**根据触摸位置判断滑动方向*/
    if (moveX - startX > 0) {  //手指从左往右滑动（往前）
      index = index - 1;
      currentIndex.value = index;
      if (index >= 0) {        //判断是否tab下标超限
        setMove(index);
      } else {                 //循环 小于0则跳到数组最后
        index = dataLength.value - 1;
        currentIndex.value = index;
        setMove(index);
      }
    } else {                   //从右往左滑（往后）
      index = index + 1;
      if (index > dataLength.value - 1) {  //判断是否tab下标超限
        index = 0;                        //循环 大于最大下标则跳到最前
      }
      currentIndex.value = index;
      setMove(index);
    }
  }
}


</script>

<style lang="scss" scoped>
@import "@/assets/style/globalVariables.module.scss";

//页面内的变量
$content-item-width: v-bind(width);

.SlidingTab {
  width: $content-item-width;
  padding: 10px 0;
  margin: 10px;
  border-radius: 15px;
  background-color: white;
  //box-shadow: 2px 2px 5px grey;

  .SlidingTab-header {
    font-size: medium;
    color: $grayColor;
    margin: 10px;
    overflow: scroll;

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .SlidingTab-header-item {
      /*解决ios上滑动不流畅*/
      -webkit-overflow-scrolling: touch;
      white-space: nowrap; /* 合并空白和回车 */
      flex: none;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
      text-align: center;
      margin: 0 auto;

      .tab-item {
        display: inline-block;
        text-align: center;
        width: v-bind(tabWidth);
        margin: 10px 10px 5px 10px;
        cursor: pointer;
      }

      .active-line {
        position: relative;
        width: v-bind(lineWidth);
        height: 0.3rem;
        margin-left: v-bind(lineMarginWidth); //tab-item's margin 10px + tab-item's width * 10%
        border-radius: 1.5rem;
        border: 1px solid $ThemeGreen;
        background-color: $ThemeGreen;
        transition: left .5s;
      }

      .active {
        color: $DarkThemeGreen;
        font-weight: bolder;
        transition-delay: .25s;

      }
    }

  }

  .SlidingTab-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /*解决ios上滑动不流畅*/
    -webkit-overflow-scrolling: touch;
    white-space: nowrap; /* 合并空白和回车 */
    flex: none;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .SlidingTab-content-box {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: nowrap;
      transition: left .5s;


      :slotted(.SlidingTab-content-item) {
        flex-shrink: 0;
        display: inline-block;
        width: $content-item-width;
        padding: 10px;
        float: left;
        background-color: #ffffff;
        touch-action: none;

        .item {
          width: auto;
          margin: 0 0 15px 0;
        }
      }

      .nullSingers {
        color: $grayColor;
        text-align: center;
      }
    }
  }

}

</style>
