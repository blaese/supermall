<template>
	<div id="detail">
		<detail-nav-bar class="detail-nav"></detail-nav-bar>
		<scroll class="content" ref="scroll">
			<detail-swiper :top-images="topImages"></detail-swiper>
			<detail-base-info :goods="goods"></detail-base-info>
			<detail-shop-info :shop="shop"></detail-shop-info>
			<detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
			<detail-params-info :params-info="paramsInfo"></detail-params-info>
		</scroll>
	</div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamsInfo from './childComps/DetailParamsInfo.vue'

import Scroll from 'components/common/scroll/Scroll.vue'

import { getDetail, Goods, Shop, GoodsParams } from 'network/detail'

export default {
	name: 'Detail',
	components: {
		DetailNavBar,
		DetailSwiper,
		DetailBaseInfo,
		DetailShopInfo,
		DetailGoodsInfo,
		DetailParamsInfo,
		Scroll
	},
	data () {
		return {
			iid: null,
			topImages: [],
			goods: {},
			shop: {},
			detailInfo: {},
			paramsInfo: {}
		}
	},
	created () {
		// 1.保存传入的iid
		this.iid = this.$route.params.id

		// 2.根据iid请求详情数据
		getDetail(this.iid).then(res => {
			const data = res.result
			console.log(data);
			// 1.获取顶部的轮播图数据
			this.topImages = data.itemInfo.topImages

			// 2.获取商品信息
			this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

			// 3.获取店铺信息
			this.shop = new Shop(data.shopInfo)

			// 4.获取商品详情信息
			this.detailInfo = data.detailInfo

			// 5.获取商品参数信息
			this.paramsInfo = new GoodsParams(data.itemParams.info, data.itemParams.rule)
		})
	},
	methods: {
		imageLoad () {
			this.$refs.scroll.refresh()
		}
	}
}
</script>

<style scoped>
#detail {
	position: relative;
	z-index: 9;
	background-color: #fff;
	height: 100vh;
}

.detail-nav {
	position: relative;
	z-index: 9;
	background-color: #fff;
}

.content {
	height: calc(100% - 44px);
}
</style>
