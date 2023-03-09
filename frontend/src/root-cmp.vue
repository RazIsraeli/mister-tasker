<template>
  <section class="root-cmp">
    <user-msg />
    <app-header />
    <router-view />
  </section>
</template>

<script>
import { store } from './store/store'
import appHeader from './cmps/app-header.vue'
import userMsg from './cmps/user-msg.vue'

export default {
  async created() {
    console.log('Vue App created')
    await this.$store.dispatch({ type: 'loadTasks' })
  },
  components: {
    appHeader,
    userMsg,
  },
}
</script>
