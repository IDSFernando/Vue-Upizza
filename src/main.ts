import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import axios from 'axios'

Vue.prototype.$axios = axios
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');