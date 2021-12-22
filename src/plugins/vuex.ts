import Vue from 'vue';
import Vuex, { StoreOptions, Store } from 'vuex';
import * as user from '@/store/user/state';

Vue.use(Vuex);

type RootState = typeof state;
const state = {};

//Load all of the plugins manually.
//The Promise will be used to prevent the page from loading before the state is hydrated
let resolved: any = null;
export const mutex = new Promise(resolve => { resolved = resolve; });
const allPlugins = async (store: Store<any>) => {
    await Promise.all([
        user.plugin(store),
    ]);
    resolved(true);
};

const config: StoreOptions<any> = {
	strict: false,
	state,
	getters: {
	},
	modules: {
		[user.NAMESPACE]: user.module
	},
    plugins: [ allPlugins ]
};

const store = new Store(config);

export default store;