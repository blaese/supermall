import { ADD_COUNTER, ADD_PRODUCT } from './mutation-types'

export default {
	// actions中不仅可以包含异步操作，还可以包含复杂有逻辑性的操作
	addToCart (context, payload) {
		return new Promise((reslove, reject) => {
			// 1.记录是否为已添加的商品
			// find():当参数为true时返回item
			let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

			// 2.计算商品数量
			if (oldProduct) {
				// oldProduct.count++
				context.commit(ADD_COUNTER, oldProduct)
				reslove('当前商品数量+1')
			} else {
				// state.cartList.push(payload)
				context.commit(ADD_PRODUCT, payload)
				payload.count = 1
				reslove('当前商品成功加入购物车')
			}
		})
	}
}