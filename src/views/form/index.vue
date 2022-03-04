<template>
  <div class="app-container">

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="业务类型:">
        <el-select v-model="form.name" placeholder="请选择你们的业务" filterable>
          <el-option v-for="v in form.regions" :value="v">{{ v }}</el-option>
        </el-select>
        <el-button @click="form.delivery = !form.delivery" type="primary">添加业务类型</el-button>
      </el-form-item>

      <el-form-item label= "添加业务:" v-show="form.delivery">
        <el-col :span="1" class="line">from:</el-col>
        <el-col :span="3">
          <el-input label="from" v-model="form.name" placeholder="请输入from值"/>
        </el-col>
        <el-col :span="2" class="line">中文含义:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="form.name" placeholder="请输入业务方名称" />
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="form.delivery = !form.delivery" type="primary" class="line">添加</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="绑定关系:">
        <el-col :span="3" class="line">账号/手机号/邮箱:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="form.name" placeholder="请输入账号/手机号/邮箱"/>
        </el-col>
        <el-col :span="1" class="line">pin:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="form.name" placeholder="请输入pin" />
        </el-col>
        <el-col :span="1" class="line">xid:</el-col>
        <el-col :span="4">
          <el-input label="from" v-model="form.name" placeholder="请输入xid" />
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="form.delivery = !form.delivery" type="primary" class="line">查询</el-button>
        </el-col>
        <el-col :span="3" class="line">
          <el-button @click="form.delivery = !form.delivery" type="primary" class="line">绑定pin和xid</el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="查询结果:" v-if="form.delivery">
        <label>
          {{ form.name }}
          <el-button @click="form.delivery = !form.delivery" type="primary" class="line">解绑</el-button>
        </label>
      </el-form-item>
    </el-form>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        regions: ['shanghai', 'beijing'],
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
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

