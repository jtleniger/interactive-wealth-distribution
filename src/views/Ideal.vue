<template>
  <div class="container">
    <div>
      cool. now what do you think it should be? what's an <em>ideal</em> split?
    </div>
    <Bar v-on:percents="recordPercents" />
    <Distribution/>
    <div>
      <router-link to="/compare">done</router-link>
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
  },
  methods: {
    recordPercents: function (args) {
      this.$store.commit('setPercents', args);
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('savePercents', 'ideal');
    next();
  }
}
</script>
