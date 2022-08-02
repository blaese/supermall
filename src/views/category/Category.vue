<template>
	<div id="category">
		<nav-bar>
			<div slot="center">商品分类</div>
		</nav-bar>
		<div class="content">
			<tab-menu :categories="categories" @selectItem="selectItem"></tab-menu>
			<scroll id="tab-content" :data="[categoryData]" ref="scroll">
				<div>
					<tab-content-category :subcategories="showSubcategory"></tab-content-category>
					<tab-control :titles="['综合', '新品', '销量']" @itemClick="tabClick" />
					<goods-list :goods="showCategoryDetail" />
				</div>
			</scroll>
		</div>
	</div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'

import TabMenu from './childComps/TabMenu.vue'
import TabContentCategory from './childComps/TabContentCategory.vue'

import { getCategory, getSubcategory, getCategoryDetail } from 'network/category'
import { POP, SELL, NEW } from "common/const"
import { tabControlMixin } from "common/mixin";

export default {
	name: 'Category',
	components: {
		NavBar,
		Scroll,
		TabControl,
		GoodsList,
		TabMenu,
		TabContentCategory
	},
	mixins: [tabControlMixin],
	data () {
		return {
			categories: [],
			categoryData: {},
			currentIndex: -1
		}
	},
	created () {
		// 1.获取分类数据
		this._getCategory()
		// 2.监听图片加载完成
		this.$bus.$on('itemImageLoad', () => {
			this.$refs.scroll.refresh()
		})
	},
	computed: {
		showSubcategory () {
			if (this.currentIndex === -1) return {}
			return this.categoryData[this.currentIndex].subcategories
		},
		showCategoryDetail () {
			if (this.currentIndex === -1) return []
			return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
		}
	},
	methods: {
		/* 请求数据的方法 */
		_getCategory () {
			getCategory().then(res => {
				this.categories = res.data.category.list
				// console.log(this.categories);
				// 初始化每个类别的子数据
				for (let i in this.categories) {
					this.categoryData[i] = {
						subcategories: {},
						categoryDetail: {
							'pop': [],
							'new': [],
							'sell': []
						}
					}
				}
				this._getSubcategories(0)
			})
		},
		_getSubcategories (index) {
			this.currentIndex = index
			const maitKey = this.categories[index].maitKey
			getSubcategory(maitKey).then(res => {
				this.categoryData[index].subcategories = res.data
				this.categoryData = { ...this.categoryData }
				this._getCategoryDetail(POP)
				this._getCategoryDetail(SELL)
				this._getCategoryDetail(NEW)
			})
		},
		_getCategoryDetail (type) {
			const miniWallkey = this.categories[this.currentIndex].miniWallkey
			getCategoryDetail(miniWallkey, type).then(res => {
				this.categoryData[this.currentIndex].categoryDetail[type] = res
				this.categoryData = { ...this.categoryData }
			})
		},
		/* 事件响应相关的方法 */
		selectItem (index) {
			this._getSubcategories(index)
		}
	}
}
</script>

<style scoped>
#category {
	height: 100vh;
}

.nav-bar {
	background-color: var(--color-tint);
	color: #fff;
}

.content {
	position: absolute;
	display: flex;
	top: 44px;
	bottom: 49px;
	left: 0;
	right: 0;
}

#tab-content {
	height: 100%;
	flex: 1;
}
</style>