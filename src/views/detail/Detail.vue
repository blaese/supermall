<template>
	<div id="detail">
		<detail-nav-bar class="detail-nav"></detail-nav-bar>
		<scroll class="content" ref="scroll">
			<detail-swiper :top-images="topImages"></detail-swiper>
			<detail-base-info :goods="goods"></detail-base-info>
			<detail-shop-info :shop="shop"></detail-shop-info>
			<detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
			<detail-params-info :params-info="paramsInfo"></detail-params-info>
			<detail-comment-info :comment-info="commentInfo"></detail-comment-info>
			<goods-list :goods="recommends"></goods-list>
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
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'

import Scroll from 'components/common/scroll/Scroll.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'

import { getDetail, getRecommend, Goods, Shop, GoodsParams } from 'network/detail'
import { itemListenerMixin } from 'common/mixin'

export default {
	name: 'Detail',
	components: {
		DetailNavBar,
		DetailSwiper,
		DetailBaseInfo,
		DetailShopInfo,
		DetailGoodsInfo,
		DetailParamsInfo,
		DetailCommentInfo,
		Scroll,
		GoodsList
	},
	mixins: [itemListenerMixin],
	data () {
		return {
			iid: null,
			topImages: [],
			goods: {},
			shop: {},
			detailInfo: {},
			paramsInfo: {},
			commentInfo: {},
			recommends: []
		}
	},
	created () {
		// 1.保存传入的iid
		this.iid = this.$route.params.id

		// 2.根据iid请求详情数据
		getDetail(this.iid).then(res => {
			const data = res.result
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

			// 6.获取评论信息
			if (data.rate.cRate !== 0) {
				this.commentInfo = data.rate.list[0]
			}
		})

		// 3.获取详情数据
		getRecommend().then(res => {
			this.recommends = res.data.list
		})
	},
	destroyed () {
		this.$bus.$off('itemImageLoad', this.itemImgListener)
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
