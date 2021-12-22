<template>
  <v-container>
		<v-row>
			<v-col>
				<h2>Logged Out successfully</h2>
				<router-link to="/login">Login</router-link>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
	import Vue from 'Vue';

	export default Vue.extend({
		name: "Logout",
		data: () => ({
			//
		}),
	});
</script>