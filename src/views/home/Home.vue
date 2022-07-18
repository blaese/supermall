<template>
	<div id="home">
		<nav-bar class="home-nav">
			<div slot="center">购物街</div>
		</nav-bar>
		<home-swiper :banners="banners"></home-swiper>
		<recommend-view :recommends="recommends"></recommend-view>
		<feature-view />
		<tab-control class="tab-control" :titles="['流行', '新款', '精选']" @tabClick="tabClick"></tab-control>
		<goods-list :goods="showGoods"></goods-list>
	</div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar.vue'
import TabControl from 'components/content/tabControl/TabControl.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'

import {
	getHomeMultidata,
	getHomeGoods
} from 'network/home'

export default {
	name: 'Home',
	components: {
		HomeSwiper,
		RecommendView,
		FeatureView,
		NavBar,
		TabControl,
		GoodsList
	},
	data () {
		return {
			banners: [],
			recommends: [],
			goods: {
				'pop': { page: 0, list: [] },
				'new': { page: 0, list: [] },
				'sell': { page: 0, list: [] },
			},
			currentType: 'pop'
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
			})
		}
	},
}
</script>

<style scoped>
#home {
	padding-top: 44px;
}

.home-nav {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9;
	background-color: var(--color-tint);
	color: #fff;
}

.tab-control {
	position: sticky;
	top: 44px;
	z-index: 9;
	background-color: #fff;
}
</style>