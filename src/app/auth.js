import {
	CognitoAuth,
	StorageHelper
} from "amazon-cognito-auth-js";
import IndexRouter from "../router/index";
import UserInfoStore from "@/store/index";
import UserInfoApi from "./user-info-api";

const CLIENT_ID = process.env.VUE_APP_COGNITO_CLIENT_ID;
const APP_DOMAIN = "my-movies-app.auth.us-east-2.amazoncognito.com";
const REDIRECT_URI = process.env.VUE_APP_COGNITO_REDIRECT_URI;
const USERPOOL_ID = process.env.VUE_APP_COGNITO_USERPOOL_ID;
const REDIRECT_URI_SIGNOUT = process.env.VUE_APP_COGNITO_REDIRECT_URI_SIGNOUT;
const APP_URL = process.env.VUE_APP_APP_URL;

var authData = {
	ClientId: CLIENT_ID,
	AppWebDomain: APP_DOMAIN,
	TokenScopesArray: ["openid", "email"],
	RedirectUriSignIn: REDIRECT_URI,
	RedirectUriSignOut: REDIRECT_URI_SIGNOUT,
	UserPoolId: USERPOOL_ID
};

var auth = new CognitoAuth(authData);

auth.userhandler = {
	onSuccess: function (result) {
		console.log("On Success result", result);
		UserInfoStore.dispatch("setLoggedIn", true);
		UserInfoApi.getUserInfo().then(response => {
			IndexRouter.push("/");
		});
	},
	onFailure: function (err) {
		UserInfoStore.dispatch("setLoggedOut");
		IndexRouter.go({
			path: "/error",
			query: {
				message: "Login failed due to " + err
			}
		});
	}
};

function getUserInfoStorageKey() {
	var keyPrefix = "CognitoIdentityServiceProvider." + auth.getClientId();
	var tokenUserName = auth.signInUserSession.getAccessToken().getUsername();
	var userInfoKey = keyPrefix + "." + tokenUserName + ".userInfo";
	return userInfoKey;
}

var storageHelper = new StorageHelper();
var storage = storageHelper.getStorage();
export default {
	auth: auth,
	login() {
		auth.getSession();
	},
	logout() {
		if (auth.isUserSignedIn()) {
			var userInfoKey = this.getUserInfoStorageKey();
			auth.signOut();

			storage.removeItem(userInfoKey);
		}
	},
	getUserInfoStorageKey
};