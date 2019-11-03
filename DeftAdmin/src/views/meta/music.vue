<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.album_id" :placeholder="$t('table.cate')" class="filter-item" style="width: 150px">
        <el-option v-for="item in filterAlbums" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!-- <el-button style="float:right;" type="primary" @click="getList()">
        <i class="el-icon-refresh" /> 刷新
      </el-button> -->
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
      <el-table-column align="center" :label="$t('table.num')">
        <template slot-scope="scope">
          {{ scope.row.num }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.name')" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.author')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.lrc')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.has_lrc ? '有歌词':'无歌词' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.lrc')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.has_lrc ? (scope.row.lrc_edit ? '待编辑':'已完成'):'待添加' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.desc')">
        <template slot-scope="scope">
          {{ scope.row.descr }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="Image">
        <template slot-scope="scope">
          <img :src="scope.row.big_url" height="50">
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
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
          <el-button v-if="!row.is_sale" type="primary" size="mini" @click="saleUpdate(row)">
            {{ $t('table.sale') }}
          </el-button>
          <el-button v-else size="mini" type="warning" @click="saleUpdate(row)">
            {{ $t('table.unsale') }}
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
        <el-form-item :label="$t('table.num')" prop="num">
          <el-input v-model="temp.num" type="number" />
        </el-form-item>
        <el-form-item :label="$t('table.author')" prop="author">
          <el-input v-model="temp.author" />
        </el-form-item>
        <el-form-item :label="$t('table.desc')">
          <el-input
            v-model="temp.descr"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Description"
          />
        </el-form-item>
        <!-- <el-form-item label="Image" prop="big_url">
          <el-input type="hidden" value="temp.big_url" />
          <el-upload :file-list="fileList" action="/api/upload/image" accept="image/jpg,image/jpeg,image/png" multiple list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess" :limit="1">
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item> -->
        <el-form-item label="Source" prop="source_url">
          <el-input type="hidden" value="temp.source_url" />
          <el-upload class="upload-demo" :file-list="sourceList" action="/api/upload/music" accept="audio/mpeg,audio/x-wav" multiple :on-remove="handleRemove" :on-success="handleSourceSuccess" :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('table.lrc')">
          <el-input
            v-model="temp.lrc"
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            placeholder="lrc"
          />
        </el-form-item>
        <el-form-item :label="$t('table.album')" prop="album_id">
          <el-radio v-for="album in albumsData" :key="album.id" v-model="temp.album_id" :value="album.id" :label="album.id">{{ album.name }}</el-radio>
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
import { fetchList, createMusic, updateMusic, deleteById, saleUpdate } from '@/api/music'
import { fetchAlbums } from '@/api/album'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Music',
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
        album_id: 0
      },
      checkStrictly: false,
      rolesData: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      fileList: [],
      sourceList: [],
      albumsData: [],
      filterAlbums: [{
        id: 0,
        name: '全部专辑'
      }],
      dialogImageUrl: '',
      dialogVisible: false,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      genderOptions: [{ label: '不限', key: '-1' }, { label: '男', key: '1' }, { label: '女', key: '0' }],
      temp: {
        id: undefined,
        num: '',
        name: '',
        author: '',
        descr: '',
        big_url: '',
        source_url: ''
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
    this.getAlbums()
  },

  methods: {
    tableRowClassName({ row }) {
      return row.is_delete ? 'warning-row' : ''
    },
    getAlbums() {
      fetchAlbums().then(response => {
        this.albumsData = response.data.items
        this.filterAlbums.splice(1, this.filterAlbums.length - 1, ...this.albumsData)
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
        num: '',
        name: '',
        descr: '',
        big_url: ''
      }
      this.fileList.splice(0, this.fileList.length)
      this.sourceList.splice(0, this.sourceList.length)
    },
    saleUpdate(row) {
      saleUpdate(row).then(data => {
        row.is_sale = data.data.is_sale
        this.$forceUpdate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.getAlbums()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMusic(this.temp).then((response) => {
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
      this.getAlbums()
      this.temp = Object.assign({}, row) // copy obj
      if (row.big_url) {
        this.fileList.splice(0, this.fileList.length, {
          name: row.big_url.substring(row.big_url.lastIndexOf('/') + 1),
          url: row.big_url
        })
      }
      if (row.source_url) {
        this.sourceList.splice(0, this.sourceList.length, {
          name: row.source_url.substring(row.source_url.lastIndexOf('/') + 1),
          url: row.source_url
        })
      }
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
          updateMusic(tempData).then((data) => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, data.data)
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
    handleSourceSuccess(response, file, fileList) {
      this.temp.source_url = response.data.url
      this.sourceList.splice(0, this.sourceList.length, {
        name: response.data.filename,
        url: response.data.url
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlerClose() {
      this.fileList.splice(0, this.fileList.length)
      this.sourceList.splice(0, this.fileList.length)
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }
</style>
