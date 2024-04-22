import { createStore } from 'vuex'

export default createStore({
    state: {
        auth: false,
        message: '',
        role: ''
    },
    mutations: {
        setAuth(state, auth){
            state.auth = auth;
        },
        setMessage(state, value) {
            state.message = value;
        },
        setRole(state, role) {
            state.role = role;
        }
    },
    actions: {
        setAuth({ commit }, auth){
            commit('setAuth',auth);
        },
        setMessage({ commit }, value) {
            commit('setMessage', value);
        },
        setRole({ commit }, role) {
            commit('setRole', role);
        }
    },
    modules: {
    }
})
