<template>
  <v-container>
		<v-row>
			<v-col>
				<h3>Error</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<p>{{ message }}</p>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'Error',
		props: {
			message: String,
			error: Object
		},
		data() {
			return {

			};
		},
		mounted() {
			console.log('Error Object: ', this.error);
		}
  })
</script>

