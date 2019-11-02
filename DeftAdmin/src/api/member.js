import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/member/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/member/info',
    method: 'get',
    params: { token }
  })
}

export function fetchList(query = {}) {
  return request({
    url: '/member/list',
    method: 'get',
    params: query
  })
}

export function createMember(data) {
  return request({
    url: '/member/add',
    method: 'post',
    data
  })
}

export function updateMember(data) {
  return request({
    url: `/member/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteById(id, status) {
  if (status === 'delete') {
    return request({
      url: '/member/delete/' + id,
      method: 'delete'
    })
  } else {
    return request({
      url: '/member/recover/' + id,
      method: 'put'
    })
  }
}

export function logout() {
  return request({
    url: '/member/logout',
    method: 'delete'
  })
}

