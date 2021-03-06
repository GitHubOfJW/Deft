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
      <!-- 展开模版开始 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :key="tableKey+'1'"
            :data="scope.row.subCates"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :header-row-style="subHeaderRowStyle"
          >
            <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80">
              <template slot-scope="innerScope">
                <span>{{ innerScope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.name')" width="300px" align="center">
              <template slot-scope="innerScope">
                <span>{{ innerScope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.pinyin')" width="300px" align="center">
              <template slot-scope="innerScope">
                <span>{{ innerScope.row.pinyin }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.appIcon')" width="150px" align="center">
              <template slot-scope="innerScope">
                <span>{{ innerScope.row.app_icon }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Icon">
              <template slot-scope="innerScope">
                <img v-if="innerScope.row.icon" :src="innerScope.row.icon.url" height="50">
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.article_count')">
              <template slot-scope="innerScope">
                {{ innerScope.row.count || 0 }}
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
        </template>
      </el-table-column>
      <!-- 展开模版结束 -->
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
      <el-table-column :label="$t('table.pinyin')" width="300px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pinyin }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.appIcon')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.app_icon }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Icon">
        <template slot-scope="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon.url" height="50">
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.article_count')">
        <template slot-scope="scope">
          {{ scope.row.count || 0 }}
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
        <el-form-item :label="$t('table.pinyin')" prop="pinyin">
          <el-input v-model="temp.pinyin" />
        </el-form-item>
        <el-form-item label="所属分类" prop="parent_id">
          <el-select v-model="temp.parent_id" placeholder="请选择">
            <el-option v-for="item in parentCates" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.appIcon')" prop="app_icon">
          <el-input v-model="temp.app_icon" />
        </el-form-item>
        <el-form-item label="Icon" prop="icon_id">
          <el-input type="hidden" value="temp.icon_id" />
          <el-upload ref="upload" :file-list="fileList" action="/api/upload/image" accept="image/jpg,image/jpeg,image/png" multiple list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess" :limit="1">
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
import { fetchCateList, createCate, updateCate, deleteCateById, fetchAllParentCate } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ArticleCate',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      parentCates: [{
        id: 0,
        name: '根分类'
      }],
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
      dialogImageUrl: '',
      dialogVisible: false,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      genderOptions: [{ label: '不限', key: '-1' }, { label: '男', key: '1' }, { label: '女', key: '0' }],
      temp: {
        id: undefined,
        name: '',
        icon: '',
        pinyin: '',
        parent_id: undefined,
        pre_parentId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        pinyin: [{ required: true, message: 'name is required', trigger: 'change' }],
        icon_id: [{ required: true, message: 'icon is required', trigger: 'change' }]
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
  },
  methods: {
    tableRowClassName({ row }) {
      return row.is_delete ? 'warning-row' : ''
    },
    getParentList() {
      // if (this.temp.parent_id === 0) {
      //   this.parentCates.splice(1, this.parentCates.length)
      //   return
      // }
      fetchAllParentCate().then(response => {
        if (response.code === 20000) {
          if (typeof this.temp.parent_id !== 'undefined' && this.temp.parent_id === 0) {
            this.parentCates.splice(1, this.parentCates.length)
            for (const item of response.data.items) {
              if (item.id !== this.temp.id) {
                this.parentCates.push(item)
              }
            }
          } else {
            this.parentCates.splice(1, this.parentCates.length, ...response.data.items)
          }
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchCateList(this.listQuery).then(response => {
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
        name: '',
        icon: '',
        pinyin: '',
        parent_id: undefined,
        pre_parentId: undefined
      }
      this.fileList.splice(0, this.fileList.length)
    },
    handleCreate() {
      this.resetTemp()
      this.getParentList()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCate(this.temp).then((response) => {
            this.temp.id = response.data.id
            this.temp.icon = {
              id: this.temp.icon_id,
              url: this.temp.icon_url
            }
            if (this.temp.parent_id === 0) {
              this.list.unshift(this.temp)
            } else {
              for (const parentItem of this.list) {
                if (parentItem.id === this.temp.parent_id) {
                  parentItem.subCates.unshift(this.temp)
                }
              }
            }
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
      this.temp.pre_parentId = this.temp.parent_id
      this.getParentList()
      this.temp.icon_id = row.icon.id
      this.temp.icon_url = row.icon.url
      this.fileList.splice(0, this.fileList.length, {
        name: row.icon.url.substring(row.icon.url.lastIndexOf('/') + 1),
        url: row.icon.url
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
          updateCate(tempData).then(() => {
            // 如果上次的ID和这次的一样，找到更换，如果不一样，去掉上次的，新增本次的
            if (this.temp.pre_parentId === this.temp.parent_id) {
              // 如果parent_id 是 0 直接遍历更新
              for (const v of this.list) {
                if (this.temp.parent_id === 0 && v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                } else if (this.temp.parent_id !== 0 && v.id === this.temp.parent_id) {
                  for (const subV of v.subCates) {
                    if (subV.id === this.temp.id) {
                      const index = v.subCates.indexOf(subV)
                      v.subCates.splice(index, 1, this.temp)
                      break
                    }
                  }
                }
              }
            } else {
              // 先找到原来的未知，删掉
              for (const v of this.list) {
                if (this.temp.pre_parentId === 0 && v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1)
                  break
                } else if (this.temp.pre_parentId !== 0 && v.id === this.temp.pre_parentId) {
                  for (const subV of v.subCates) {
                    if (subV.id === this.temp.id) {
                      const index = v.subCates.indexOf(subV)
                      v.subCates.splice(index, 1)
                      break
                    }
                  }
                }
              }
              // 新增
              for (const v of this.list) {
                if (this.temp.parent_id === 0) {
                  this.list.unshift(this.temp)
                  break
                } else if (this.temp.parent_id !== 0 && v.id === this.temp.parent_id) {
                  v.subCates.unshift(this.temp)
                }
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
      deleteCateById(row.id, status).then(response => {
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
      this.temp.icon_id = response.data.source_id
      this.temp.icon_url = response.data.url
      this.temp.icon = {
        id: this.temp.icon_id,
        url: this.temp.icon_url
      }
      this.fileList.splice(0, this.fileList.length, {
        name: response.data.filename,
        url: response.data.url
      })
    },
    handleRemove(file, fileList) {
      this.temp.icon = ''
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
