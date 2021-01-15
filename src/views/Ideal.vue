<template>
  <div class="container">
    <div>
      cool. now what do you think it should be? what's an <em>ideal</em> split?
    </div>
    <Bar/>
    <Distribution/>
    <div>
      <router-link to="/foo">done</router-link>
    </div>
  </div>
</template>

<script>
import Bar from '@/components/Bar.vue'
import Distribution from '@/components/Distribution.vue'

export default {
  name: 'Ideal',
  components: {
    Bar,
    Distribution
  }
}
</script>

<style lang="scss" scoped>

</style>
