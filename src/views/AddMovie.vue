<template>
  <v-container>
		<v-form
			:disabled="error != null"
			ref="form"
			v-model="valid"
			lazy-validation
			@submit.prevent="submit"
		>
			<v-row>
				<v-col md="6" sm="12" cols="12">
					<v-text-field v-model="movieName" label="Movie Name" @input="setMovieName"
						required
						:rules="[requiredRule]"
					></v-text-field>
				</v-col>
				<v-col md="6" sm="12" cols="12">
					<v-text-field
						v-model="alphabeticalMovieName"
						label="Alphabetical Movie Name"
						required
						:rules="[requiredRule]"
					></v-text-field>
				</v-col>
				<v-col md="1" sm="12" cols="12">
					<v-checkbox v-model="own" label="Owned?"> </v-checkbox>
				</v-col>
				<v-col md="4" sm="12" cols="12">
					<v-format-multiselect v-model="ownFormat" label="Owned Formats">
					</v-format-multiselect>
				</v-col>
				<v-col md="3" sm="12" cols="12">
					<v-combobox
						v-model="digital"
						label="If Owned Digitally (Format - Location)"
						:items="digitalOptions"
						:search-input.sync="digitalSearch"
						:disabled="disableDigitalDropdown"
					>
						<template v-slot:no-data>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										No results matching "<strong>{{ digitalSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</template></v-combobox>
				</v-col>
				<v-col md="1" sm="12" cols="12">
					<v-checkbox v-model="wishlist" label="Wishlist Item"></v-checkbox>
				</v-col>
				<v-col md="3" sm="12" cols="12">
					<v-format-dropdown
						v-model="wishlistFormat"
						label="Wishlist Format"
					></v-format-dropdown>
				</v-col>
				<v-col md="2" sm="12" cols="12">
					<v-watch-status v-model="watchStatus" label="Watch Status">
					</v-watch-status>
				</v-col>
				<v-col md="5" sm="12" cols="12">
					<v-combobox
						v-model="selectedTags"
						:items="availableTags"
						:search-input.sync="tagSearch"
						hide-selected
						label="Add some tags"
						multiple
						chips
					>
						<template v-slot:selection="{ attrs, item, select, selected }">
							<v-chip
								small
								v-bind="attrs"
								:input-value="selected"
								close
								@click="select"
								@click:close="removeTag(item)"
							>
								{{ item }}
							</v-chip>
						</template>
						<template v-slot:no-data>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>
										No results matching "<strong>{{ tagSearch }}</strong>". Press <kbd>enter</kbd> to create a new one
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</template>
					</v-combobox>
				</v-col>
				<v-col md="5" sm="12" cols="12">
					<v-textarea
						v-model="notes"
						label="Notes"
						rows="1"
						auto-grow
					>
					</v-textarea>
				</v-col>
			</v-row>
			<v-row justify="end">
				<v-btn to="/">Cancel</v-btn>
				&nbsp;
				<v-btn color="primary" @click.stop.prevent="addMovie()">Add Movie</v-btn>
			</v-row>
		</v-form>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import auth from "@/app/auth";
import axios from "axios";
import FormatDropdown from "@/components/FormatDropdown.vue";
import FormatMultiSelect from "@/components/FormatMultiSelect.vue";
import WatchStatus from "@/components/WatchStatus.vue";
import { Movie } from '@/types/Movie';

export default Vue.extend({
  name: "AddMovie",
  components: {
    "v-format-dropdown": FormatDropdown,
		"v-format-multiselect": FormatMultiSelect,
    "v-watch-status": WatchStatus,
  },
  data: function () {
    return {
			valid: false,
			error: null,
      movieName: null as unknown as string,
      alphabeticalMovieName: null as unknown as string,
      ownFormat: [] as Array<string>,
      watchStatus: null as unknown as string,
      wishlistFormat: null as unknown as string,
			selectedTags: [] as Array<string>,
			availableTags: [
				'007 - James Bond',
				'2 Tapes',
				'Alien',
				'Animated',
				'Anime',
				'Arrow Video',
				'Batman',
				'Biblical',
				'Bourne',
				'Christopher Nolan',
				'Clint Eastwood',
				'Criterion',
				'DCEU',
				'Die Hard',
				'Disney Animated',
				'Fast And Furious',
				'John Wayne',
				'John Wick',
				'Lord Of The Rings',
				'Mad Max',
				'Martin Scorsese',
				'Marvel',
				'Marvel - Sony',
				'Matrix',
				'Mini-Series',
				'Naked Gun',
				'Ocean\'s',
				'Packaged as a Collection',
				'Pirates Of The Caribbean',
				'Pixar',
				'Quentin Tarantino',
				'Rambo',
				'Ridley Scott',
				'Rocky',
				'Rush Hour Trilogy',
				'Shout Factory',
				'Shrek',
				'Spider-Man (Sam Rami)',
				'Star Trek',
				'Star Wars',
				'Taken',
				'Terminater',
				'Transformers',
				'TV Show'
			],
			digital: null as unknown as string,
			digitalOptions: [
				'HD - Google',
				'HD - Movies Anywhere',
				'UHD - Movies Anywhere',
				'HD - Vudu',
				'UHD - Vudu',
				'Not Available Digitially'
			],
			digitalSearch: null as unknown as string,
			tagSearch: null as unknown as string,
			notes: null as unknown as string
    };
  },
	computed: {
		disableDigitalDropdown: function () : boolean {
			return !this.ownFormat.includes('Digital');
		}
	},
  methods: {
		requiredRule(val: any) {
			return !val ? 'This field is required' : true;
		},
		setMovieName(val: string) {
			if (val && val.trim().length > 0) {
				const words = val.trim().split(" ").map((word: string) => {
					return word[0].toUpperCase() + word.substring(1);
				});

				const movieName = words.join(" ");
				this.movieName = movieName;

				if (words[0] == 'A' || words[0] == 'An' || words[0] == 'The') {
					words.push(', ' + words.shift());
					this.alphabeticalMovieName = words.join(" ");
				}
			} else {
				this.alphabeticalMovieName = '';
			}
		},
		removeTag(item: string) {
			const index = this.selectedTags.indexOf(item);
			this.selectedTags.splice(index, 1);
		},
    addMovie() {
			if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
				const jwtToken = auth.auth.getSignInUserSession().getIdToken().jwtToken;

				const requestData : Movie = {
					MovieName: this.movieName,
					AlphabeticalMovieName: this.alphabeticalMovieName,
					OwnFormat: this.ownFormat,
					WatchStatus: this.watchStatus,
					WishlistFormat: this.wishlistFormat,
					Digital: this.digital,
					Tags: this.selectedTags,
					Notes: this.notes
				};

				const config = {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + jwtToken,
					},
				};

				return axios
					.post(
						"https://0tuwws2k03.execute-api.us-east-2.amazonaws.com/v1",
						requestData,
						config
					)
					.then((response) => {
						console.log(response.data);
						return response.data;
					})
					.catch((err) => {
						console.log(err);
					});
			}
    },
  },
});
</script>
