<template>
  <div class="app-container content">
    <div class="filter-container-card">
      <!-- 角色列表查询条件 -->
      <div class="text item">
        <el-form label-width="80px" >
          <el-row>
            <el-col :span="4" class="line">
              <el-form-item label="ID:" prop="id">
                <el-input v-model="listQuery.id" placeholder="请输入角色ID" style="width: 150px;" class="filter-item" maxlength="32" @keyup.enter.native="handleFilter" />
              </el-form-item>
            </el-col>
            <el-col :span="4" class="line">
              <el-form-item label="角色名称:" prop="roleName">
                <el-input v-model="listQuery.roleName" placeholder="请输入角色名称" style="width: 150px;" class="filter-item" maxlength="32" @keyup.enter.native="handleFilter" />
              </el-form-item>
            </el-col>
            <el-col :span="4" class="line">
              <el-form-item label="角色标识:" prop="roleKey">
                <el-input v-model="listQuery.roleKey" placeholder="请输入角色标识" style="width: 150px;" class="filter-item" maxlength="32" @keyup.enter.native="handleFilter" />
              </el-form-item>
            </el-col>
            <el-col :span="4" class="line">
              <el-form-item label="角色状态:" prop="roleStatus">
                <el-select v-model="listQuery.roleStatus" placeholder="请选择角色状态" clearable style="width: 150px" class="filter-item">
                  <el-option v-for="item in statusOption" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item style="float:right;">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" >查询</el-button>
                <el-button class="filter-item" style="margin-left: 10px;"  icon="el-icon-edit" @click="handleCreate" >新增</el-button>
                <el-button class="filter-item"  icon="el-icon-refresh" @click="resetListQuery" >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 角色列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色标识" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色级别" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册日期" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.roleStatus | statusFilter">{{ scope.row.roleStatus | statusNameFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="handleUpdateResource(scope.row)">权限</el-button>
          <el-button v-if="scope.row.roleStatus!='1'" size="mini" type="text" @click="handleModifyStatus(scope.row,'1')">启用</el-button>
          <el-button v-if="scope.row.roleStatus!='0' && scope.row.status!='2'" type="text" size="mini" @click="handleModifyStatus(scope.row,'0')">禁用</el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <!-- 用户新增/修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px" class="roleForm" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="输入角色名称" maxlength="32" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input v-model="roleForm.roleKey" placeholder="输入角色标识" maxlength="32" />
        </el-form-item>
        <el-form-item label="角色级别" prop="roleLevel">
          <el-input v-model="roleForm.roleLevel" placeholder="输入角色级别" maxlength="5" />
        </el-form-item>
        <el-form-item label="角色状态" prop="roleStatus">
          <el-radio-group v-model="roleForm.roleStatus">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="roleForm.comments" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchRoleList,createRole,updateRole,deleteRole,updateRoleStatus} from '@/api/system/role'
  import Pagination from '@/components/Pagination'
  export default {
    name: "RoleTable",
    components: { Pagination },
    filters: {
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
      }
    },
    data () {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 20,
          id: '',
          roleName: '',
          roleKey: '',
          roleStatus: ''
        },
        textMap: {
          update: '编辑',
          create: '添加'
        },
        statusOption: [{ label: '启用', key: '1' }, { label: '禁用', key: '0' }],
        dialogFormVisible: false,
        dialogResourceVisible: false,
        dialogStatus: '',
        roleForm: {
          id: '',
          roleName: '',
          roleKey: '',
          roleLevel: '',
          roleStatus: '1',
          comments: ''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' },
          ],
          roleKey: [
            { required: true, message: '请输入角色标识', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' },
          ],
          roleStatus: [
            { required: true, message: '请选择用户状态', trigger: 'change' }
          ],
          comments: [
            { required: true, message: '请填写备注信息', trigger: 'blur' }
          ]
        },
        downloadLoading: false,
      }
    },
    created() {
      // 获取角色列表
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchRoleList(this.listQuery).then(response => {
          console.log(response)
          this.list = response.data
          this.total = response.count
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.getList()
      },
      resetListQuery() {
        this.listQuery = {}
      },
      handleCreate() {
        this.resetroleForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.roleForm = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
        })
      },
      resetroleForm() {
        this.roleForm = {
          id: '',
          roleName: '',
          roleKey: '',
          roleLevel: '',
          roleStatus: '1',
          comments: ''
        }
      },
      createData() {
        this.$refs['roleForm'].validate(valid => {
          if (valid) {
            createRole(this.roleForm).then(() => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$message({
                message: '创建成功',
                type: 'success'
              })
            })
          }
        })
      },
      updateData() {
        this.$refs['roleForm'].validate(valid => {
          if (valid) {
            updateRole(this.roleForm).then(() => {
              for (const v of this.list) {
                if (v.id === this.roleForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.roleForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            })
          }
        })
      },
      handleDelete(row) {
        this.$confirm(
          '此操作将永久删除该角色：' + row.roleName + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.listLoading = true
            deleteRole(row.id).then(() => {
              this.listLoading = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      handleModifyStatus(row, status) {
        this.listLoading = true
        updateRoleStatus(row.id, status).then(() => {
          this.listLoading = false
          row.roleStatus = status
          this.$message({
            message: '状态修改成功',
            type: 'success'
          })
        })
      },
      handleUpdateResource(row) {

      }
    }
  }
</script>

<style scoped>

</style>
