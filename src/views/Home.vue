<template>
  <div class="home">
    <div class="row">
      <div class="col">
        <h3>Welcome,</h3>
        <div class="alert alert-info">{{ userInfo }}</div>
        <router-link to="/logout">Logout</router-link>
      </div>
      <div class="col">
        <a :href="signInUrl">Login</a>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <v-text-field v-model="movieName"></v-text-field>
      </div>
      <div class="col">
        <v-btn @click="addMovie">Add Movie</v-btn>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ul>
          <li v-for="movie in movies" :key="movie.MovieId">{{ movie.MovieName }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Store from "@/store/index";
import { mapGetters } from "vuex";
import auth from "@/app/auth";
import axios from "axios";

export default {
  name: "home",
  components: {},
  created() {
    this.getMovies();
  },
  data: function() {
    return {
      appName: "my-movies-app",
      awsRegion: "us-east-2",
      clientId: "4lo9gf8ufnr8tdoh6vd70hl4e6",
      redirectUrl: "http://localhost:8080",
      movieName: null,
      movies: []
    };
  },
  computed: {
    ...mapGetters({ userInfo: "getCognitoInfo" }),
    signInUrl() {
      return `https://${this.appName}.auth.${this.awsRegion}.amazoncognito.com/login?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}`;
    }
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
};
</script>
