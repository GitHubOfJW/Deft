import request from '@/utils/request'

export function fetchCateList(query = {}) {
  return request({
    url: '/article/cate/list',
    method: 'get',
    params: query
  })
}

export function fetchAllCate(query = {}) {
  return request({
    url: '/article/cate/cates',
    method: 'get',
    params: query
  })
}

export function createCate(data) {
  return request({
    url: '/article/cate/add',
    method: 'post',
    data
  })
}

export function updateCate(data) {
  return request({
    url: `/article/cate/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteCateById(id, status) {
  if (status === 'delete') {
    return request({
      url: '/article/cate/delete/' + id,
      method: 'delete'
    })
  } else {
    return request({
      url: '/article/cate/recover/' + id,
      method: 'put'
    })
  }
}

export function fetchArticleList(query = {}) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function createArticle(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: `/article/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteArticleById(id, status) {
  if (status === 'delete') {
    return request({
      url: '/article/delete/' + id,
      method: 'delete'
    })
  } else {
    return request({
      url: '/article/recover/' + id,
      method: 'put'
    })
  }
}

export function fetchLabelList(query = {}) {
  return request({
    url: '/article/label/list',
    method: 'get',
    params: query
  })
}

export function fetchAlllabel(query = {}) {
  return request({
    url: '/article/label/labels',
    method: 'get',
    params: query
  })
}

export function createLabel(data) {
  return request({
    url: '/article/label/add',
    method: 'post',
    data
  })
}

export function updateLabel(data) {
  return request({
    url: `/article/label/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteLabelById(id, status) {
  if (status === 'delete') {
    return request({
      url: '/article/label/delete/' + id,
      method: 'delete'
    })
  } else {
    return request({
      url: '/article/label/recover/' + id,
      method: 'put'
    })
  }
}

// 内容
export function fetchContentList(query = {}) {
  return request({
    url: '/article/content/list',
    method: 'get',
    params: query
  })
}

export function createContent(data) {
  return request({
    url: '/article/content/add',
    method: 'post',
    data
  })
}

export function updateContent(data) {
  return request({
    url: `/article/content/edit/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteContentById(id, status) {
  if (status === 'delete') {
    return request({
      url: '/article/content/delete/' + id,
      method: 'delete'
    })
  } else {
    return request({
      url: '/article/content/recover/' + id,
      method: 'put'
    })
  }
}

