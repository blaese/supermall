<template>
	<div id="home">
		<nav-bar class="home-nav">
			<div slot="center">购物街</div>
		</nav-bar>
		<tab-control ref="tabControl1" :titles="['流行', '新款', '精选']" @tabClick="tabClick" class="tab-control"
			v-show="isTabFixed">
		</tab-control>

		<scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true"
			@pullingUp="loadMore">
			<home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
			<recommend-view :recommends="recommends"></recommend-view>
			<feature-view />
			<tab-control ref="tabControl2" :titles="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
			<goods-list :goods="showGoods"></goods-list>
		</scroll>

		<back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
	</div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar.vue'
import TabControl from 'components/content/tabControl/TabControl.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'
import Scroll from 'components/common/scroll/Scroll.vue'
import BackTop from 'components/content/backTop/BackTop.vue'

import { getHomeMultidata, getHomeGoods } from 'network/home'
import { debounce } from 'common/utils'
import { itemListenerMixin } from 'common/mixin'

export default {
	name: 'Home',
	components: {
		HomeSwiper,
		RecommendView,
		FeatureView,
		NavBar,
		TabControl,
		GoodsList,
		Scroll,
		BackTop
	},
	mixins: [itemListenerMixin],
	data () {
		return {
			banners: [],
			recommends: [],
			goods: {
				'pop': { page: 0, list: [] },
				'new': { page: 0, list: [] },
				'sell': { page: 0, list: [] },
			},
			currentType: 'pop',
			isShowBackTop: false,
			tabOffsetTop: 0,
			isTabFixed: false,
			saveY: 0
		}
	},
	computed: {
		showGoods () {
			return this.goods[this.currentType].list
		}
	},
	created () {
		// 1.请求多个数据
		this.getHomeMultidata()
		// 2.请求商品数据
		this.getHomeGoods('pop')
		this.getHomeGoods('new')
		this.getHomeGoods('sell')
	},
	activated () {
		this.$refs.scroll.scrollTo(0, this.saveY, 0)
		this.$refs.scroll.refresh()
	},
	deactivated () {
		// 1.获取y值
		this.saveY = this.$refs.scroll.getScrollY()
		// 2.取消全局事件的监听
		this.$bus.$off('itemImageLoad', this.itemImgListener)
	},
	methods: {
		/* 事件监听的相关方法 */
		tabClick (index) {
			switch (index) {
				case 0:
					this.currentType = 'pop'
					break
				case 1:
					this.currentType = 'new'
					break
				case 2:
					this.currentType = 'sell'
					break
			}
			// 点击其中一个tabControl，两个组件的currentIndex都同时变化
			this.$refs.tabControl1.currentIndex = index;
			this.$refs.tabControl2.currentIndex = index;
		},
		backClick () {
			this.$refs.scroll.scrollTo(0, 0)
		},
		contentScroll (position) {
			// 1.判断BackTop是否显示
			this.isShowBackTop = (-position.y) > 800

			// 2.决定tabControl是否吸顶(是否有position:fixed)
			this.isTabFixed = (-position.y) > this.tabOffsetTop
		},
		loadMore () {
			this.getHomeGoods(this.currentType)
		},
		swiperImageLoad () {
			// 2.获取tabControl的offsetTop
			// 所有组件都有一个属性$el:用于获取组件中的元素
			this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
		},
		/* 网络请求的相关方法 */
		getHomeMultidata () {
			getHomeMultidata().then(res => {
				this.banners = res.data.banner.list
				this.recommends = res.data.recommend.list
			})
		},
		getHomeGoods (type) {
			const page = this.goods[type].page + 1
			getHomeGoods(type, page).then(res => {
				// 不能直接把数组push进去，否则会把数组当成一个元素
				this.goods[type].list.push(...res.data.list)
				this.goods[type].page += 1

				// 每次请求完数据应该调用finishPullUp()完成上拉加载更多才能保证下一页也能加载
				this.$refs.scroll.finishPullUp()
			})
		}
	}
}
</script>

<style scoped>
#home {
	position: relative;
	height: 100vh;
}

.home-nav {
	/* 在使用浏览器原生滚动时，为了让组件不跟随导航一起滚动 */
	/* position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9; */
	background-color: var(--color-tint);
	color: #fff;
}

.content {
	overflow: hidden;
	position: absolute;
	top: 44px;
	bottom: 49px;
	left: 0;
	right: 0;
	/* margin-top: 44px;
	height: calc(100% - 93px);
	overflow: hidden; */
}

.tab-control {
	position: relative;
	z-index: 9;
}
</style>