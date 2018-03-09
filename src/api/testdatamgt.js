import request from '@/utils/request'

export function fetchApiList() {
  return request({
    url: '/getApiList',
    method: 'get'
  })
}

export function fetchApiParameterDataInfo(id) {
  return request({
    url: '/getApiParameterDataInfo',
    method: 'get',
    params: id
  })
}

export function saveApiDataInfo(data) {
  delete data.edit
  return request({
    url: '/saveApiDataInfo',
    method: 'post',
    data
  })
}
