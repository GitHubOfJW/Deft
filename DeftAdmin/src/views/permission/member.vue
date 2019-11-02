<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.mobile" clearable :placeholder="$t('table.mobile')" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" clearable :placeholder="$t('table.name')" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.wechat" clearable :placeholder="$t('table.wechat')" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.qq" clearable :placeholder="$t('table.qq')" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.gender" :placeholder="$t('table.gender')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in genderOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :row-class-name="tableRowClassName"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mobile')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.name')" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.gender')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender ? '男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.birth')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.birth || '') | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.wechat')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.wechat || '未填写') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.qq')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.qq || '未填写') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.token')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="!row.is_delete" size="mini" type="danger" @click="handleDelete(row, 'delete')">
            {{ $t('table.delete') }}
          </el-button>
          <el-button v-else size="mini" type="warning" @click="handleDelete(row, 'recover')">
            {{ $t('table.recover') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.mobile')" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('table.gender')" prop="gender">
          <el-select v-model="temp.gender" class="filter-item" placeholder="Please select">
            <el-option v-for="item in genderOptions.filter(item => item.key != '-1')" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.birth')" prop="birth">
          <el-date-picker v-model="temp.birth" type="date" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item :label="$t('table.wechat')" prop="wechat">
          <el-input v-model="temp.wechat" />
        </el-form-item>
        <el-form-item :label="$t('table.qq')" prop="qq">
          <el-input v-model="temp.qq" />
        </el-form-item>
        <el-form-item v-if="!temp.is_admin" :label="$t('table.role')" prop="role_id">
          <el-radio v-for="role in rolesData" :key="role.id" v-model="temp.role_id" :value="role.id" :label="role.id">{{ role.name }}</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createMember, updateMember, deleteById } from '@/api/member'
import { fetchRoles } from '@/api/role'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Member',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        mobile: undefined,
        name: undefined,
        wechat: undefined,
        qq: undefined,
        sort: '+id',
        gender: '-1'
      },
      checkStrictly: false,
      rolesData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      genderOptions: [{ label: '不限', key: '-1' }, { label: '男', key: '1' }, { label: '女', key: '0' }],
      temp: {
        id: undefined,
        mobile: '',
        name: '',
        gender: '-1',
        birth: new Date(),
        wechat: '',
        qq: '',
        is_admin: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        mobile: [{ required: true, message: 'mobile is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        role_id: [{ required: true, message: 'role is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    tableRowClassName({ row }) {
      return row.is_delete ? 'warning-row' : ''
    },
    getRoles() {
      fetchRoles().then(response => {
        this.rolesData = response.data.items
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.is_delete = true
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        mobile: '',
        name: '',
        gender: '1',
        birth: new Date(),
        wechat: '',
        qq: '',
        role_id: null
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createMember(this.temp).then((response) => {
            this.temp.id = response.data.id
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.birth = new Date(this.temp.birth || Date.now())
      this.temp.gender = this.temp.gender ? '1' : '0'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateMember(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, status) {
      deleteById(row.id, status).then(response => {
        if (response.code === 20000) {
          this.$notify({
            title: '成功',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          // const index = this.list.indexOf(row)
          // this.list.splice(index, 1)
          row.is_delete = status === 'delete'
        } else {
          this.$notify({
            title: '失败',
            message: response.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }
</style>
