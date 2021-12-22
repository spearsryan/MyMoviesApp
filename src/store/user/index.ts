//This is the global access for the user store.
import store from '@/plugins/vuex';
import * as helpers from 'vuex-composition-helpers';
import { NAMESPACE, UserGetters, UserMutations, UserState, UserActions } from '@/store/user/state';

const { useState, useGetters, useMutations, useActions } = helpers.createNamespacedHelpers<UserState, UserGetters, UserActions, UserMutations>(store, NAMESPACE);
type StateUseFunction = typeof useState;
type GettersUseFunction = typeof useGetters;
type MutationsUseFunction = typeof useMutations;
type ActionsUseFunction = typeof useActions;

export { StateUseFunction, GettersUseFunction, MutationsUseFunction, ActionsUseFunction };
export { useState, useGetters, useMutations, useActions };
