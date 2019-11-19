/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const bannerRouter = {
  path: '/banners',
  component: Layout,
  redirect: '/banners/banner',
  alwaysShow: false, // will always show the root menu
  name: 'Banners',
  meta: {
    title: 'banner',
    icon: 'shuffling-banner'
  },
  children: [
    {
      path: '/banner',
      component: () => import('@/views/banners/index'),
      name: 'Banner',
      meta: {
        title: 'banner'
      }
    }
  ]
}

export default bannerRouter
