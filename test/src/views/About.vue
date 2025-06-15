<template>
  <div class="about">
    <h1>This is about</h1>
    <button @click="jsErr">js error</button>
  </div>
  <div class="about-2">
    <h1>This is about 2</h1>
  </div>
</template>

<script>
export default {
  name: 'About',
  methods: {
    jsErr() {
      const num = 12.34;
      console.log(num.toFixed(-1)); // 报错，num 不是一个函数
    },
  },
};
</script>
