<template>
  <div class="components-container">
    <el-form ref="userForm" :model="userForm" ules="rules" label-width="100px" class="userForm" style="width: 500px; margin-left:50px;">
      <el-form-item prop="userAccount">
        <label>{{ userForm.account }}</label>
      </el-form-item>
      <el-form-item prop="userMobile">
        <label>{{ userForm.mobile }}</label>
      </el-form-item>
      <el-form-item prop="userEmail">
        <label>{{ userForm.email }}</label>
      </el-form-item>
      <el-form-item prop="roleName">
        <label>{{ userForm.roleNames }}</label>
      </el-form-item>
      <el-form-item prop="userNickName">
        <el-input v-model="userForm.nickname" placeholder="输入用户昵称" maxlength="32" />
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="userForm.realName" placeholder="输入用户姓名" maxlength="32" />
      </el-form-item>
      <el-form-item prop="province">
        <el-cascader v-model="userForm.areas" :options="provinceOptions" :props="props" filterable change-on-select style="width:100%;" />
      </el-form-item>
      <el-form-item prop="userGender">
        <el-radio-group v-model="userForm.gender">
          <el-radio :label="1">男性</el-radio>
          <el-radio :label="0">女性</el-radio>
          <el-radio :label="2">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="btn-submit">
        <el-button>取消</el-button>
        <el-button type="primary" @click="updateData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { queryUserInfo, updateUserInfo } from '@/api/system/user'
import Data from '@/api/pcaa'

export default {
  name: 'UserInfo',
  data() {
    return {
      userForm: {
        id: '',
        realName: '',
        account: '',
        nickname: '',
        mobile: '',
        email: '',
        roleNames: '',
        gender: 1,
        areas: [],
        comments: ''
      },
      rules: {
        userNickName: [
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      },
      show: false,
      baseUrl: '',
      params: {
        token: ''
      },
      provinceOptions: null,
      props: {
        children: 'children'
      },
      headers: {
        smail: '*_~'
      }
    }
  },
  created() {
    this.getAreaList()
    this.queryData()
  },
  methods: {
    queryData() {
      queryUserInfo().then((res) => {
        this.userForm = Object.assign({}, res.data)
        this.userForm.areas = [res.data.province, res.data.city, res.data.area]
        this.userForm.gender = parseInt(res.data.gender)
      })
    },
    updateData() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          updateUserInfo(this.userForm).then(() => {
            this.$message({
              message: '个人信息修改成功',
              type: 'success'
            })
          })
        }
      })
    },
    getAreaList() {
      let options = []
      for (let key in Data['86']) {
        let citys = []
        for (let keyc in Data[key]) {
          let areas = []
          for (let keya in Data[keyc]) {
            let area = { 'value': keya, 'label': Data[keyc][keya] }
            areas.push(area)
          }
          let city = { 'value': keyc, 'label': Data[key][keyc], 'children': areas }
          citys.push(city)
        }
        let province = { 'value': key, 'label': Data['86'][key], 'children': citys }
        options.push(province)
      }
      this.provinceOptions = options
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 150px;
    height: 150px;
    border-radius: 10px;
    cursor: pointer;
  }
  .btn-submit{
    float: right;
  }
</style>

