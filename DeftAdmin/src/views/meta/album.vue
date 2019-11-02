<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button style="float:right;" type="primary" @click="getList()">
        <i class="el-icon-refresh" /> 刷新
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
      <el-table-column :label="$t('table.name')" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.desc')">
        <template slot-scope="scope">
          {{ scope.row.descr }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.music_count')">
        <template slot-scope="scope">
          {{ scope.row.music_count }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Banner">
        <template slot-scope="scope">
          <img :src="scope.row.big_url" height="50">
        </template>
      </el-table-column>
      <el-table-column align="center" label="Thumb">
        <template slot-scope="scope">
          <img :src="scope.row.thumb_url" height="50">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handlerClose">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('table.desc')">
          <el-input
            v-model="temp.descr"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Ablum Description"
          />
        </el-form-item>
        <el-form-item label="Banner" prop="big_url">
          <el-input type="hidden" value="temp.big_url" />
          <el-upload ref="upload" :file-list="fileList" action="/api/upload/image" accept="image/jpg,image/jpeg,image/png" multiple list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess" :limit="1">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="Thumb" prop="thumb_url">
          <el-input type="hidden" value="temp.thumb_url" />
          <el-upload ref="upload" :file-list="thumbList" action="/api/upload/image" accept="image/jpg,image/jpeg,image/png" multiple list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleThumbRemove" :on-success="handleThumbSuccess" :limit="1">
            <i class="el-icon-plus" />
          </el-upload>
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
    <el-dialog :visible.sync="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createAlbum, updateAlbum, deleteById } from '@/api/album'
import { fetchRoles } from '@/api/role'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Album',
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
        limit: 20
      },
      checkStrictly: false,
      rolesData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      fileList: [],
      thumbList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      genderOptions: [{ label: '不限', key: '-1' }, { label: '男', key: '1' }, { label: '女', key: '0' }],
      temp: {
        id: undefined,
        name: '',
        descr: '',
        big_url: ''
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
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        descr: '',
        big_url: ''
      }
      this.fileList.splice(0, this.fileList.length)
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
          createAlbum(this.temp).then((response) => {
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
      this.fileList.splice(0, this.fileList.length, {
        name: row.big_url.substring(row.big_url.lastIndexOf('/') + 1),
        url: row.big_url
      })
      this.thumbList.splice(0, this.thumbList.length, {
        name: row.thumb_url.substring(row.thumb_url.lastIndexOf('/') + 1),
        url: row.thumb_url
      })
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
          updateAlbum(tempData).then(() => {
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
    handleSuccess(response, file, fileList) {
      this.temp.big_url = response.data.url
      this.fileList.splice(0, this.fileList.length, {
        name: response.data.filename,
        url: response.data.url
      })
    },
    handleThumbSuccess(response, file, fileList) {
      this.temp.thumb_url = response.data.url
      this.thumbList.splice(0, this.thumbList.length, {
        name: response.data.filename,
        url: response.data.url
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleThumbRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlerClose() {
      this.fileList.splice(0, this.fileList.length)
      this.thumbList.splice(0, this.thumbList.length)
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }
</style>
