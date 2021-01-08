<template>
  <div id="app">
    <Crud />
  </div>
</template>

<script>
import Crud from './components/Crud.vue'

export default {
  name: 'App',
  components: {
    Crud
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*{
  padding: 0;
  margin: 0;
}
</style>
