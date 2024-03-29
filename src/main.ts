import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './plugins/vuex';
import vuetify from './plugins/vuetify';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
