<template>
	<div class="bottom-bar">
		<div class="check-content">
			<check-button class="check-button" :is-checked="isSelectAll" @click.native="checkClick"></check-button>
			<span>全选</span>
		</div>
		<div class="price">
			合计：￥{{ totalPrice }}
		</div>
		<div class="calculate" @click="calcClick">去计算({{ checkLength }})</div>
	</div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton.vue'

import { mapGetters } from 'vuex'

export default {
	name: 'CartBottomBar',
	components: {
		CheckButton
	},
	computed: {
		...mapGetters(['cartList']),
		totalPrice () {
			return this.cartList.filter(item => {
				return item.checked
			}).reduce((preValue, item) => {
				return preValue + item.price * item.count
			}, 0).toFixed(2)
		},
		checkLength () {
			return this.cartList.filter(item => item.checked).length
		},
		isSelectAll () {
			if (this.cartList.length === 0) return false
			return this.cartList.every(item => item.checked)
		}
	},
	methods: {
		checkClick () {
			if (this.isSelectAll) {
				this.cartList.forEach(item => item.checked = false);
			} else {
				this.cartList.forEach(item => item.checked = true);
			}
		},
		calcClick () {
			if (!this.isSelectAll) {
				console.log(this.$toast);
				this.$toast.show('请选择购买的商品', 2000)
			}
		}
	}
}
</script>

<style scoped>
.bottom-bar {
	display: flex;
	align-items: center;
	height: 40px;
	background-color: #eee;
	font-size: 14px;
}

.check-content {
	display: flex;
	align-items: center;
	margin-left: 5px;
	width: 60px;
}

.check-button {
	width: 20px;
	height: 20px;
	margin-right: 5px;
}

.price {
	flex: 1;
	margin-left: 25px;
}

.calculate {
	width: 90px;
	line-height: 40px;
	height: 100%;
	text-align: center;
	background-color: orangered;
	color: #fff;
}
</style>
