<template>
	<div class="wrapper" ref="wrapper">
		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
	name: 'Scroll',
	data () {
		return {
			scroll: null
		}
	},
	props: {
		// probeType 侦测滚动
		probeType: {
			type: Number,
			default: 0
		},
		// pullUpLoad 触发上拉事件的阈值
		pullUpLoad: {
			type: Boolean,
			default: false
		}
	},
	mounted () {
		// 1.创建BScroll对象
		this.scroll = new BScroll(this.$refs.wrapper, {
			click: true,
			probeType: this.probeType,
			pullUpLoad: this.pullUpLoad
		})

		// 2.监听滚动的位置
		this.scroll.on('scroll', (position) => {
			this.$emit('scroll', position)
		})

		// 3.监听scroll滚动到底部
		if (this.pullUpLoad) {
			this.scroll.on('pullingUp', () => {
				this.$emit('pullingUp')
			})
		}
	},
	methods: {
		// ES6语法：time默认是500毫秒，在time时间内滚动到(x,y)位置
		scrollTo (x, y, time = 500) {
			this.scroll && this.scroll.scrollTo(x, y, time)
		},
		finishPullUp () {
			this.scroll.finishPullUp()
		},
		refresh () {
			this.scroll && this.scroll.refresh()
		},
		getScrollY () {
			return this.scroll ? this.scroll.y : 0
		}
	},
}
</script>

<style scoped>
</style>
