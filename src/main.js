import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueGoodTablePlugin from 'vue-good-table-next';
// import the styles 
import 'vue-good-table-next/dist/vue-good-table-next.css'

import './assets/main.css'

import VueApexCharts from "vue3-apexcharts";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App)
app.use(router)
app.use(VueGoodTablePlugin);
app.use(VueApexCharts);
app.component('EasyDataTable', Vue3EasyDataTable);
app.mount('#app')
