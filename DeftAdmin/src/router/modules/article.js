/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const musicRouter = {
  path: '/article',
  component: Layout,
  redirect: '/article/labels',
  alwaysShow: true, // will always show the root menu
  name: 'DietCate',
  meta: {
    title: 'article',
    icon: 'list'
  },
  children: [
    {
      path: '/labels',
      component: () => import('@/views/article/articleLabel'),
      name: 'DietLabel',
      meta: {
        title: 'articleLabel'
      }
    },
    {
      path: 'cate',
      component: () => import('@/views/article/articleCate'),
      name: 'DietCate',
      meta: {
        title: 'articleCate'
      }
    },
    {
      path: 'article',
      component: () => import('@/views/article/article'),
      name: 'Diet',
      meta: {
        title: 'article'
      }
    }
  ]
}

export default musicRouter
