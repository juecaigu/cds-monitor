<template>
  <div class="about">
    <h1>This is HOME</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const scriptLoadError = () => {
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.src = 'www.xxx.com/xxx.js';
  head.appendChild(script);
};

const imgLoadError = () => {
  const body = document.getElementsByTagName('body')[0];
  const img = document.createElement('img');
  img.style.width = '1000px';
  img.style.height = '500px';
  img.src = 'wwww.xxx.png';
  setTimeout(() => {
    body.append(img);
  }, 500);
};

onMounted(() => {
  scriptLoadError();
  imgLoadError();
});
</script>
