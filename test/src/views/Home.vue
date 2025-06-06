<template>
  <div class="about">
    <h1>This is HOME</h1>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
const handleDomError = () => {
  const node = document.querySelector("#123456");
};
onMounted(() => {
  // js load error
  const head = document.getElementsByTagName("head")[0];
  const script = document.createElement("script");
  script.src = "www.xxx.com/xxx.js";
  head.appendChild(script);
  handleDomError();
});
</script>
