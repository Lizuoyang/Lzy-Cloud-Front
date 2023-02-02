<template>
  <div class="app-container content">
    <div class="filter-container-card">
      <!-- 资源列表查询条件 -->
      <div class="text item">
        <el-form label-width="80px">
          <el-row>
            <el-col :span="4" class="line">
              <el-form-item label="资源名称:" prop="id">
                <el-input v-model="treeQuery.resourceName" clearable placeholder="请输入资源名称" style="width: 150px;"
                          class="filter-item"
                          maxlength="32" @keyup.enter.native="searchTreeData"/>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="line">
              <el-form-item label="资源标识:" prop="roleName">
                <el-input v-model="treeQuery.resourceKey" clearable placeholder="请输入资源标识" style="width: 150px;"
                          class="filter-item"
                          maxlength="32" @keyup.enter.native="searchTreeData"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item style="float:right;">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchTreeData">查询
                </el-button>
                <el-button class="filter-item" icon="el-icon-refresh" @click="resetListQuery">重置</el-button>
                <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-edit" @click="handleCreate">新增
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table ref="resourceTree" :data="list" row-key="id" border>
        <el-table-column label="资源名称" align="center">
          <template slot-scope="scope">
            <span :id="scope.row.id">{{ scope.row.resourceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源标识" align="center">
          <template slot-scope="scope">
            <span :id="scope.row.resourceKey">{{ scope.row.resourceKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceType | typeNameFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源链接" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源图标" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.resourceIcon"/>
          </template>
        </el-table-column>
        <el-table-column label="资源排序" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.resourceLevel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源状态" align="center" class-name="status-col" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.resourceStatus | statusFilter">{{ scope.row.resourceStatus | statusNameFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleCreate(scope.row)">新增</el-button>
            <el-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.roleStatus!='1'" size="mini" type="text" @click="handleModifyStatus(scope.row,'1')">启用</el-button>
            <el-button v-if="scope.row.roleStatus!='0' && scope.row.status!='2'" type="text" size="mini" @click="handleModifyStatus(scope.row,'0')">禁用</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
  import { fetchResourceTree } from '@/api/system/resource'

  export default {
    name: 'ResourceTable',
    components: {},
    filters: {
      typeNameFilter(type) {
        const typeNameMap = {
          1: '模块',
          2: '菜单',
          4: '接口',
          3: '按钮'
        }
        return typeNameMap[type]
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
      }
    },
    data() {
      let validResourceKey = (rule, value, callback) => {
        let keyData = {
          id: this.resourceForm.id,
          checkField: 'resource_key',
          checkValue: value
        }
        checkResourceExist(keyData).then(response => {
          if (!response.data) {
            callback(new Error('资源标识已存在'))
          } else {
            callback()
          }
        })
      }
      return {
        expandAll: false,
        list: [],
        baseList: [],
        rootFlag: false,
        expandTitle: 'resourceTable.resourceName',
        expandName: 'resourceName',
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '添加'
        },
        dialogPvVisible: false,
        treeQuery: {
          parentId: 0,
          resourceKey: '',
          resourceName: ''
        },
        resourceForm: {
          id: '',
          parentId: 0,
          resourceName: '',
          resourceKey: '',
          resourceType: '1',
          resourceIcon: '',
          resourcePath: '',
          resourceUrl: '',
          resourceLevel: '',
          resourceCache: true,
          resourceShow: true,
          resourcePageName: '',
          resourceStatus: '1',
          children: [], // 必须加，否则新增的节点不显示
          comments: ''
        },
        rules: {
          resourceName: [
            { required: true, message: '请输入资源名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ],
          resourceKey: [
            { required: true, message: '请输入资源标识', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
            { validator: validResourceKey, trigger: 'blur' }
          ],
          resourceType: [
            { required: true, message: '请选择资源类型', trigger: 'blur' }
          ],
          resourceIcon: [
            { required: true, message: '请输入资源图标', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ],
          resourcePath: [
            { required: true, message: '请输入资源path', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          resourceUrl: [
            { required: true, message: '请输入资源接口', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          resourceLevel: [
            { required: true, message: '请输入资源排序', trigger: 'blur' }
          ],
          comments: [
            { required: true, message: '请填写备注信息', trigger: 'blur' }
          ]
        },
        args: [null, null, null]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchResourceTree(this.treeQuery).then(response => {
          this.list = response.data
          this.baseList = JSON.parse(JSON.stringify(response.data)) // 数组深复制
          this.listLoading = false
        })
      },
      searchTreeData() {
        this.list = JSON.parse(JSON.stringify(this.baseList))
        if (
          !(
            this.treeQuery.resourceName === '' &&
            this.treeQuery.resourceKey === ''
          )
        ) {
          this.queryData(this.list)
        }
        this.expandAll = true
      },
      queryData(dataList) {
        let haveFlag = false
        let len = dataList.length - 1
        if (len < 0) {
          return haveFlag
        }
        let haveFlagArray = new Array(dataList.length)
        for (let i = len; i >= 0; i--) {
          let isname = this.treeQuery.resourceName !== ''
          let hasname =
            dataList[i].resourceName.indexOf(this.treeQuery.resourceName) >= 0
          let iskey = this.treeQuery.resourceKey !== ''
          let haskey =
            dataList[i].resourceKey.indexOf(this.treeQuery.resourceKey) >= 0

          if (isname && !iskey) {
            if (hasname) {
              haveFlagArray[i] = true
            } else if (
              !(dataList[i].children && dataList[i].children.length > 0)
            ) {
              let index1 = dataList.indexOf(dataList[i])
              dataList.splice(index1, 1)
              continue
            } else {
              haveFlagArray[i] = false
            }
          } else if (!isname && iskey) {
            if (haskey) {
              haveFlagArray[i] = true
            } else if (
              !(dataList[i].children && dataList[i].children.length > 0)
            ) {
              let index2 = dataList.indexOf(dataList[i])
              dataList.splice(index2, 1)
              continue
            } else {
              haveFlagArray[i] = false
            }
          } else if (isname && iskey) {
            if (hasname && haskey) {
              haveFlagArray[i] = true
            } else if (
              !(dataList[i].children && dataList[i].children.length > 0)
            ) {
              let index3 = dataList.indexOf(dataList[i])
              dataList.splice(index3, 1)
              continue
            } else {
              haveFlagArray[i] = false
            }
          }

          if (
            dataList[i] &&
            dataList[i].children &&
            dataList[i].children.length > 0
          ) {
            let childHaveFlag = this.queryData(dataList[i].children)
            if (!childHaveFlag && !haveFlagArray[i]) {
              let index4 = dataList.indexOf(dataList[i])
              dataList.splice(index4, 1)
            }
            if (childHaveFlag) {
              haveFlagArray[i] = true
            }
          }
        }

        if (haveFlagArray.indexOf(true) >= 0) {
          haveFlag = true
        }
        return haveFlag
      },
      resetListQuery() {
        this.treeQuery = {}
      },
      handleCreate(row) {

      },
      handleUpdate(row) {

      },
      handleModifyStatus(row, status) {

      },
      handleDelete(row) {

      }
    }
  }
</script>

<style scoped>

</style>
