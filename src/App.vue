<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>My Movies App</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view :key="$route.fullPath" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({
    //
  }),
};
</script>
