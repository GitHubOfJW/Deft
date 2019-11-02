import request from '@/utils/request'

export function fetchCateList(query = {}) {
  return request({
    url: '/rule/cates',
    method: 'get',
    params: query
  })
}

export function fetchList(query = {}) {
  return request({
    url: '/rule/list',
    method: 'get',
    params: query
  })
}

export function createRule(data) {
  return request({
    url: '/rule/add',
    method: 'post',
    data
  })
}

export function updateRule(data) {
  return request({
    url: `/rule/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteById(id, status) {
  if (status === 'delete') {
    return request({
      url: '/rule/delete/' + id,
      method: 'delete'
    })
  } else {
    return request({
      url: '/rule/recover/' + id,
      method: 'put'
    })
  }
}
