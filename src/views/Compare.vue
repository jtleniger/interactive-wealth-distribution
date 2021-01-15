<template>
  <div class="container">
    <div>
      {{ JSON.stringify(this.$store.state.saved) }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Compare',
}
</script>