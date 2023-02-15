//菜单栏四个页面
import UserIndex from "@/views/user/UserIndex.vue";  //today 今日医疗
import Community from "@/views/universal/Community.vue";  //社区
import MyMessage from "@/views/user/MyMessage.vue";  //消息（联系人）
import PersonInfo from "@/views/user/PersonInfo.vue"; //个人信息
import ArticleDetail from "@/views/universal/ArticleDetail.vue"; //文章详情



//ADMIN 管理员
import AdminHome from "@/views/admin/Home.vue";
import AdminLogin from "@/views/admin/login.vue"
import UserManagement from "@/views/admin/UserManagement.vue";
import NurseManagement from "@/views/admin/NurseManagement.vue";
import EvaluationForm from "@/views/admin/EvaluationForm.vue"
import PersonAllEvaluation from "@/views/admin/PersonAllEvaluation.vue"

//USER 用户
import UserLogin from "@/views/user/UserLogin.vue";


export {
    UserIndex,
    Community,
    ArticleDetail,
    PersonInfo,
    MyMessage,
    AdminHome,
    AdminLogin,
    UserManagement,
    NurseManagement,
    EvaluationForm,
    PersonAllEvaluation,
    UserLogin,

}
