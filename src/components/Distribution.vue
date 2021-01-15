<template>
  <div>
    <table>
      <tr>
        <th>
          top 20%
        </th>
        <td>
          {{ prettyPercents[0] }}%
        </td>
      </tr>
      <tr>
        <th>
          fourth 20%
        </th>
        <td>
          {{ prettyPercents[1] }}%
        </td>
      </tr>
      <tr>
        <th>
          middle 20%
        </th>
        <td>
          {{ prettyPercents[2] }}%
        </td>
      </tr>
      <tr>
        <th>
          second 20%
        </th>
        <td>
          {{ prettyPercents[3] }}%
        </td>
      </tr>
      <tr>
        <th>
          bottom 20%
        </th>
        <td>
          {{ prettyPercents[4] }}%
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
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
</style>