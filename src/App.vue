<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    if (!this.$q.localStorage.has('switchAccount')) {
      this.$q.localStorage.set('switchAccount', true)
    }
  }
}
</script>

<style>

</style>
