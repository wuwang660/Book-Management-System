import { createRouter, createWebHashHistory } from "vue-router";
import BookManagement from "../components/BookManagement.vue";
import Login from "../components/Login.vue";
import { authState } from "../composables/useAuth.js";

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
        path: "/books",
        component: BookManagement,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
});

// 全局路由守卫（核心！拦截未登录访问）
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !authState.isLoggedIn) {
        next("/login");
    } else {
        next();
    }
});

export default router;
