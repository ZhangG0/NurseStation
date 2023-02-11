<template>
  <el-config-provider :locale="zhCn">
  <el-card class="fillContainer NurseManagement">
    <!--    功能区域-->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="addNurse">新增</el-button>
      <el-button type="primary" disabled>导入表格</el-button>
      <el-button type="primary" disabled>导出为表格</el-button>
    </div>
    <!--    搜索区域-->
    <div style="margin: 10px 0">
      <el-input label="护士查询" v-model="search" placeholder="请输入关键字" style="width: 15%" clearable />
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
        v-for="(item,index) in json.nurse"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.isSort"
        />
      <el-table-column prop="nurseRole" label="身份类型">
        <template v-slot="scope"><span v-text="scope.row.nurseRole === 0?'护士':'管理员'"/></template>
      </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button size="small"  @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDelete(scope.row.nurseCode)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
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

    <!--新增弹出框-->
    <el-dialog
        v-model="dialogVisible"
        title="新增"
        width="30%">

      <el-form :model="form.value" label-width="80px" :rules="rules" ref="formDom">
        <el-form-item prop="userPhone" label="手机号">
          <el-input v-model="form.value.userPhone" style="width: 80%"/>
        </el-form-item>
        <el-form-item prop="nurseName" label="护士姓名">
          <el-input v-model="form.value.nurseName" style="width: 80%"/>
        </el-form-item>
        <el-form-item prop="nurseTitle" label="职称">
          <el-select v-model="form.value.nurseTitle" style="width:80%" placeholder="选择职称">
            <el-option
                v-for="(item,index) in staticData.nurseTitle"
                :key="index"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="nurseDept" label="科室">
          <el-input v-model="form.value.nurseDept" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="擅长领域">
          <el-input type="textarea" v-model="form.value.areasOfExpertise" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="执业经历">
          <el-input type="textarea" v-model="form.value.professionalExperience" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="管理身份">
          <el-select v-model="form.value.nurseRole" style="width:80%" placeholder="选择身份">
            <el-option label="护士" :value="0"/>
            <el-option label="管理员" :value="100"/>
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button v-if="isAdd" type="primary" @click="save">完成</el-button>
            <el-button v-else type="primary" @click="saveEdit">确认编辑</el-button>
          </span>
      </template>
    </el-dialog>
  </el-card>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import Request from '@/utils/Request.js';
import json from '@/assets/json/tableColumn.json';
import staticData from "@/assets/json/staticData.json";
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const tableData = reactive({
  value:[]
});
const search = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogVisible = ref(false);
const form = reactive({ value:{
    userPhone:"",
    nurseName:"",
    nurseTitle:"",
    nurseDept:"",
    areasOfExpertise:"",
    professionalExperience:"",
    nurseRole:0
  }

})
const formDom = ref(null);
const rules = reactive({
  userPhone:[
    {
      required:true,
      message: '请输入手机号',
      trigger: 'blur',
    },
    {
      pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
      message: '请输入正确手机号',
      trigger: 'change'
    },
  ],
  nurseName:[
    {
      required:true,
      message: '请输入姓名',
      trigger: 'blur',
    },
  ],
  nurseTitle:[
    {
      required: true,
      message: '请选择职称',
      trigger: 'change',
    },
  ],
  nurseDept:[
    {
      required:true,
      message: '请输入部门',
      trigger: 'blur',
    },
  ],
})
const isAdd = ref(true);

onMounted(() =>{
  load();
})
//查询
const load = () => {
  Request.get('/admin/allNurseInfo',{
    params:{
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
//编辑用户
const handleEdit = (row) => {
  form.value = row;
  isAdd.value = false;
  dialogVisible.value = true;
}
//删除用户
const handleDelete = (id) => {
  Request.post("/nurse/deleteNurse", {nurseCode:id}).then((res) => {
    if (res.status === 200){
      load();
      ElMessage.success("新增成功");
    }else {
      ElMessage.error(res.msg);
    }
  })
}
//新增用户
const addNurse = () => {
  dialogVisible.value = true
  initFormData();
}
const save = () => {
  formDom.value.validate((val) => {
    if (val){
      Request.post("/nurse/addNurse",form.value).then((res) => {
        if (res.status === 200){
          ElMessage.success("新增成功");
          dialogVisible.value = false;
          load();
        }else {
          ElMessage.error("新增失败," + res.msg);
        }
      })
    }
  })
}
const saveEdit = () => {
  formDom.value.validate((val) => {
    if (val){
      Request.post("/nurse/editNurse",form.value).then((res) => {
        if (res.status === 200){
          ElMessage.success("编辑成功");
          dialogVisible.value = false;
          isAdd.value = false;
          load();
        }else {
          ElMessage.error("编辑失败," + res.msg);
        }
      })
    }
  })

}
//初始化form表单信息
const initFormData = () => {
  Object.keys(form.value).forEach((key)=>{
    if (key === "nurseRole"){
      form.value[key] = 0;
    }else {
      form.value[key] = '';
    }
  })

}
</script>

<style lang="scss" scoped>

.NurseManagement{
  background-color: white;
  margin: 5px;
}
</style>
