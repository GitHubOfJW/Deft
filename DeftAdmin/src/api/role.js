import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/role/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function fetchRoles() {
  return request({
    url: '/role/roles',
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: `/role/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id, status) {
  if (status === 'delete') {
    return request({
      url: `/role/delete/${id}`,
      method: 'delete'
    })
  } else {
    return request({
      url: `/role/recover/${id}`,
      method: 'put'
    })
  }
}

