import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import Monitor from '@cds-monitor/core';
import PerformancePlugin from '@cds-monitor/performance';

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
Monitor.use([{ plugin: PerformancePlugin }]);
function createLongTask() {
  const startTime = Date.now();
  // 执行一个耗时约 1000ms 的计算
  while (Date.now() - startTime < 1000) {
    // 进行大量计算
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Math.random() * Math.random();
  }
}
createLongTask();
app.mount('#app');
