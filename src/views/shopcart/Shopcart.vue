<template>
	<div id="cart">
		<!-- 导航 -->
		<nav-bar class="nav-bar">
			<div slot="center">购物车({{ cartLength }})</div>
		</nav-bar>
		<!-- 商品列表 -->
		<scroll class="content" ref="scroll">
			<cart-list></cart-list>
		</scroll>
		<!-- 底部汇总 -->
		<cart-bottom-bar></cart-bottom-bar>
	</div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import Scroll from 'components/common/scroll/Scroll.vue'

import CartList from './childComps/CartList.vue'
import CartBottomBar from './childComps/CartBottomBar.vue'

import { mapGetters } from 'vuex'

export default {
	name: 'Shopcart',
	components: {
		NavBar,
		Scroll,
		CartList,
		CartBottomBar
	},
	computed: {
		...mapGetters(['cartLength'])
	},
	activated () {
		// 回到页面时应该重新计算scrollHeight,以确保可以滚动
		this.$refs.scroll.refresh()
	}
}
</script>

<style scoped>
#cart {
	height: 100vh;
}

.nav-bar {
	background-color: var(--color-tint);
	color: #fff;
}

.content {
	height: calc(100% - 133px);
	overflow: hidden;
}
</style>