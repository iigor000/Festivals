<template>
  <MainHeader />
  <RouterView />
</template>

<script>
import MainHeader from './components/MainHeader.vue'
import router from './router.js'

export default {
  name: 'App',
  components: {
    MainHeader
  },
  router
}
</script>

<style>
.btn-primary {
  background-color: #259581 !important;
  border-color: #259581 !important;
  }

.btn-primary:hover {
  background-color: #258977 !important;
  border-color: #258977 !important;
  }
</style>
