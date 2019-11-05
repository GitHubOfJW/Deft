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
      <el-table-column label="标题" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.picture')" width="200px">
        <template slot-scope="scope">
          <img v-if="scope.row.pic" :src="scope.row.pic.url" height="50">
        </template>
      </el-table-column>
      <el-table-column label="适合年龄" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.min_age }}岁 - {{ scope.row.max_age }}岁</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.cate')" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.articlecates" :key="item.id">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文章标签" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.articlelabels" :key="item.id">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="适合性别" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ ['通用', '男孩', '女孩'][scope.row.gender] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="极力推荐" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_recommend ? '是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_finished ? '已审核':'待审核' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="允许添加作品" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_works ? '是': '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章页数" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content_page || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作品数量" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.works_count || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收藏量" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collect_count || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读量" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.view_count || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点赞量" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.support_count || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.row.member || {}).name || '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="250">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleContents(row)">
            内容
          </el-button>
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('table.min_age')" label-width="80" prop="min_age">
          <el-input-number v-model="temp.min_age" name="min_age" size="mini" />
        </el-form-item>
        <el-form-item :label="$t('table.max_age')" label-width="80" prop="max_age">
          <el-input-number v-model="temp.max_age" name="max_age" size="mini" />
        </el-form-item>
        <el-form-item label="重要性" prop="importance">
          <el-rate v-model="temp.importance" :max="4" :low-threshold="1" :high-threshold="3" show-text name="importance" :texts="['不重要','一般','重要','非常重要']" />
        </el-form-item>
        <el-form-item label="极力推荐" label-width="80" prop="is_recommend">
          <el-radio v-model="temp.is_recommend" name="is_recommend" label="1">是</el-radio>
          <el-radio v-model="temp.is_recommend" name="is_recommend" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="性别" label-width="80" prop="gender">
          <el-radio v-model="temp.gender" name="gender" label="0">通用</el-radio>
          <el-radio v-model="temp.gender" name="gender" label="1">男孩</el-radio>
          <el-radio v-model="temp.gender" name="gender" label="2">女孩</el-radio>
        </el-form-item>
        <el-form-item label="作品权限" label-width="80" prop="is_works">
          <el-radio v-model="temp.is_works" name="is_works" label="1">是</el-radio>
          <el-radio v-model="temp.is_works" name="is_works" label="0">否</el-radio>
        </el-form-item>
        <el-form-item :label="$t('table.cate')" prop="cate_ids">
          <!-- <el-select v-model="temp.cate_ids" multiple filterable placeholder="请选择所属的分类" @change="cateChange">
            <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select> -->
          <el-cascader v-model="temp.cate_ids" :props="{ label:'name', value: 'id', children: 'subCates', multiple: true }" :options="cateList" />
        </el-form-item>
        <el-form-item label="文章标签" prop="label_ids">
          <el-select v-model="temp.label_ids" multiple filterable placeholder="请选择">
            <el-option v-for="item in labelList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.picture')" prop="pic_url">
          <el-input type="hidden" value="temp.pic_url" />
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
    <!-- 多层嵌套 -->
    <!-- <el-drawer :title="editTitle" direction="rtl" :visible.sync="drawer" :before-close="handleClose" size="80%">
      <div>
      </div>
    </el-drawer> -->
    <el-dialog :title="editTitle" :visible.sync="drawer" @close="handleClose">
      <!-- 这里放编辑器组件 -->
      <article-detail v-if="drawer" :edit="true" :articleid="temp.id" @close="handleClose" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchArticleList, fetchAllCate, fetchAlllabel, createArticle, updateArticle, deleteArticleById } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import ArticleDetail from '@/components/ArticleDetail'

