import request from '@/utils/request.js'

// 请求地址
export const getAddressList = () => {
  return request.get('/address/list')
}
