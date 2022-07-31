<template>
	<div id="product-item">
		<div class="item-selector">
			<check-button :is-checked="itemInfo.checked" @click.native="checkClick"></check-button>
		</div>
		<div class="item-img">
			<img :src="itemInfo.image" alt="商品图片">
		</div>
		<div class="item-info">
			<div class="item-title">{{ itemInfo.title }}</div>
			<div class="item-desc">{{ itemInfo.desc }}</div>
			<div class="info-bottom">
				<div class="item-price left">¥{{ itemInfo.price }}</div>
				<div class="item-count right">x{{ itemInfo.count }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton.vue'

export default {
	name: 'CartListItem',
	components: {
		CheckButton
	},
	props: {
		itemInfo: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	methods: {
		checkClick () {
			this.itemInfo.checked = !this.itemInfo.checked
		}
	}
}
</script>

<style scoped>
#product-item {
	width: 100%;
	display: flex;
	padding: 5px;
	/* 写代码时div间的回车会造成一个文本节点，这个文本节点会占据一定的距离，因此设置font-size:0;调整盒子间距 */
	font-size: 0;
	border-bottom: 1px solid #ccc;
}

.item-selector {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20px;
}

.item-img {
	padding: 5px;
}

.item-img img {
	width: 80px;
	height: 100px;
	border-radius: 5px;
}

.item-info {
	position: relative;
	font-size: 17px;
	color: #333;
	padding: 5px 10px;
	overflow: hidden;
}

.item-info .item-desc {
	font-size: 14px;
	color: #666;
	margin-top: 15px;
}

.item-title,
.item-desc {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.info-bottom {
	margin-top: 10px;
	position: absolute;
	bottom: 10px;
	left: 10px;
	right: 10px;
}

.info-bottom .item-price {
	color: orangered;
}
</style>
