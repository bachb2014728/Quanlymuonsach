import { createStore } from 'vuex'

export default createStore({
    state: {
        auth: false,
        message: '',
        role: '',
        books:[],
        cart: JSON.parse(localStorage.getItem('cart')) || [],
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
        },
        setBooks(state, books){
            state.books = books;
        },
        addToCart(state, book) {
            const exists = state.cart.some(item => item.id === book.id);
            if (!exists) {
                state.cart.push(book);
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },
        removeFromCart(state, bookId) {
            state.cart = state.cart.filter(book => book.id !== bookId);
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        updateCart(state, cart) {
            state.cart = cart;
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
        },
        setBooks({ commit }, books) {
            commit('setBooks', books);
        },
        addToCart({ commit }, book) {
            commit('addToCart', book);
        },
        removeFromCart({ commit }, bookId) {
            commit('removeFromCart', bookId);
        },
    },
    modules: {
    }
})
