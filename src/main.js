import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import el from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'echarts/extension/bmap/bmap'
import 'default-passive-events'

Vue.config.productionTip = false

Vue.use(el, { size: 'small'})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
