<template>
  <el-config-provider :locale="zhCn">
    <el-card class="evaluationForm">
      <el-page-header @back="back">
        <template #content>
          <span class="text-large font-600 mr-3"> 病患评估表 </span>
        </template>
      </el-page-header>

      <!--    搜索区域-->
      <div style="margin: 20px 0">
        <el-input
            label="用户查询"
            v-model="search"
            placeholder="请输入关键字"
            style="width: 15%"
            clearable />
        <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>
      </div>
      <!--表格展示区域    -->
      <el-table
          :data="tableData.value"
          border
          stripe
          style="width: 100%">
        <!--利用JSON配置-->
        <el-table-column
            v-for="(item,index) in json.evaluationForm"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :sortable="item.isSort">
          <template #default="scope">
            <el-result
                v-if="item.prop === 'todayEvaluation'"
                :icon="scope.row.todayEvaluation?'success':'error'"
            />
          </template>

        </el-table-column>

        <el-table-column class="flexCenter" fixed="right" align="center" label="操作" width="140">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">填写评估表</el-button>
            <el-button size="small"
                       style="margin-top: 5px;margin-left: 0"
                       @click="openAllEvaluation(scope.row.userCode)"
                        >查看评估表</el-button>
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
          title="新增电子评估表"
          width="30%">
        <el-form
            :model="form.value"
            label-width="80px"
            hide-required-asterisk
            ref="formDom">
          <el-form-item prop="userCode" label="患者编码">
            <el-input v-model="form.value.userCode" disabled/>
          </el-form-item>
          <el-form-item prop="userName" label="患者姓名">
            <el-input v-model="form.value.userName" disabled/>
          </el-form-item>
          <el-form-item prop="evaluationDate" label="评估日期" :rules="[
              {
                required: true,
                message: '请选择一个日期',
                trigger: 'blur'
              }
          ]">
            <el-date-picker
                v-model="form.value.evaluationDate"
                type="date"
                value-format="YYYY-MM-DD"
                style="width: 100%;"
            />
          </el-form-item>

          <el-form-item
              v-for="(item, index) in form.domains"
              :key="index"
              :label="item.displayName"
              :prop="item.displayAttr + 'Value'"
              :rules="[
                {
                  required: true,
                  message: item.displayName + '选项不能为空',
                  trigger: 'blur',
                },
              ]"
          >
            <el-input
                v-model="form.value[item.displayAttr + 'Value']"
                style="width: 89.5%;margin-right: 10px"
                type="textarea"
                autosize
                autofocus
            />
            <el-button
                circle
                class="mt-2"
                @click.prevent="removeDomain(index)"
                :icon="CloseBold"
                style="width: 17px;height: 17px"
                type="danger"
                size="small"/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="evaluationItemDisplayName"
                      style="width: 66.5%"
                      @keyup.enter="addEvaluationItem(evaluationItemDisplayName)"
                      placeholder="请输入评估项"/>
            <el-button type="primary"
                       style="margin-left: 10px"
                       @click="addEvaluationItem(evaluationItemDisplayName)">新增评估项</el-button>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEvaluationForm">完成</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

  </el-config-provider>
</template>

<script setup>
import router from "@/router/index.js";
import {CloseBold} from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import Request from '@/utils/Request.js';
import json from '@/assets/json/tableColumn.json';
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import dayjs from "dayjs";
import {useUserStore} from "@/stores/userStore.js";

const userStore = useUserStore();
const tableData = reactive({
  value:[]
});
const search = ref("");
//页码
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
//end
const dialogVisible = ref(false);
const form = reactive({
  value:{
    userCode:"",
    userName:"",
    evaluationDate:"",
  },
  //动态输入框
  domains:[]

})
const formDom = ref(null);
const evaluationItemDisplayName = ref('');

onMounted(() =>{
  load();
})
//查询
const load = () => {
  Request.get('/evaluation/getAllTable',{
    params:{
      nurseCode: userStore.userData.nurseCode,
      nurseRole: userStore.userData.nurseRole,
      pageNum:currentPage.value,
      pageSize:pageSize.value,
      search:search.value
    }}).then(res => {
    if (res.status === 200){
      tableData.value = res.data.records;
      total.value = res.data.total;
    }else {
      ElMessage.error("获取失败");
    }
  })

}
//新增评估表
const handleEdit = (row) => {
  form.value = {
    userCode: row.userCode,
    userName: row.userName,
    nurseCode: userStore.userData.nurseCode,
    nurseName: userStore.userData.nurseName,
    evaluationDate: dayjs().format("YYYY-MM-DD")
  }
  dialogVisible.value = true;
}
//查看该患者历史评估表
const openAllEvaluation = (userCode) => {
  router.push({name:'PersonAllEvaluation',query: {userCode:userCode}});
}
//dialog完成按钮 保存评估表
const saveEvaluationForm = () => {
  try {
    form.domains.forEach((item) => {
      form.value[item.displayAttr + 'Name'] = item.displayName
    })
    Request.post('/evaluation/addEvaluationForm',form.value).then((res) => {
      if (res.status === 200){
        ElMessage.success("已完成【" + form.value.userName + "】的评估");
        load();
        dialogVisible.value = false;
      }else {
        ElMessage.error(res.msg);
      }
    })
  }catch (e) {
    ElMessage.error("出问题啦，请重试~")
  }

}
//新增评估项
const addEvaluationItem = (displayName) => {
  const displayAttr = "def" + form.domains.length;
  if (displayName){
    const obj = {
      displayName: displayName,
      displayAttr: displayAttr
  }
    form.domains.push(obj);
    //清空输入框
    evaluationItemDisplayName.value = "";
  }else {
    return ElMessage.error("评估项不可为空！");
  }
}
//删除动态输入框
const removeDomain = (index) => {
  if (index !== -1) {
    delete form.value[form.domains[index].displayAttr + 'Value']
    form.domains.splice(index, 1);
  }
}
const back = () => {
   router.back();
}
</script>

<style lang="scss" scoped>
.evaluationForm{
  margin: 5px;
  width: 100%;

  :deep(.el-result){
    padding: 0;
  }
  :deep(.icon-success){
    height: 20px;
  }
  :deep(.icon-error){
    height: 20px;
  }
  :deep(.el-dialog__footer){
    padding-top: 0;
  }

}
</style>
