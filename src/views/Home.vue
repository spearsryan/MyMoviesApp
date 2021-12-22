<template>
  <v-container>
		<v-row>
			<v-col>
        <v-text-field v-model="movieName"></v-text-field>
			</v-col>
			<v-col>
        <v-btn @click="addMovie">Add Movie</v-btn>
			</v-col>
			<v-col>
        <ul>
          <li v-for="movie in movies" :key="movie.MovieId">{{ movie.MovieName }}</li>
        </ul>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
	import Vue from 'vue';
	import auth from "../app/auth";
	import axios from "axios";

	export default Vue.extend({
		name: "Home",
		components: {},
		created() {
			this.getMovies();
		},
		data: function() {
			return {
				movieName: null,
				movies: []
			};
		},
		methods: {
			addMovie() {
				const jwtToken = auth.auth.getSignInUserSession().getIdToken().jwtToken;

				const requestData = {
					MovieName: this.movieName
				};

				const config = {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + jwtToken
					}
				};

				return axios
					.post(
						"https://0tuwws2k03.execute-api.us-east-2.amazonaws.com/v1",
						requestData,
						config
					)
					.then(response => {
						console.log(response.data);
						this.getMovies();
						return response.data;
					})
					.catch(err => {
						console.log(err);
					});
			},
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
