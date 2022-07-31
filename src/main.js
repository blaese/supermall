import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLOad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 用Vue实例作为事件总线
Vue.prototype.$bus = new Vue()
// 安装toast插件
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

// 使用图片懒加载插件
Vue.use(VueLazyLOad, {
	loading: require('./assets/img/common/placeholder.png')
})

new Vue({
	render: h => h(App),
	router,
	store
}).$mount('#app')
