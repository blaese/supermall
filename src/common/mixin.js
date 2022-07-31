import { debounce } from 'common/utils'
import { TOP_DISTANCE } from "common/const";

import BackTop from 'components/content/backTop/BackTop.vue'

export const itemListenerMixin = {
	data () {
		return {
			itemImgListener: null,
			newRefresh: null
		}
	},
	mounted () {
		this.newRefresh = debounce(this.$refs.scroll.refresh, 100)
		this.itemImgListener = () => {
			this.newRefresh()
		}
		this.$bus.$on('itemImageLoad', this.itemImgListener)
	},
}

export const backTopMixin = {
	data () {
		return {
			isShowBackTop: false
		}
	},
	components: {
		BackTop
	},
	methods: {
		backTop () {
			this.$refs.scroll.scrollTo(0, 0, 300)
		},
		listenShowBackTop (position) {
			this.isShowBackTop = (-position.y) >= TOP_DISTANCE
		}
	},
}