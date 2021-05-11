import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home";
import Logout from '@/views/Logout';
import Error from '@/views/Error';
import auth from '@/app/auth';
import Store from '@/store/index';
import UserInfoApi from '@/app/user-info-api';

Vue.use(VueRouter);

function requireAuth(to, from, next) {
	debugger;
	if (!auth.auth.isUserSignedIn()) {
		Store.dispatch('setLoggedIn', false);
		next({
			path: '/login',
			query: {
				redirect: to.FullPath
			}
		});
	} else {
		UserInfoApi.getUserInfo().then(response => {
			Store.dispatch('setLoggedIn', true);
			Store.dispatch('setCognitoInfo', response);
			next();
		});
	}
}

const routes = [{
		path: "/",
		name: "home",
		component: Home,
		beforeEnter: requireAuth
	},
	{
		path: '/login',
		beforeEnter(to, from, next) {
			console.log('did this work?');
			auth.auth.getSession();
		}
	},
	{
		path: '/login/oauth2/code/cognito',
		beforeEnter(to, from, next) {
			var currUrl = window.location.href;
			console.log(currUrl);
			auth.auth.parseCognitoWebResponse(currUrl);
			next();
		}
	},
	{
		path: '/logout',
		component: Logout,
		beforeEnter(to, from, next) {
			auth.logout();
			next();
		}
	},
	{
		path: '/error',
		component: Error
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;