<template>
  <div class="container">
    <div>
      you can adjust each chunk's share by dragging at the edges. it's split into 5 groups by population.
    </div>
    <Bar v-on:percents="recordPercents" />
    <Distribution/>
    <div>
      <router-link to="/ideal">done</router-link>
    </div>
  </div>
</template>

<script>
import Bar from '@/components/Bar.vue'
import Distribution from '@/components/Distribution.vue'

export default {
  name: 'Current',
  components: {
    Bar,
    Distribution
  },
  methods: {
    recordPercents: function (args) {
      this.$store.commit('setPercents', args);
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('savePercents', 'current');
    next();
  }
}
</script>
