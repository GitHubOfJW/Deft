<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('permission.addRole') }}
    </el-button>
    <el-button style="float:right;" type="primary" @click="getRoles()">
      <i class="el-icon-refresh" /> 刷新
    </el-button>
    <el-table :row-class-name="tableRowClassName" :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" :label="$t('table.id')" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.key')" width="220">
        <template slot-scope="scope">
          {{ scope.row.role_key }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.name')" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.desc')">
        <template slot-scope="scope">
          {{ scope.row.descr }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button v-if="!scope.is_delete" type="primary" size="small" @click="handleEdit(scope)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="!scope.row.is_delete" type="danger" size="small" @click="handleDelete(scope.row, 'delete')">
            {{ $t('table.delete') }}
          </el-button>
          <el-button v-else type="warning" size="small" @click="handleDelete(scope.row, 'recover')">
            {{ $t('table.recover') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.descr"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item>
        <el-form-item label="Rule">
          <el-tree ref="ruleTree" :data="ruleData" :props="ruleProps" show-checkbox node-key="id" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { fetchCateList } from '@/api/rule'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import i18n from '@/lang'

const defaultRole = {
  key: '',
  name: '',
  descr: '',
  routes: [],
  rules: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rules: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      ruleProps: {
        label: 'name',
        children: 'rules'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    },
    ruleData() {
      return this.rules
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
    this.getCateList()
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.is_delete) {
        return 'warning-row'
      }
      return ''
    },
    getCateList() {
      fetchCateList({
        children: true
      }).then(response => {
        if (response.code === 20000) {
          this.rules = response.data.items
        }
      })
    },
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    getRoles() {
      getRoles().then(res => {
        this.rolesList = res.data.items
      })
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      if (this.$refs.ruleTree) {
        this.$refs.ruleTree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        this.$refs.ruleTree.setCheckedNodes(this.role.rules)
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete(row, status) {
      deleteRole(row.id, status).then(response => {
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
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const ruleCheckedKeys = this.$refs.ruleTree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      this.role.rules = ruleCheckedKeys

      if (isEdit) {
        await updateRole(this.role, this.role)
        this.role.rules = ruleCheckedKeys.map(ruleId => {
          return {
            id: ruleId,
            is_delete: false
          }
        })
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].role_key === this.role.role_key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.role_key = data.role_key
        this.role.id = data.id
        this.rolesList.push(this.role)
        this.role.rules = ruleCheckedKeys.map(ruleId => {
          return {
            id: ruleId,
            is_delete: false
          }
        })
      }

      const { descr, role_key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>${this.$t('table.key')}: ${role_key}</div>
            <div>${this.$t('table.name')}: ${name}</div>
            <div>${this.$t('table.desc')}: ${descr}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss">
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
  .el-table {
    .warning-row {
      background: oldlace;
    }
    .success-row {
      background: #f0f9eb;
    }
  }
}
</style>
