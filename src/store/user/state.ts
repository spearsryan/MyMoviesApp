import { UserClaims } from "@/types/UserClaims";
import { Module, ActionContext, Plugin } from 'vuex';
import { cloneDeep } from 'lodash';
import localforage from 'localforage';

export const NAMESPACE = 'user';

export type UserState = typeof initial;
const initial = {
	initialized: false,
	identity: undefined as unknown as UserClaims
};

const storage = localforage.createInstance({
	name: 'user-store',
	storeName: 'User Info Storage',
	description: 'Carries information about user around for hydration',
	version: 1 //can change this later if we change state
});

export const plugin: Plugin<MinimalRootState> = async (store) => {
	const modulename = new RegExp(`${NAMESPACE}\/`, 'i'); //eslint-disable-line

	store.subscribe(async (mutation, state: MinimalRootState) => {
		if (!modulename.test(mutation.type)) { return; }
		const type = mutation.type.replace(modulename, '');
		try {
			switch (type) {
				case 'IDENTITY': { await storage.setItem('identity', state.user.identity); } break;
			}
		}
		catch (error) {
			console.error('issue processing user plugin', error);
		}
	});

	//hydrate from storage
	const identity = await storage.getItem<UserClaims>('identity') || cloneDeep(initial.identity);

	//set state by using replaceState and merge
	store.commit(`${NAMESPACE}/HYDRATE`, { identity });
	store.commit(`${NAMESPACE}/INITIALIZED`);
};

export type UserActions = typeof actions;
type MinimalRootState = { [NAMESPACE]: UserState };
type UserActionContext = ActionContext<UserState, MinimalRootState>;

export const actions = {
	identity: async ({ commit, dispatch }: UserActionContext, identity: UserClaims) : Promise<void> => {
		commit('IDENTITY', identity);
		await dispatch('restrictions');
	}
};

export type UserGetters = typeof getters;
export const getters = {
	initialized: (state: UserState) : boolean => state.initialized,
	name: (state: UserState) : string => {
		return state.identity && state.identity.NAME ? state.identity.NAME : "";
	},
	email: (state: UserState) : string => {
		return state.identity && state.identity.EMAIL ? state.identity.EMAIL : "";
	}
};

export type UserMutations = typeof mutations;
export const mutations = {
	INITIALIZED: (state: UserState) : void => {
		state.initialized = true
	},
	IDENTITY: (state: UserState, identity: UserClaims) : void => {
		state.identity = identity
	},
	HYDRATE: (state: UserState, updated: UserState) : void => {
		mutations.IDENTITY(state, updated.identity);
		state.initialized = updated.initialized;
	}
};

export const module: Module<UserState, MinimalRootState> = {
	namespaced: true,
	state: cloneDeep(initial),
	getters,
	mutations,
	actions
};