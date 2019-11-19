<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" banner="el-banner-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button style="float:right;" type="primary" @click="getList()">
        <i class="el-banner-refresh" /> 刷新
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
      <el-table-column align="center" label="Banner">
        <template slot-scope="scope">
          <img v-if="scope.row.banner" :src="scope.row.banner.url" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.url')" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.router')" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.router }}</span>
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
        <el-form-item label="平台" prop="platform">
          <el-select v-model="temp.platform" placeholder="请选择" disabled="">
            <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Banner" prop="banner_id">
          <el-input type="hidden" value="temp.banner_id" />
          <el-upload ref="upload" :file-list="fileList" action="/api/upload/image" accept="image/jpg,image/jpeg,image/png" multiple list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess" :limit="1">
            <i class="el-banner-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('table.url')" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item :label="$t('table.router')" prop="router">
          <el-input v-model="temp.router" />
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
import { fetchBannerList, createBanner, updateBanner, deleteBannerById } from '@/api/banner'
import { platforms } from '@/api/meta'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Banner',
  components: { Pagination },
  directives: { waves },
  props: {
    platform: {
      type: Number,
      default: function() {
        return 1
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      platforms: [],
      listQuery: {
        page: 1,
        limit: 20,
        platform: this.platform
      },
      checkStrictly: false,
      rolesData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      genderOptions: [{ label: '不限', key: '-1' }, { label: '男', key: '1' }, { label: '女', key: '0' }],
      temp: {
        id: undefined,
        name: '',
        platform: this.platform,
        banner: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        // url: [{ required: true, message: 'name is required', trigger: 'change' }],
        // router: [{ required: true, message: 'name is required', trigger: 'change' }],
        banner_id: [{ required: true, message: 'banner is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    subHeaderRowStyle() {
      return {
        display: 'none'
      }
    }
  },
  created() {
    this.getList()
    this.getPlatform()
  },
  methods: {
    tableRowClassName({ row }) {
      return row.is_delete ? 'warning-row' : ''
    },
    getPlatform() {
      platforms().then(response => {
        if (response.code === 20000) {
          this.platforms.splice(0, this.platforms.length, ...response.data)
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchBannerList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 600)
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
        banner: '',
        platform: this.platform
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
          this.temp.platform = this.platform
          createBanner(this.temp).then((response) => {
            this.temp.id = response.data.id
            this.list.unshift(this.temp)
            this.$forceUpdate()
            this.dialogFormVisible = false
            this.$forceUpdate()
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
      this.temp.banner_id = row.banner.id
      this.temp.banner_url = row.banner.url
      this.temp.platform = this.platform
      this.fileList.splice(0, this.fileList.length, {
        name: row.banner.url.substring(row.banner.url.lastIndexOf('/') + 1),
        url: row.banner.url
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
          this.temp.platform = this.platform
          const tempData = Object.assign({}, this.temp)
          updateBanner(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                this.$forceUpdate()
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
      deleteBannerById(row.id, status).then(response => {
        if (response.code === 20000) {
          this.$notify({
            title: '成功',
            message: response.message,
            type: 'success',
            duration: 2000
          })
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
    },
    handleSuccess(response, file, fileList) {
      this.temp.banner_id = response.data.source_id
      this.temp.banner_url = response.data.url
      this.temp.banner = {
        id: this.temp.banner_id,
        url: this.temp.banner_url
      }
      this.fileList.splice(0, this.fileList.length, {
        name: response.data.filename,
        url: response.data.url
      })
    },
    handleRemove(file, fileList) {
      this.temp.banner = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlerClose() {
      this.fileList.splice(0, this.fileList.length)
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }
</style>
