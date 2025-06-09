import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import Monitor from '@cds-monitor/core';

const app = createApp(App);
app.use(router).use(Monitor, {
  dsn: 'http://localhost:8080/reportData',
  apikey: 'cds-monitor',
  silentWhiteScreen: true,
  skeletonProject: true,
  repeatCodeError: true,
  userId: 'admin',
  serverTime: () => {
    return Promise.resolve(1000);
  },
});

app.mount('#app');