export default {
  name: 'Article',
  components: { Pagination, ArticleDetail },
  directives: { waves },
  data() {
    return {
      drawer: false,
      editTitle: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      cateList: [],
      labelList: [],
      allSubCates: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      temp: {
        id: undefined,
        title: '',
        is_recommend: '0',
        min_age: 0,
        gender: '0',
        max_age: 300,
        importance: 1,
        is_works: '1',
        type: '0'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'change' }],
        min_age: [{ required: true, message: 'min_age is required', trigger: 'change' }],
        max_age: [{ required: true, message: 'max_age is required', trigger: 'change' }],
        importance: [{ required: true, message: 'importance is required', trigger: 'change' }],
        is_recommend: [{ required: true, message: 'recommend is required', trigger: 'change' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        is_works: [{ required: true, message: 'works is required', trigger: 'change' }],
        cate_ids: [{ required: true, message: 'category is required', trigger: 'change' }],
        pic_id: [{ required: true, message: 'picture is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleContents(row) {
      this.temp = row
      this.drawer = true
      this.editTitle = row.title
    },
    handleClose() {
      this.drawer = false
    },
    tableRowClassName({ row }) {
      return row.is_delete ? 'warning-row' : ''
    },
    getCates() {
      fetchAllCate().then(response => {
        this.cateList.splice(0, this.cateList.length)
        this.cateList.push(...response.data.items)
        this.allSubCates.splice(0, this.allSubCates.length)
        this.cateList.forEach(item => {
          item.subCates.forEach(subItem => {
            this.allSubCates.push(subItem)
          })
        })
        this.$forceUpdate()
      })
    },
    getLabels() {
      fetchAlllabel().then(response => {
        this.labelList.splice(0, this.labelList.length)
        this.labelList.push(...response.data.items)
        this.$forceUpdate()
      })
    },
    getList() {
      this.listLoading = true
      fetchArticleList(this.listQuery).then(response => {
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
        title: '',
        is_recommend: '0',
        is_finished: '0',
        max_age: 300,
        min_age: 0,
        is_works: '1',
        pic_url: '',
        type: [],
        gender: '0',
        cate_ids: [],
        label_ids: []
      }
      this.getCates()
      this.getLabels()
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
          createArticle(this.temp).then((response) => {
            this.temp.id = response.data.id
            this.temp.is_recommend = this.temp.is_recommend === '1'
            this.temp.is_works = this.temp.is_works === '1'
            this.temp.articlecates = this.allSubCates.filter(cate => this.temp.cate_ids.map(items => items[1]).includes(cate.id))
            this.temp.articlelabels = this.labelList.filter(label => this.temp.label_ids.includes(label.id))
            this.list.unshift(this.temp)
            this.$forceUpdate()
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
      this.temp = Object.assign({}, {
        ...row,
        cate_ids: [...(row.articlecates || []).map(item => [item.parent_id, item.id])],
        label_ids: (row.articlelabels || []).map(item => item.id),
        is_recommend: row.is_recommend ? '1' : '0',
        is_works: row.is_finished ? '1' : '0',
        gender: row.gender + '',
        pic_id: row.pic.id,
        pic_url: row.pic.url
      }) // copy obj
      this.fileList.splice(0, this.fileList.length, {
        name: row.pic.url.substring(row.pic.url.lastIndexOf('/') + 1),
        url: row.pic.url
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getCates()
      this.getLabels()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.temp.is_recommend = this.temp.is_recommend === '1'
                this.temp.is_works = this.temp.is_works === '1'
                this.temp.articlecates = this.allSubCates.filter(cate => this.temp.cate_ids.map(items => items[1]).includes(cate.id))
                this.temp.articlelabels = this.labelList.filter(label => this.temp.label_ids.includes(label.id))
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
      deleteArticleById(row.id, status).then(response => {
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
      this.temp.pic_url = response.data.url
      this.temp.pic_id = response.data.source_id
      this.temp.pic = {
        id: this.temp.pic_id,
        url: this.temp.pic_url
      }
      this.fileList.splice(0, this.fileList.length, {
        name: response.data.filename,
        url: response.data.url,
        source_id: response.data.source_id
      })
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
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
