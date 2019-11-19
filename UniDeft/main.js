import Vue from 'vue'
import App from './App'

// 引入请求模块
import uRequest from './utils/request/uRequest.js'
Vue.prototype.$uRequest = uRequest

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
