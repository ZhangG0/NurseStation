<template>
  <el-config-provider :locale="zhCn">
    <el-card class="personAllEvaluation">

      <el-page-header @back="back">
        <template #content>
          <span class="text-large font-600 mr-3"> 评估表历史明细 </span>
        </template>
      </el-page-header>

      <!--    搜索区域-->
      <div style="margin: 20px 0">
        <el-date-picker
            v-model="search"
            type="date"
            placeholder="查询当天评估日志"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
            @update:modelValue="load"
        />
<!--        <el-input-->
<!--            label="用户查询"-->
<!--            v-model="search"-->
<!--            placeholder="请输入关键字"-->
<!--            style="width: 15%"-->
<!--            clearable/>-->
<!--        <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>-->
      </div>
      <!--表格展示区域    -->
      <el-table
          :data="tableData.value"
          border
          stripe
          style="width: 100%">
        <!--利用JSON配置-->
        <el-table-column
            v-for="(item,index) in json.personEvaluation"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.isSort"/>

        <el-table-column class="flexCenter" fixed="right" align="center" label="操作" width="140">
          <template #default="scope">
            <el-button size="small" @click="formDetail(scope.row)">查看评估表详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--页码    -->
      <div style="margin: 10px 0">
        <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20,50,100]"
            :page-size="pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="load"
            @current-change="load"
        >
          总条数
        </el-pagination>
      </div>


      <el-dialog
          v-model="dialogVisible"
          title="电子评估表详情"
          draggable
          center
      >
        <el-descriptions
            border
            :column="2"
            :title="detailData.value.evaluationDate + ' 评估详细信息'">
          <el-descriptions-item label="评估编码">{{ detailData.value.evaluationCode}}</el-descriptions-item>
          <el-descriptions-item label="评估时间">{{ detailData.value.evaluationDate}}</el-descriptions-item>
          <el-descriptions-item label="患者姓名">{{ detailData.value.userName}}</el-descriptions-item>
          <el-descriptions-item label="患者编号">{{ detailData.value.userCode}}</el-descriptions-item>
          <el-descriptions-item
              v-for="(item,index) in detailData.value.evaluationData"
              :key="index"
              :span="2"
              :label="item.defName">{{ item.defValue }}</el-descriptions-item>
        </el-descriptions>

        <template #footer>
          <span class="dialog-footer">
            <el-button style="width: 120px" type="primary" @click="dialogVisible = false">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import {useRoute} from "vue-router";
import router from "@/router/index.js";
import {onMounted, reactive, ref} from "vue";
import Request from '@/utils/Request.js';
import json from '@/assets/json/tableColumn.json';
import {ElMessage} from "element-plus";
import {getObjLength} from "@/utils/ZhangG0CommonUtils.js";

const userCode = useRoute().query.userCode;
const tableData = reactive({
  value: []
});
const search = ref("");
//搜索快捷选项
const shortcuts = [
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]
//页码
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
//dialog
const dialogVisible = ref(false);
const detailData = reactive({value:{}})
/**挂载*/
onMounted(() => {
  load();
})
//查询个人的所有评估表，按时间排序。
const load = () => {
  console.log(search.value)
  Request.post('evaluation/getPersonEvaluation', null, {
    params: {
      userCode: userCode,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      search: search.value
    }
  }).then(res => {
    if (res.status === 200) {
      tableData.value = res.data.records;
      total.value = res.data.total;
    } else {
      ElMessage.error("获取失败", +res.msg);
    }
  })

}
//查看评估表详情
const formDetail = (row) => {
  // detailData.value = row;
  const {userName,userCode,evaluationDate,evaluationCode,...domains} = row;
  const evaluationData = [];
  let tempObj = {};
  //循环domains将所有自定义项两个两个合为一个对象，把所有对象变成一个数组
  Object.values(domains).forEach((value,index) => {
    if (index%2 === 0){
      tempObj.defName = value;
    }else if (index%2 === 1){
      tempObj.defValue = value;
    }
    if (getObjLength(tempObj) === 2){
      evaluationData.push(JSON.parse(JSON.stringify(tempObj)));
      tempObj = {};
    }

  })
  detailData.value = {
    userName: userName,
    userCode: userCode,
    evaluationDate: evaluationDate,
    evaluationCode: evaluationCode,
    evaluationData: evaluationData
  }
  dialogVisible.value = true;
}
//禁选日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
const back = () => {
  router.back();
}
</script>

<style lang="scss" scoped>
.personAllEvaluation {
  margin: 5px;
  width: 100%;

  .dialog-footer{
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
  }
}
</style>
