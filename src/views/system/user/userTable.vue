<template>
  <div class="app-container content">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | sexNameFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
  import {fetchUserList} from '@/api/system/user'
  import Pagination from '@/components/Pagination'
  export default {
    name: "UserTable",
    components: { Pagination },
    data () {
      return {
        list: null,
        listLoading: true,
        tableKey: 0,
        total: 0,
        listQuery: {
          current: 1,
          size: 20,
          realName: '',
          mobile: '',
          email: '',
          roleIds: [],
          organizationId: '',
          status: ''
        },
      }
    },
    created() {
      this.getList()
    },
    filters: {
      sexNameFilter(sex) {
        const sexNameMap = {
          1: '男',
          2: '保密',
          0: '女'
        }
        return sexNameMap[sex]
      },
      statusFilter(status) {
        const statusMap = {
          '1': 'success',
          '2': 'info',
          '0': 'danger'
        }
        return statusMap[status]
      },
      statusNameFilter(status) {
        const statusNameMap = {
          '1': '启用',
          '0': '禁用'
        }
        return statusNameMap[status]
      },
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchUserList(this.listQuery).then(response => {
          console.log('response: ',response)
          this.list = response.data
          this.total = response.count
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
