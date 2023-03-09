<template>
  <header>
    <nav class="flex align-center">
      <router-link to="/">
        <img
          src="../assets/logo.png"
          alt="logo"
          style="width: 30px; height: 30px"
        />
      </router-link>
      <router-link to="/task">Task</router-link>
      <!-- <router-link to="/review">Reviews</router-link> -->
      <!-- <router-link to="/chat">Chat</router-link> -->
      <!-- <router-link to="/login">Login / Signup</router-link> -->
    </nav>
  </header>
</template>
<script>
export default {
  computed: {},
}
</script>
