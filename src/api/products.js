import request from '@/utils/request'

// 请求商品列表数据
export const getGoodsList = (obj) => {
  const { categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      categoryId,
      goodsName,
      page
    }
  })
}

// 获商品详情
export const getGoodsDetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 获取商品评论
export const getGoodComment = (goodsId) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit: 3
    }
  })
}
