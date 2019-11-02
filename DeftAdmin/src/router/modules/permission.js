/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const permissionRouter = {
  path: '/permission',
  component: Layout,
  redirect: '/permission/page',
  alwaysShow: true, // will always show the root menu
  name: 'Permission',
  meta: {
    title: 'permission',
    icon: 'lock',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'member',
      component: () => import('@/views/permission/member'),
      name: 'Members',
      meta: {
        title: 'members',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'rule',
      component: () => import('@/views/permission/rule'),
      name: 'Rules',
      meta: {
        title: 'rules',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    // {
    //   path: 'page',
    //   component: () => import('@/views/permission/page'),
    //   name: 'PagePermission',
    //   meta: {
    //     title: 'pagePermission',
    //     roles: ['admin'] // or you can only set roles in sub nav
    //   }
    // },
    // {
    //   path: 'directive',
    //   component: () => import('@/views/permission/directive'),
    //   name: 'DirectivePermission',
    //   meta: {
    //     title: 'directivePermission'
    //     // if do not set roles, means: this page does not require permission
    //   }
    // },
    {
      path: 'role',
      component: () => import('@/views/permission/role'),
      name: 'RolePermission',
      meta: {
        title: 'rolePermission',
        roles: ['admin']
      }
    }
  ]
}

export default permissionRouter
