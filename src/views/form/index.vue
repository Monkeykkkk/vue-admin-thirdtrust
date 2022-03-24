<template>
  <div class="app-container">

    <el-form ref="data" label-width="120px">
      <el-form-item label="业务类型:">
        <el-select v-model="selectValue" placeholder="请选择你们的业务" filterable>
          <el-option v-for="v in types" :value="v" :key="v.index">{{ v }}</el-option>
        </el-select>
        <el-button @click="isAddThird = !isAddThird" type="primary">添加业务类型</el-button>
      </el-form-item>

      <el-form-item label= "添加业务:" v-show="isAddThird">
        <el-col :span="1" class="line">from:</el-col>
        <el-col :span="3">
          <el-input label="from" v-model="from" placeholder="请输入from值"/>
        </el-col>
        <el-col :span="2" class="line">中文含义:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="means" placeholder="请输入业务方名称" />
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="AddFrom" type="primary" class="line">添加</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="绑定关系:">
        <el-col :span="3" class="line">账号/手机号/邮箱:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="mobile" placeholder="请输入账号/手机号/邮箱"/>
        </el-col>
        <el-col :span="1" class="line">pin:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="pin" placeholder="请输入pin" />
        </el-col>
        <el-col :span="1" class="line">xid:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="xid" placeholder="请输入xid" />
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="Search" type="primary" class="line">查询</el-button>
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="Bind" type="primary" class="line">绑定pin和xid</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="查询结果:" v-if="isAccessUnbind">
        <label>
          {{ returnValue }}
          <el-button @click="Unbind" type="primary" class="line">解绑</el-button>
        </label>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import request from '@/utils/request'
import { Message } from 'element-ui'

const FILTER_SPACE = /(^\s*)|(\s*$)/g;

export default {
  name: 'ThirdTrust',
  data() {
    return {
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
      columns: ['时间', 'pin', 'xid', '渠道值', '操作', '操作人'],
      columnsKey: ['logTime', 'pin', 'xid', 'from', 'operator', 'erp'],
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
      request.get('getAllFromInfo').then((result) => {
        // 通过 result.data 拿到服务器返回的成功的数据
        this.returnValue = result.replyMessage;
        if (result.replyCode === 0) {
          this.types = result.replyData;
        }
      })
    },

    AddFrom() {
      if (this.from.replace(FILTER_SPACE, '').length !== 0 && this.means.replace(FILTER_SPACE, '').length !== 0) {
        this.from = parseInt(this.from);
        request.get(`addFromInfo?from=${this.from}&info=${this.means}`);
        this.from = '';
        this.means = '';
        this.isAddThird = false;
        this.GetAllFromType();
      } else {
        Message({
          message: '请输入from与中文含义',
          type: 'error'
        })
      }
    },

    Unbind(){
      if (this.xid.replace(FILTER_SPACE, '').length === 0 || this.pin.replace(FILTER_SPACE, '').length === 0) {
        alert('请先查询，再解绑');
        return;
      }
      var xid = this.xid.replace(/#/g, '%23');
      request.get(`unbind?xid=${xid}&from=${this.selectValue}&pin=${this.pin}`).then((result) => {
        this.returnValue = result.replyMessage;
        this.pin = '';
        this.xid = '';
        this.isAccessUnbind = false;
      })
    },

    Bind() {
      if (this.xid.replace(FILTER_SPACE, '').length == 0 || this.pin.replace(FILTER_SPACE, '').length == 0) {
        Message({
          message: '请输入pin和xid',
          type: 'error'
        })
        return;
      }
      var msg = '确认要在' + this.means + '绑定pin(' + this.pin + ')与xid(' + this.xid + ')么？';
      this.$confirm(msg, '绑定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        callback: action => {
          if (action === 'confirm') {
            return this.dobind();
          }
          else {
            return;
          }
        }
      })

    },

    dobind() {
      request.get('bind', {
        params: {
          xid: this.xid,
          pin: this.pin,
          from: this.selectValue
        }
      }).then((result) => {
        console.log(result);
        if (result.replyCode !== 0) {
          Message({
            message: result.replyMessage,
            type: 'error'
          })
          return;
        }
        var msg = this.means + ', pin(' + this.pin + ') 与 xid(' + this.xid + ') 已成功绑定。';
        Message({
          message: msg,
          type: 'success',
          duration: 2 * 1000
        })
        return;
      })
    },

    Search() {
      console.log("Search is called.");
      if (this.mobile.replace(FILTER_SPACE, "").length !== 0) {
        return this.MobileSearch();
      }
      if (this.pin.replace(FILTER_SPACE, "").length !== 0) {
        return this.PinSearch();
      }
      if (this.xid.replace(FILTER_SPACE, "").length !== 0) {
        return this.XidSearch();
      }
      Message({
        message: '请输入需要查询的账号信息',
        type: 'error',
      })
      return;
    },

    MobileSearch() {
          if (this.mobile.replace(FILTER_SPACE, "").length === 0) {
            alert("请输入手机号/用户名/邮箱");
            return;
          }
          request.get(`getuserinfo?input=${this.mobile}&from=${this.selectValue}`).then((result) => {
            this.returnValue = result.replyMessage;
            if(result.replyCode == 0){
              this.returnValue += ", xid = " + result.replyxid + ", pin = " + result.replypin;
              this.pin = result.replypin;
              this.xid = result.replyxid;
              this.isAccessUnbind = true;
            } else {
			        this.isAccessUnbind = false;
			      }
          })
        },

    PinSearch() {
      if (this.pin.replace(FILTER_SPACE, "").length === 0) {
        alert("请输入pin");
        return;
      }
      request.get(`queryBindInfoByPin?pin=${this.pin}&from=${this.selectValue}`).then((result) => {
        this.returnValue = result.replyMessage;
        if(result.replyCode == 0){
          this.returnValue += ", xid = " + result.replyxid;
          this.xid = result.replyxid;
          this.isAccessUnbind = true;
        } else {
          this.isAccessUnbind = false;
        }
      })
    },

    XidSearch() {
      if (this.xid.replace(FILTER_SPACE, "").length === 0) {
        alert("请输入xid");
        return;
      }
      request.get(`mapping?xid=${this.xid}&from=${this.selectValue}`).then((result) => {
        this.returnValue = result.replyMessage;
        if(result.replyCode == 0){
          this.returnValue += ", pin = " + result.replypin;
          this.pin = result.replypin;
          this.isAccessUnbind = true;
        } else {
          this.isAccessUnbind = false;
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

