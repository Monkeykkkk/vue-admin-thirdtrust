<template>
  <div class="app-container">

    <el-form ref="ThirdTrustData" :model="ThirdTrustData" label-width="120px">
      <el-form-item label="业务类型:">
        <el-select v-model="ThirdTrustData.selectValue" placeholder="请选择你们的业务" filterable>
          <el-option v-for="v in ThirdTrustData.types" :value="v">{{ v }}</el-option>
        </el-select>
        <el-button @click="ThirdTrustData.isAddThird = !ThirdTrustData.isAddThird" type="primary">添加业务类型</el-button>
      </el-form-item>

      <el-form-item label= "添加业务:" v-show="ThirdTrustData.isAddThird">
        <el-col :span="1" class="line">from:</el-col>
        <el-col :span="3">
          <el-input label="from" v-model="ThirdTrustData.from" placeholder="请输入from值"/>
        </el-col>
        <el-col :span="2" class="line">中文含义:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="ThirdTrustData.means" placeholder="请输入业务方名称" />
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="AddFrom" type="primary" class="line">添加</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="绑定关系:">
        <el-col :span="3" class="line">账号/手机号/邮箱:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="ThirdTrustData.mobile" placeholder="请输入账号/手机号/邮箱"/>
        </el-col>
        <el-col :span="1" class="line">pin:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="ThirdTrustData.pin" placeholder="请输入pin" />
        </el-col>
        <el-col :span="1" class="line">xid:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="ThirdTrustData.xid" placeholder="请输入xid" />
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="Search" type="primary" class="line">查询</el-button>
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="Bind" type="primary" class="line">绑定pin和xid</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="查询结果:" v-if="ThirdTrustData.isAccessUnbind">
        <label>
          {{ form.name }}
          <el-button @click="Unbind" type="primary" class="line">解绑</el-button>
        </label>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import service from '@/utils/request'

export default {
  data() {
    return {
      ThirdTrustData: {
        isAddThird: false,
        selectValue: -15,
        types: [],
        from: '',
        means: '',
        mobile: '',
        pin: '',
        xid: '',
        returnValue: '',
        isAccessUnbind: false,
        columns: ["时间","pin","xid","渠道值","操作","操作人"],
        columnsKey: ["logTime","pin","xid","from","operator","erp"],
        loginInfo: [],
        logSearchPin: '',
        logSearchXid: '',
        logSearchErp: ''
    }
  },
  created() { // 当 vm 实例 的 data 和 methods 初始化完毕后，vm实例会自动执行created 这个生命周期函数
    this.GetAllFromType()
  },
  methods: {
    GetAllFromType() {
      //  当发起get请求之后， 通过 .then 来设置成功的回调函数
      this.$http.get('getAllFromInfo').then((result) => {
        // 通过 result.body 拿到服务器返回的成功的数据
        console.log(result.body)
        this.returnValue = result.body.replyMessage;
        if(result.body.replyCode == 0){
          this.types = result.body.replyData;
        } else if(result.body.replyCode == LOGIN_AGAIN_REPLY_CODE){
          window.location.href = "http://ssa.jd.com/sso/login?ReturnUrl=" + encodeURIComponent(window.location.href);
        } 
      })
    },

    AddFrom() {
      if (this.from.replace(FILTER_SPACE, "").length != 0 && this.means.replace(FILTER_SPACE, "").length != 0) {
        this.from = parseInt(this.from);
        this.$http.get(`addFromInfo?from=${this.from}&info=${this.means}`);
        this.from = '';
        this.means = '';
        this.isAddThird = false;
        this.GetAllFromType();
      }
    },

    Unbind(){
      if (this.xid.replace(FILTER_SPACE, "").length == 0 || this.pin.replace(FILTER_SPACE, "").length == 0) {
        alert("请先查询，再解绑");
        return;
      }
      var xid = this.xid.replace(/#/g, '%23');
      this.$http.get(`unbind?xid=${xid}&from=${fromType.selectValue}&pin=${this.pin}`).then((result) => {
        if(result.body.replyCode == LOGIN_AGAIN_REPLY_CODE){
          window.location.href = "http://ssa.jd.com/sso/login?ReturnUrl=" + encodeURIComponent(window.location.href);
        } 
        this.returnValue = result.body.replyMessage;
        this.pin = "";
        this.xid = "";
        this.isAccessUnbind = false;
      })
    },

    Bind() {

    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

