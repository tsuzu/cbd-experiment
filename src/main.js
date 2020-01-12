import Vue from 'vue'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify';
import API from './API';

/* eslint-disable */
API.signin().then(() => {
  return API.get_problems()
}).catch(err => console.error(err))


Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
