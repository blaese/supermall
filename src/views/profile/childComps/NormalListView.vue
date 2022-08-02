<template>
	<div class="normal-list">
		<div v-for="(item, index) in listData" :key="index" class="item">
			<span class="icon">
				<img :src="iconURL(item)" alt="">
			</span>
			<div class="info">{{ item.info }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "NormalListView",
	props: {
		listData: {
			type: Array,
			default () {
				return []
			}
		}
	},
	methods: {
		iconURL (item) {
			return require('assets/img/profile/' + item.icon)
		}
	}
}
</script>

<style scoped>
.normal-list {
	background-color: #fff;
	margin-top: 15px;
	font-size: 15px;
	color: #333;
}

.normal-list .item {
	position: relative;
	height: 44px;
	line-height: 44px;
}

.item .icon {
	position: absolute;
	top: 5px;
	left: 16px;
}

.icon img {
	width: 20px;
	height: 20px;
}

.item .info {
	margin-left: 40px;
	padding-left: 5px;
	border-bottom: 1px solid rgba(100, 100, 100, .1);
}

.item:last-child .info {
	border-bottom: none;
}
</style>