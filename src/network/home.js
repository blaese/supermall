// 管理首页的所有请求
import { request } from './request'

export function getHomeMultidata () {
	return request({
		url: '/home/multidata'
	})
}