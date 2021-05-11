import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		cognitoInfo: {},
		isLoggedIn: false,
		error: {}
	},
	getters: {
		getCognitoInfo: state => state.cognitoInfo,
		getError: state => state.error
	},
	mutations: {
		setCognitoInfo(state, value) {
			state.cognitoInfo = value;
		},
		setLoggedIn(state, value) {
			state.isLoggedIn = true;
			state.cognitoInfo = value;
		},
		setLoggedOut(state) {
			state.isLoggedIn = false;
			state.cognitoInfo = {};
		},
		setError(state, value) {
			state.error = value;
		}
	},
	actions: {
		setCognitoInfo: ({
			commit
		}, value) => {
			commit("setCognitoInfo", value);
		},
		setLoggedIn: ({
			commit
		}, value) => {
			commit("setLoggedIn", value);
		},
		setLoggedOut: ({
			commit
		}) => {
			commit("setLoggedOut");
		},
		setError: ({
			commit
		}) => {
			commit("setError");
		}
	},
	modules: {}
});