import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import "lib-flexible"
import echarts from 'echarts'
import kaokao from '../src/static/css/kaokao.css'

Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts ;

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')



