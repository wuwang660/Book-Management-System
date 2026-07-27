import axios from "axios";
import { ElMessage } from "element-plus";
import { computed, ref } from "vue";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export function useBooks() {
    // 图书列表
    const books = ref([]);

    // 搜索关键字
    const keyword = ref("");

    // 当前编辑的图书
    const editItem = ref(null);

    // 弹窗显示控制
    const dialogVisible = ref(false);

    const loading = ref(false);

    // 获取数据（从 Mock 接口拉取）
    const fetchBooks = async () => {
        loading.value = true;
        try {
            const res = await api.get("/books");
            books.value = res.data;
        } catch (err) {
            ElMessage.error("加载图书列表失败，请检查 Mock 服务是否启动");
        } finally {
            loading.value = false;
        }
    };

    // 计算属性：过滤后的图书列表
    const filteredBooks = computed(() => {
        if (!keyword.value.trim()) return books.value;
        const kw = keyword.value.trim().toLowerCase();
        return books.value.filter(
            (b) =>
                b.name.toLowerCase().includes(kw) ||
                b.author.toLowerCase().includes(kw),
        );
    });

    // 新增
    const handleAdd = () => {
        dialogVisible.value = true;
        editItem.value = {
            name: "",
            author: "",
            price: 0,
            category: "",
        };
    };

    // 编辑
    const handleEdit = (book) => {
        dialogVisible.value = true;
        // 拷贝，避免直接修改原对象
        editItem.value = { ...book };
    };

    // 保存（新增或更新）
    const handleSave = async (formData) => {
        try {
            if (formData.id) {
                // 【更新】直接 PUT 现有 ID（保持数字）
                await api.put(`/books/${formData.id}`, formData);
            } else {
                await api.post("/books", formData);
            }

            // 保存后刷新列表
            await fetchBooks();
            dialogVisible.value = false;
            editItem.value = null;
            return true;
        } catch (err) {
            ElMessage.error("保存失败，请重试");
            return false;
        }
    };

    // 删除
    const handleDelete = async (id) => {
        try {
            await api.delete(`/books/${id}`);
            // 删除后刷新列表
            await fetchBooks();
            return true;
        } catch (err) {
            ElMessage.error("删除失败");
            return false;
        }
    };

    // 关闭弹窗
    const closeDialog = () => {
        dialogVisible.value = false;
        editItem.value = null;
    };

    return {
        books,
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
    };
}
