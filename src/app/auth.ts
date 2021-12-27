import {
	CognitoAuth,
	StorageHelper
} from "amazon-cognito-auth-js";
import IndexRouter from "@/router/index";
//import * as UserInfoStore from "@/store/user/index";
import UserInfoApi from "./user-info-api";

const CLIENT_ID = process.env.VUE_APP_COGNITO_CLIENT_ID;
const APP_DOMAIN = process.env.VUE_APP_COGNITO_APP_DOMAIN;
const REDIRECT_URI = process.env.VUE_APP_COGNITO_REDIRECT_URI;
const USERPOOL_ID = process.env.VUE_APP_COGNITO_USERPOOL_ID;
const REDIRECT_URI_SIGNOUT = process.env.VUE_APP_COGNITO_REDIRECT_URI_SIGNOUT;

const authData = {
	ClientId: CLIENT_ID,
	AppWebDomain: APP_DOMAIN,
	TokenScopesArray: ["openid", "email"],
	RedirectUriSignIn: REDIRECT_URI,
	RedirectUriSignOut: REDIRECT_URI_SIGNOUT,
	UserPoolId: USERPOOL_ID
};

const auth = new CognitoAuth(authData);

auth.userhandler = {
	onSuccess: function (result: any) {
		console.log("On Success result", result);
		UserInfoApi.getUserInfo().then((response: any) => {
			console.log(response);
			IndexRouter.push("/");
		});
	},
	onFailure: function (err: any) {
		IndexRouter.replace({
			path: "/error",
			query: {
				message: "Login failed due to " + err
			}
		});
	}
};

function getUserInfoStorageKey(): string {
	const keyPrefix = "CognitoIdentityServiceProvider." + auth.getClientId();
	const tokenUserName = auth.signInUserSession.getAccessToken().getUsername();
	const userInfoKey = keyPrefix + "." + tokenUserName + ".userInfo";
	return userInfoKey;
}

const storageHelper = new StorageHelper();
const storage = storageHelper.getStorage();
export default {
	auth: auth,
	login(): void {
		auth.getSession();
	},
	logout(): void {
		if (auth.isUserSignedIn()) {
			const userInfoKey = this.getUserInfoStorageKey();
			auth.signOut();

			storage.removeItem(userInfoKey);
		}
	},
	getUserInfoStorageKey
};