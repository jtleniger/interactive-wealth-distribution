<template>
  <div class="home">
    <Bar/>
  </div>
</template>

<script>
import Bar from '@/components/Bar.vue'

export default {
  name: 'Home',
  components: {
    Bar
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
}
</style>
