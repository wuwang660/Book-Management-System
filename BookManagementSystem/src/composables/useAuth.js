import axios from "axios";
import { computed, reactive } from "vue";

const STORAGE_KEY = "book_manager_auth";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// 默认状态
const defaultState = {
    isLoggedIn: false,
    role: "user",
    username: "",
};

// 读取本地存储（用于记住登录状态）
const getStoredAuth = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);

            return {
                isLoggedIn: parsed.isLoggedIn || false,
                role: parsed.role || "user",
                username: parsed.username || "",
            };
        } catch {
            return { ...defaultState };
        }
    }
    return { ...defaultState };
};

// 全局响应式状态
const authState = reactive(getStoredAuth());

// 保存到本地
const saveAuth = () => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            isLoggedIn: authState.isLoggedIn,
            role: authState.role,
            username: authState.username,
        }),
    );
};

export function useAuth() {
    // 登录，发送请求到 Mock 后端
    const login = async (username, password) => {
        try {
            // 查询匹配用户名和密码的用户
            const res = await api.get("/users", {
                params: {
                    username: username.trim(),
                    password: password.trim(),
                },
            });

            // 如果后端返回了匹配的用户
            if (res.data && res.data.length > 0) {
                const user = res.data[0];
                authState.isLoggedIn = true;
                authState.role = user.role;
                authState.username = user.username;
                saveAuth();
                return {
                    success: true,
                    username: user.username,
                    role: user.role,
                };
            } else {
                // 没找到匹配的用户（账号或密码错误）
                return { success: false, message: "账号或密码错误，请检查" };
            }
        } catch (err) {
            return {
                success: false,
                message: "网络请求失败，请确认 Mock 服务已启动",
            };
        }
    };

    // 登出
    const logout = () => {
        authState.isLoggedIn = false;
        authState.role = "user";
        authState.username = "";
        saveAuth();
    };

    // 是否管理员
    const isAdmin = computed(
        () => authState.isLoggedIn && authState.role === "admin",
    );

    // 是否普通用户
    const isUser = computed(
        () => authState.isLoggedIn && authState.role === "user",
    );

    // 是否已登录
    const isLoggedIn = computed(() => authState.isLoggedIn);

    // 当前角色名
    const currentRole = computed(() => {
        const map = { admin: "管理员", user: "普通用户", guest: "未登录" };
        return map[authState.role] || "未登录";
    });

    // 当前用户名
    const currentUsername = computed(() => authState.username);

    return {
        authState,
        login,
        logout,
        isAdmin,
        isUser,
        isLoggedIn,
        currentRole,
        currentUsername,
    };
}

export { authState };