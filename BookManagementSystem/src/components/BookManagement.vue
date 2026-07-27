<script setup>
    import { ElMessage, ElMessageBox } from "element-plus";
    import { onMounted, ref } from "vue";
    import { useRouter } from "vue-router";
    import { useAuth } from "../composables/useAuth";
    import { useBooks } from "../composables/useBooks";

    const { isAdmin, currentUsername, logout } = useAuth();

    //   获取路由实例
    const router = useRouter();

    const {
        keyword,
        filteredBooks,
        dialogVisible,
        editItem,
        handleAdd,
        handleEdit,
        handleSave,
        handleDelete,
        closeDialog,
        fetchBooks,
        loading,
    } = useBooks();

    // 组件挂载后加载数据
    onMounted(() => {
        fetchBooks();
    });

    const formRef = ref(null);

    // 表单验证规则
    const rules = {
        name: [{ required: true, message: "请输入书名", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        category: [{ required: true, message: "请输入分类", trigger: "blur" }],
    };

    // 价格格式化
    const priceFormatter = (row) => {
        return row.price?.toFixed(2) || "0.00";
    };

    // 提交表单
    const submitLoading = ref(false);

    const submitForm = async () => {
        if (submitLoading.value) return;
        formRef.value?.validate(async (valid) => {
            if (valid) {
                submitLoading.value = true;
                // 等待 API 返回
                const success = await handleSave(editItem.value);

                submitLoading.value = false;
                if (!success) {
                    ElMessage.warning("保存未成功，请检查表单后重试");
                }
            }
        });
    };

    // 删除确认
    const deleteLoading = ref(false);
    // 当前正在删除的图书 ID，用于单独控制按钮
    const deleteTargetId = ref(null);

    const confirmDelete = async (id) => {
        try {
            await ElMessageBox.confirm("确定要删除该图书吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            });
            deleteTargetId.value = id;
            deleteLoading.value = true;
            await handleDelete(id);
            if (success) {
                ElMessage.success("删除成功");
            }
        } catch {
            // 用户取消删除，不做任何操作
        } finally {
            deleteLoading.value = false;
            deleteTargetId.value = null;
        }
    };

    // 退出登录
    // 防止重复点击
    const loggingOut = ref(false);

    const handleLogout = () => {
        if (loggingOut.value) return;
        loggingOut.value = true;
        // 清除本地状态
        logout();
        // 立即跳转
        router.push("/login");
        loggingOut.value = false;
    };
</script>

<template>
    <div class="book-manager">
        <!-- 顶栏：显示当前角色 + 退出登录按钮 -->
        <div class="header-bar">
            <div class="role-info">
                <span class="username-display">{{ currentUsername }}</span>
                <el-tag :type="isAdmin ? 'success' : 'info'" size="large">
                    {{ isAdmin ? "管理员" : "普通用户" }}
                </el-tag>
                <span class="hint" v-if="!isAdmin">（仅可查看图书）</span>
                <span class="hint" v-else>（拥有全部权限）</span>
            </div>
            <el-button
                type="danger"
                plain
                @click="handleLogout"
                :loading="loggingOut"
            >
                退出登录
            </el-button>
        </div>

        <!-- 工具栏：只有管理员能看到“新增”按钮 -->
        <div class="toolbar">
            <el-input
                v-model="keyword"
                placeholder="输入书名或作者搜索"
                clearable
                style="width: 250px; margin-right: 20px"
            />
            <el-button v-if="isAdmin" type="primary" @click="handleAdd">
                新增
            </el-button>
        </div>

        <!-- 表格：操作列只有管理员能看到 -->
        <el-table
            :data="filteredBooks"
            border
            stripe
            style="width: 100%"
            v-loading="loading"
        >
            <el-table-column prop="id" label="ID" width="80px" align="center" />
            <el-table-column
                prop="name"
                label="书名"
                min-width="180px"
                align="center"
            />
            <el-table-column
                prop="author"
                label="作者"
                width="150px"
                align="center"
            />
            <el-table-column
                prop="price"
                label="价格(元)"
                width="120px"
                align="center"
                :formatter="priceFormatter"
            />
            <el-table-column
                prop="category"
                label="分类"
                width="120px"
                align="center"
            />
            <el-table-column
                v-if="isAdmin"
                label="操作"
                width="180px"
                fixed="right"
                align="center"
            >
                <template #default="{ row }">
                    <el-button
                        size="small"
                        type="primary"
                        @click="handleEdit(row)"
                    >
                        编辑
                    </el-button>
                    <el-button
                        size="small"
                        type="danger"
                        @click="confirmDelete(row.id)"
                        :loading="deleteLoading && deleteTargetId === row.id"
                        :disabled="deleteLoading && deleteTargetId !== row.id"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
            <!-- 非管理员，显示“无权限” -->
            <el-table-column label="操作" width="120" fixed="right" v-else>
                <template #default>
                    <el-tag type="info" size="small">无权限</el-tag>
                </template>
            </el-table-column>

            <template #empty>
                <el-empty
                    :description="
                        isAdmin
                            ? '暂无图书数据，点击右上角「新增」添加吧！'
                            : '暂无图书数据'
                    "
                    :image-size="80"
                />
            </template>
        </el-table>

        <!-- 新增/编辑弹窗（管理员专用） -->
        <el-dialog
            v-model="dialogVisible"
            :title="editItem?.id ? '编辑图书' : '新增图书'"
            width="500px"
            @close="closeDialog"
        >
            <div v-if="!isAdmin">
                <el-alert
                    type="error"
                    title="权限不足，仅管理员可操作"
                    :closable="false"
                />
            </div>
            <template v-else>
                <el-form
                    v-if="editItem"
                    :model="editItem"
                    label-width="80px"
                    :rules="rules"
                    ref="formRef"
                >
                    <el-form-item label="书名" prop="name">
                        <el-input
                            v-model="editItem.name"
                            placeholder="请输入书名"
                        />
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input
                            v-model="editItem.author"
                            placeholder="请输入作者"
                        />
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input-number
                            v-model="editItem.price"
                            :precision="2"
                            :step="0.1"
                            :min="0"
                        />
                    </el-form-item>
                    <el-form-item label="分类" prop="category">
                        <el-input
                            v-model="editItem.category"
                            placeholder="请输入分类"
                        />
                    </el-form-item>
                </el-form>
            </template>

            <template #footer>
                <el-button @click="closeDialog">取消</el-button>
                <el-button
                    v-if="isAdmin"
                    type="primary"
                    @click="submitForm"
                    :loading="submitLoading"
                    :disabled="submitLoading"
                >
                    确定
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
    /* 顶栏样式 */
    .header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    /* 角色样式 */
    .role-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    /* 用户名显示 */
    .username-display {
        font-weight: 600;
        color: #333;
        background: #f0f2f5;
        padding: 2px 12px;
        border-radius: 12px;
        font-size: 14px;
    }

    /* 权限显示 */
    .hint {
        color: #888;
        font-size: 14px;
    }

    /* 工具栏样式 */
    .toolbar {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
    }
</style>
