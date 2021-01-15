<template>
  <div class="container">
    <Bar :readonly="true" :axis="false" :values="this.$store.state.saved.ideal" />
  </div>
</template>

<script>
import Bar from '@/components/Bar.vue'

export default {
  name: 'Compare',
  components: {
    Bar
  }
}
</script>