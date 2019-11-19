import request from '@/utils/request'

export function fetchBannerList(query = {}) {
  return request({
    url: '/banner/list',
    method: 'get',
    params: query
  })
}

export function createBanner(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data
  })
}

export function detail(data) {
  return request({
    url: '/banner/detail/' + data.id,
    method: 'get',
    data
  })
}

export function updateBannner(data) {
  return request({
    url: `/banner/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteBannerById(id, status) {
  if (status === 'delete') {
    return request({
      url: '/banner/delete/' + id,
      method: 'delete'
    })
  } else {
    return request({
      url: '/banner/recover/' + id,
      method: 'put'
    })
  }
}

