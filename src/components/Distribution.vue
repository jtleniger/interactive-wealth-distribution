<template>
  <div>
    <table>
      <tr v-for="(percentile, index) in percentiles" v-bind:key="index">
        <th :style="{ borderLeft: `2px solid ${colors[index]}`}">
          {{ percentile }}
        </th>
        <td v-if="showValues">
          {{ prettyPercents[index] }}%
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { SEGMENT_COLORS } from '@/common.js';

export default {
  props: {
    showValues: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      percentiles: [
        'top',
        'fourth',
        'middle',
        'second',
        'bottom'
      ],
      colors: SEGMENT_COLORS
    }
  },
  computed: {
    prettyPercents: function () {
      return this.$store.state.percents.map(p => Math.round(p));
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}
table {
  width: 100%;
  table-layout: fixed;
}

tr {
  width: 100%;
}

th {
  text-align: left;
}

td {
  text-align: right;
}

th, td {
  padding: 0.1rem;
}
</style>