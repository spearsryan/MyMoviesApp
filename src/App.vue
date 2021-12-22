<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>My Movies App</v-toolbar-title>

			<v-spacer></v-spacer>
			<div v-if="!!name" class="d-none d-sm-inline-flex text-h4">{{ `Welcome, ${name}` }}</div>
			<v-tooltip bottom v-if="!!name">
				<template v-slot:activator="{ on, attrs }">
					<v-btn
							class="d-inline-flex d-sm-none"
							icon
							v-bind="attrs"
							v-on="on">
						<v-icon>
							mdi-account-circle
						</v-icon>
					</v-btn>
				</template>
				<span>{{ `Welcome, ${name}` }}</span>
			</v-tooltip>
			<div v-if="!name">
				<a :href="signInUrl">Login</a>
			</div>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view :key="$route.fullPath" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { useGetters } from './store/user';

export default Vue.extend({
  name: "App",
  data: () => ({
		appName: "my-movies-app",
		awsRegion: "us-east-2",
		clientId: "4lo9gf8ufnr8tdoh6vd70hl4e6",
		redirectUrl: "http://localhost:8080",
  }),
	computed: {
		name() {
			return useGetters(["name"]).name.value ? useGetters(["name"]).name.value : "N/A";
		},
		signInUrl() {
			return `https://${this.appName}.auth.${this.awsRegion}.amazoncognito.com/login?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}`;
		}
	}
});
</script>
