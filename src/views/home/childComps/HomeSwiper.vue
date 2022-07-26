<template>
	<swiper>
		<swiper-item v-for="item in banners" :key="item.title">
			<a :href="item.link">
				<img :src="item.image" alt="" @load="imageLoad">
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
	data () {
		return {
			isLoad: false
		}
	},
	components: {
		Swiper,
		SwiperItem
	},
	methods: {
		imageLoad () {
			if (!this.isLoad) {
				this.$emit('swiperImageLoad')
				this.isLoad = true
			}
		}
	}
}
</script>

<style scoped>
</style>
