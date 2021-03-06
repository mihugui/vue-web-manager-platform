// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vuex from 'vuex'
import router from './router'
import lodash from 'vue-lodash'
import store from './stores'
import global from './globbal/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import 'babel-polyfill'
import $ from 'jquery'
import echarts from 'echarts'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

const options = { name: 'lodash' }
Vue.use(lodash, options)
Vue.use(global, router)
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
