<template>
  <div class="container">
    <span>your ideal</span>
    <span>your guess</span>
    <span>reality</span>
    <bar :readonly="true" :axis="false" :values="this.$store.state.saved.ideal" :canvas-width="canvasWidth" />
    <bar :readonly="true" :axis="false" :values="this.$store.state.saved.current" :canvas-width="canvasWidth" />
    <bar :readonly="true" :axis="false" :values="this.$store.state.saved.reality" :canvas-width="canvasWidth" />
    <distribution :show-values="false" />
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
      canvasWidth: 230
    }
  },
  mounted: async function () {
    const url = '/.netlify/functions/record';

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify((({ current, ideal }) => ({ current, ideal }))(this.$store.state.saved))
    };

    const response = await fetch(url, options);

    if (response.status !== 200) {
      console.log(response);
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
  
  > * {
    flex-basis: calc(33.3333333% - 1rem);
  }

  span {
    text-align: center;
  }

  canvas {
    max-height: 55vh;
    margin-top: 1rem;
  }

  div:last-child {
    padding-bottom: 1rem;
  }
}
</style>