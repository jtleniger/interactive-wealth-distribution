<template>
  <div class="container">
    <div>your ideal</div>
    <div>your guess</div>
    <div>reality</div>
    <bar :readonly="true" :axis="false" :values="this.$store.state.saved.ideal" :canvas-width="canvasWidth" />
    <bar :readonly="true" :axis="false" :values="this.$store.state.saved.current" :canvas-width="canvasWidth" />
    <bar :readonly="true" :axis="false" :values="this.$store.state.saved.current" :canvas-width="canvasWidth" />
    <distribution />
  </div>
</template>

<script>
import Bar from '@/components/Bar.vue'
import Distribution from '../components/Distribution.vue'

export default {
  name: 'Compare',
  components: {
    Bar,
    Distribution
  },
  data: function () {
    return {
      canvasWidth: 270
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 1rem;
  height: initial;

  div:first-child {
    padding-top: 0;
  }
  
  > * {
    flex-basis: calc(33.3333333% - 1rem);
  }

  canvas {
    max-height: 70vh;
    margin-top: 1rem;
  }
}
</style>