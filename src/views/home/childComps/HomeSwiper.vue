<template>
	<swiper>
		<swiper-item v-for="item in banners" :key="item.title">
			<a :href="item.link">
				<img :src="item.image" alt="">
			</a>
		</swiper-item>
	</swiper>
</template>

<script>
import { Swiper, SwiperItem } from 'components/common/swiper'

export default {
	name: "HomeSwiper",
	props: {
		banners: {
			type: Array,
			// 类型是对象或者数组时, 默认值必须从一个函数获取
			default () {
				return []
			}
		}
	},
	components: {
		Swiper,
		SwiperItem
	},
}
</script>

<style scoped>
</style>
