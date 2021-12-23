<template>
  <v-container>
		<v-row>
			<v-col>
				<v-data-table
					:headers="headers"
					:items="movies"
					:single-expand="true"
					:expanded.sync="expanded"
					:search="search"
					show-expand
					item-key="MovieId"
					class="elevation-3"
				>
					<template v-slot:top>
						<v-toolbar flat>
							<v-text-field
								v-model="search"
								append-icon="mdi-magnify"
								label="Search"
								hide-details
							></v-text-field>
							<v-spacer></v-spacer>
							<v-btn color="primary" to="AddMovie">Add Movie</v-btn>
						</v-toolbar>
					</template>
					<template v-slot:expanded-item="{ headers, item }">
						<td :colspan="headers.length">
							More info about {{ item.name }}
						</td>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
	import Vue from 'vue';
	import auth from "@/app/auth";
	import axios from "axios";

	export default Vue.extend({
		name: "Home",
		created() {
			this.getMovies();
		},
		data: function() {
			return {
				movieName: null,
				search: '',
				expanded: [],
				headers: [
					{ text: 'Name', value: 'MovieName' },
					{ text: 'Alphabetical', value: 'AlphabeticalMovieName' },
					{ text: 'Own', value: 'Own' },
					{ text: 'OwnFormat', value: 'OwnFormat' },
					{ text: 'WatchStatus', value: 'WatchStatus' },
					{ text: 'Wishlist', value: 'Wishlist' },
					{ text: 'WishlistFormat', value: 'WishlistFormat' },
          { text: '', value: 'data-table-expand' }
				],
				movies: []
			};
		},
		methods: {
			getMovies() {
				const jwtToken = auth.auth.getSignInUserSession().getIdToken().jwtToken;

				var requestData = {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + jwtToken
					}
				};

				return axios
					.get(
						"https://0tuwws2k03.execute-api.us-east-2.amazonaws.com/v1",
						requestData
					)
					.then(response => {
						console.log(response.data);
						this.movies = response.data;
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	});
</script>
