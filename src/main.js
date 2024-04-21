import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import router from './router'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BootstrapVue3 } from 'bootstrap-vue-3'

createApp(App).use(router).use(BootstrapVue3).mount('#app')