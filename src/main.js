import Vue from 'vue';
import app from './App.vue';
import Cloudbase from '@cloudbase/vue-provider';
import config from '../cloudbaserc';
import './tcb';
import './style/index.scss';

Vue.config.productionTip = false;

Vue.use(Cloudbase, {
  env: config.envId,
});

new Vue({
  render: (h) => h(app),
}).$mount('#app');
