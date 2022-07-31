import { ADD_COUNTER, ADD_PRODUCT } from './mutation-types'

export default {
	// mutations中的方法应该完成的事件应该尽可能单一
	[ADD_COUNTER] (state, payload) {
		payload.count++
	},
	[ADD_PRODUCT] (state, payload) {
		payload.checked = true
		state.cartList.push(payload)
	}
}