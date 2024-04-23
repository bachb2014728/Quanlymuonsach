import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store/index.js";

const routes = [
    {path:"/",component: () => import('@/views/home-page.vue')},
    {path: "/books",component: () => import('@/views/books/book-list.vue')},

    {
        path: "/books/create", component: ()=> import('@/views/books/book-create.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: "/details", component: ()=> import('@/views/detail-page.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: "/profile", component: () => import('@/views/auth-page.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: "/publishing", component: ()=> import('@/views/publishing-page.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },

    {path: "/register", component: () => import('@/views/signup.vue')},
    {path: "/login",component: () => import('@/views/login.vue')},
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn()) {
            next({ path: '/login' });
        }else if (to.matched.some(record => record.meta.requiresAdmin)) { // check for requiresAdmin
            if (isAdmin()) {
                next();
            } else {
                next({ path: '/' });
            }
        }else {
            next();
        }
    } else {
        next();
    }
});

export default router;

function isLoggedIn() {
    return !!localStorage.getItem('token');
}
function isAdmin() {
    return store.state.role === 'ADMIN';
}