<template>
  <div>
    <h1>Hello Vuetify3</h1>
    <v-btn color="primary" @click=handleClick>Hello</v-btn>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  alert("nuxt3");
}
</script>