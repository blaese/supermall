import { debounce } from 'common/utils'
import { TOP_DISTANCE } from "common/const";

import { POP, NEW, SELL } from "./const";

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

export const tabControlMixin = {
	data: function () {
		return {
			currentType: POP
		}
	},
	methods: {
		tabClick (index) {
			switch (index) {
				case 0:
					this.currentType = POP
					break
				case 1:
					this.currentType = NEW
					break
				case 2:
					this.currentType = SELL
					break
			}
		}
	}
}