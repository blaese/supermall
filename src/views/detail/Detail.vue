<template>
	<div id="detail">
		<detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
		<scroll class="content" ref="scroll" :probe-type="3" @scroll="contentSrcoll">
			<detail-swiper :top-images="topImages"></detail-swiper>
			<detail-base-info :goods="goods"></detail-base-info>
			<detail-shop-info :shop="shop"></detail-shop-info>
			<detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
			<detail-params-info ref="params" :params-info="paramsInfo"></detail-params-info>
			<detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
			<goods-list ref="recommend" :goods="recommends"></goods-list>
		</scroll>
		<detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
		<back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
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
import DetailBottomBar from './childComps/DetailBottomBar.vue'

import Scroll from 'components/common/scroll/Scroll.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'

import { getDetail, getRecommend, Goods, Shop, GoodsParams } from 'network/detail'
import { itemListenerMixin, backTopMixin } from 'common/mixin'
import { debounce } from 'common/utils'

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
		DetailBottomBar,
		Scroll,
		GoodsList
	},
	mixins: [itemListenerMixin, backTopMixin],
	data () {
		return {
			iid: null,
			topImages: [],
			goods: {},
			shop: {},
			detailInfo: {},
			paramsInfo: {},
			commentInfo: {},
			recommends: [],
			themeTopYs: [],
			getThemeTopY: null,
			currentIndex: 0
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

		// 4.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
		this.getThemeTopY = debounce(() => {
			this.themeTopYs = []
			this.themeTopYs.push(0)
			this.themeTopYs.push(this.$refs.params.$el.offsetTop)
			this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
			this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
			this.themeTopYs.push(Number.MAX_VALUE)
		}, 500)
	},
	destroyed () {
		this.$bus.$off('itemImageLoad', this.itemImgListener)
	},
	methods: {
		imageLoad () {
			// 如果直接使用防抖，在methods中每使用一次就要重新生成一个防抖，无法起到防抖效果，因此使用mixin中赋值的防抖
			this.newRefresh()
			this.getThemeTopY()
		},
		titleClick (index) {
			this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
		},
		contentSrcoll (position) {
			// 1.获取Y值
			const positionY = -position.y
			// 2.将positionY和标题themeTopYs中的值进行对比
			let length = this.themeTopYs.length
			// 普通做法 复杂判断
			// for (let i = 0; i < length; i++) {
			// 	// this.currentIndex !== i && hack做法，只赋值一次
			// 	if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i]
			// 		&& positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
			// 		this.currentIndex = i
			// 		this.$refs.nav.currentIndex = this.currentIndex
			// 	}
			// }
			// hack做法，给themeTopYs数组push一个Number.MAX_VALUE
			for (let i = 0; i < length - 1; i++) {
				if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
					this.currentIndex = i
					this.$refs.nav.currentIndex = this.currentIndex
				}
			}
			// mixin中的回到顶部
			this.listenShowBackTop(position)
		},
		addToCart () {
			// 1.获取购物车需要展示的信息
			const product = {}
			product.image = this.topImages[0]
			product.title = this.goods.title
			product.desc = this.goods.desc
			product.price = this.goods.realPrice
			product.iid = this.iid

			// 2.将商品加入购物车
			this.$store.dispatch('addToCart', product).then(res => {
				this.$toast.show(res, 2000)
			})

			// 3.添加到购物车成功

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
	height: calc(100% - 93px);
}
</style>
