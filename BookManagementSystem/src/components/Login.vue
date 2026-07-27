<script setup>
    import { reactive, ref } from "vue";
    import { useRouter } from "vue-router";
    import { useAuth } from "../composables/useAuth";
    import { ElMessage } from "element-plus";

    // 获取路由实例
    const router = useRouter();

    const form = reactive({
        username: "",
        password: "",
        role: "user",
    });

    const formRef = ref(null);

    const loading = ref(false);

    // 校验用户名
    const validateUsername = (rule, value, callback) => {
        if (!value) {
            callback(new Error("请输入用户名"));
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback(new Error("用户名只能包含字母、数字和下划线"));
        } else {
            callback();
        }
    };

    const rules = {
        username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
                min: 3,
                max: 12,
                message: "用户名长度需在 3 到 12 个字符之间",
                trigger: "blur",
            },
            { validator: validateUsername, trigger: "blur" },
        ],
        password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
                min: 6,
                max: 20,
                message: "密码长度需在 6 到 20 个字符之间",
                trigger: "blur",
            },
        ],
    };

    const { login } = useAuth();

    const handleLogin = async () => {
        formRef.value?.validate(async (valid) => {
            if (valid) {
                loading.value = true;
                // 等待登录请求返回结果
                const result = await login(form.username, form.password);
                loading.value = false;
                if (result.success) {
                    ElMessage.success(`欢迎回来，${result.username}！`);
                    // 跳转到图书管理页
                    router.push("/books");
                } else {
                    ElMessage.error(result.message || "登录失败");
                }
            } else {
                ElMessage.warning("请按照格式要求填写信息");
            }
        });
    };
</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <h2>图书管理系统</h2>

            <el-form :model="form" :rules="rules" ref="formRef">
                <el-form-item label="用户名：" prop="username">
                    <el-input
                        v-model="form.username"
                        placeholder="请输入用户名（字母/数字/下划线）"
                        prefix-icon="User"
                    />
                </el-form-item>
                <el-form-item
                    label="密&nbsp;码："
                    prop="password"
                >
                    <el-input
                        v-model="form.password"
                        type="password"
                        placeholder="请输入密码（至少6位）"
                        prefix-icon="Lock"
                        show-password
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        size="large"
                        @click="handleLogin"
                        style="width: 100%"
                        :loading="loading"
                    >
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
    /* 登录容器 */
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* 登录 */
    .login-card {
        background: white;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        width: 440px;
    }

    /* 标签 */
    .login-card h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
    }
</style>
