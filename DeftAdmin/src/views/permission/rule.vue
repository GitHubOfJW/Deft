<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('table.name')" clearable style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.path" :placeholder="$t('table.path')" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.parent_id" :placeholder="$t('table.cate')" class="filter-item" style="width: 150px">
        <el-option v-for="item in parentOptions" :key="item.id" :label="item.label || item.name" :value="item.id" />
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
      :data="list"
      :row-class-name="tableRowClassName"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.name')" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.path')" width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.path || '') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.cate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parent_id == 0 ? '根分类' : scope.row.father.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.desc')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.descr }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="!row.is_delete" size="mini" type="danger" @click="handleDelete(row,'delete')">
            {{ $t('table.delete') }}
          </el-button>
          <el-button v-else size="mini" type="warning" @click="handleDelete(row,'recover')">
            {{ $t('table.recover') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" placeholder="Please input" />
        </el-form-item>
        <el-form-item v-if="temp.parent_id!=0" :label="$t('table.path')" prop="path">
          <el-input v-model="temp.path" placeholder="Please input" />
        </el-form-item>
        <el-form-item v-if="dialogStatus ==='create' || (temp.sort !== temp.id)" :label="$t('table.cate')" prop="parent_id">
          <el-select v-model="temp.parent_id" class="filter-item" placeholder="Please select" @change="handlerCate()">
            <el-option v-for="item in parentOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.desc')" prop="descr">
          <el-input v-model="temp.descr" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
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
import { fetchList, fetchCateList, createRule, updateRule, deleteById } from '@/api/rule'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Rule',
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
        name: undefined,
        path: undefined,
        descr: undefined,
        parent_id: 0,
        sort: '+sort'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+sort' }, { label: 'ID Descending', key: '-sort' }],
      parentOptions: [{ id: 0, name: '根分类', parent_id: 0, label: '全部分类' }],
      temp: {
        id: undefined,
        name: '',
        path: '',
        descr: undefined,
        parent_id: 0
      },
      dialogFormVisible: false,
      dialogStatus: 'create',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        path: [{ required: true, message: 'path is required', trigger: 'change' }],
        parent_id: [{ required: true, message: 'cate is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getCateList()
  },
  methods: {
    getCateList() {
      fetchCateList().then(response => {
        const options = response.data.items || []
        this.parentOptions.splice(1, this.parentOptions.length - 1)
        // eslint-disable-next-line
        for(let cate of options) {
          this.parentOptions.push({ id: cate.id, name: cate.name, parent_id: cate.parent_id })
        }
      })
    },
    getList(loading = true) {
      this.listLoading = loading
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        if (this.list.length <= 0) {
          this.getCateList()
        }
        if (loading) {
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
        }
      })
    },
    handlerCate() {
      // 处理分类
      if (this.temp.parent_id === 0) {
        this.rules.path.splice(0, 1)
      } else {
        this.rules.path.splice(0, 1, { required: true, message: 'path is required', trigger: 'change' })
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+sort'
      } else {
        this.listQuery.sort = '-sort'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        path: '',
        descr: undefined,
        parent_id: 0
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
          createRule(this.temp).then((response) => {
            this.temp.id = response.data.id
            if (this.temp.parent_id === 0) {
              this.getCateList()
            } else {
              this.temp.father = this.parentOptions.find(item => item.id === this.temp.parent_id)
            }
            this.getList(false)
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
          updateRule(tempData).then(() => {
            // for (const v of this.list) {
            //   if (v.id === this.temp.id) {
            //     const index = this.list.indexOf(v)
            //     if (this.temp.parent_id === 0) {
            //       this.temp.path = ''
            //     }
            //     this.list.splice(index, 1, this.temp)
            //     break
            //   }
            // }
            this.getCateList()
            this.getList()
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
          row.is_delete = status === 'delete'
          // const index = this.list.indexOf(row)
          // this.list.splice(index, 1)
        } else {
          this.$notify({
            title: '失败',
            message: response.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    tableRowClassName({ row }, rowIndex) {
      if (row.parent_id === 0) {
        return 'success-row'
      }
      if (row.is_delete) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
