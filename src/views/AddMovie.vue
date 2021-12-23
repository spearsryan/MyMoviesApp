<template>
  <v-container>
		<v-row>
			<v-col md="6" sm="12" cols="12">
        <v-text-field
					v-model="movieName"
					label="Movie Name">
				</v-text-field>
			</v-col>
			<v-col md="6" sm="12" cols="12">
        <v-text-field
					v-model="alphabeticalMovieName"
					label="Alphabetical Movie Name">
				</v-text-field>
			</v-col>
			<v-col md="2" sm="12" cols="12">
				<v-checkbox
					v-model="own"
					label="Owned?">
				</v-checkbox>
			</v-col>
			<v-col md="2" sm="12" cols="12">
        <v-format-dropdown
					v-model="ownFormat"
					label="Owned Format">
				</v-format-dropdown>
			</v-col>
			<v-col md="2" sm="12" cols="12">
				<v-checkbox
					v-model="wishlist"
					label="Wishlist Item">
				</v-checkbox>
			</v-col>
			<v-col md="2" sm="12" cols="12">
        <v-format-dropdown
					v-model="wishlistFormat"
					label="What format do you want?">
				</v-format-dropdown>
			</v-col>
			<v-col md="2" sm="12" cols="12">
        <v-watch-status
					v-model="watchStatus"
					label="Watch Status">
				</v-watch-status>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
        <v-btn to="/">Cancel</v-btn>
				&nbsp;
        <v-btn @click="addMovie">Add Movie</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
	import Vue from 'vue';
	import auth from "@/app/auth";
	import axios from "axios";
	import FormatDropdown from "@/components/FormatDropdown.vue";
	import WatchStatus from "@/components/WatchStatus.vue";

	export default Vue.extend({
		name: "AddMovie",
		components: {
			"v-format-dropdown": FormatDropdown,
			"v-watch-status": WatchStatus
		},
		data: function() {
			return {
				movieName: null,
				alphabeticalMovieName: null,
				own: false,
				ownFormat: null,
				watchStatus: null,
				wishlist: false,
				wishlistFormat: null
			};
		},
		methods: {
			addMovie() {
				const jwtToken = auth.auth.getSignInUserSession().getIdToken().jwtToken;

				const requestData = {
					MovieName: this.movieName,
					AlphabeticalMovieName: this.alphabeticalMovieName,
					Own: this.own,
					OwnFormat: this.ownFormat,
					WatchStatus: this.watchStatus,
					Wishlist: this.wishlist,
					WishlistFormat: this.wishlistFormat
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
						return response.data;
					})
					.catch(err => {
						console.log(err);
					});
			}
		}
	});
</script>
