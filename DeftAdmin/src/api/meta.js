import request from '@/utils/request'

export function platforms(data) {
  return request({
    url: '/meta/platforms',
    method: 'get',
    data
  })
}

