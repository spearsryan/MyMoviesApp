import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import auth from '@/app/auth';
import * as UserStore from '@/store/user';
import UserInfoApi from '@/app/user-info-api';

Vue.use(VueRouter);

function requireAuth(to: any, from: any, next: any) {
	if (!auth.auth.isUserSignedIn()) {
		next({
			path: '/login',
			query: {
				redirect: to.FullPath
			}
		});
	} else {
		UserInfoApi.getUserInfo().then((response: any) => {
			console.log('response: ', response);
			UserStore.useActions(['identity']).identity(response);
			next();
		});
	}
}

const BasicRoutes: Array<RouteConfig> = [
  {
    path: '/',
		name: "Home",
		component: () => import( /* webpackChunkName: "home" */
			'@/views/Home.vue'),
		beforeEnter: requireAuth
  }, {
    path: '/AddMovie',
		name: "AddMovie",
		component: () => import( /* webpackChunkName: "addmovie" */
			'@/views/AddMovie.vue'),
		beforeEnter: requireAuth
  }, {
		path: '/Error',
		name: 'Error',
		component: () => import( /* webpackChunkName: "error" */
			'@/views/Error.vue'),
		props: true
	}, {
		path: '/login',
		beforeEnter() {
			console.log('did this work?');
			auth.auth.getSession();
		}
	}, {
		path: '/login/oauth2/code/cognito',
		beforeEnter(to, from, next) {
			const currUrl = window.location.href;
			console.log(currUrl);
			auth.auth.parseCognitoWebResponse(currUrl);
			next();
		}
	}, {
		path: '/logout',
		component: () => import( /* webpackChunkName: "logout" */
			'@/views/Logout.vue'),
		beforeEnter(to, from, next) {
			auth.logout();
			next();
		}
	// }, {
	// 	path: '/NotAuthorized',
	// 	name: 'NotAuthorized',
	// 	component: () => import( /* webpackChunkName: "notauthorized" */
	// 		'@/views/NotAuthorized.vue'),
	// 	props: true
	}, {
		path: '*',
		name: 'PageNotFound',
		component: () => import( /* webpackChunkName: "pagenotfound" */
			'@/views/PageNotFound.vue'),
		props: true
	}
];

const routes = [
	...BasicRoutes
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
