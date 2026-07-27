# 📚 图书管理系统 (Book Management System)

基于 **Vue 3 + Element Plus** 构建的单页应用，配合 `json-server` 模拟后端数据接口，实现了基于角色的图书管理功能。

> **适用场景**：Vue 3 组合式 API 练习、后台管理系统模板、前端鉴权与 CRUD 演示项目。

---

## ✨ 功能特性

- **用户登录/登出**：支持管理员和普通用户两种角色。
- **角色权限控制**：
    - **管理员**：可查看、新增、编辑、删除图书。
    - **普通用户**：仅可查看图书列表，操作栏显示“无权限”。
- **图书搜索**：支持按书名或作者关键字实时过滤。
- **数据持久化**：使用 `json-server` 模拟数据库，数据保存在 `db.json` 中，重启服务数据不丢失。
- **路由守卫**：未登录用户无法访问图书管理页，自动跳转至登录页。

---

## 🛠️ 技术栈

| 技术             | 说明                                    |
| :--------------- | :-------------------------------------- |
| **Vue 3**        | 组合式 API (`<script setup>`)           |
| **Vue Router**   | 路由管理与全局守卫                      |
| **Element Plus** | UI 组件库（表格、弹窗、表单、消息提示） |
| **Axios**        | HTTP 请求库，与 Mock 后端交互           |
| **json-server**  | 模拟 RESTful API 后端（零代码搭建）     |

---

## 📂 项目结构

```text
.
├── BookManagementSystem/            # 前端
│   ├── public/                     # 静态资源
│   ├── src/
│   │   ├──components/              # 视图组件
│   │   │   ├── Login.vue           # 登录页面
│   │   │   └── BookManager.vue     # 图书管理主页面
│   │   ├── composables/            # 组合式函数（逻辑复用）
│   │   │   ├── useAuth.js          # 登录/登出、角色状态管理
│   │   │   └── useBooks.js         # 图书增删改查与搜索逻辑
│   │   ├── router/
│   │   │   └── router.js           # 路由配置与全局守卫
│   │   ├── App.vue                 # 根组件
│   │   ├── main.js                 # 应用入口（挂载 Element Plus 和 Router）
│   │   ├── .env.development        # 开发环境
│   │   └── .env.production         # 生产环境
│   ├── package.json                # 项目依赖与脚本
│   ├── README.md                   # 项目说明文档（即本文件）
│   └── vite.config.js        # Vite 配置文件（含基础路径设置）
└── BookManagementSystemBackend/     # 后端
    ├── db.json                     # Mock 数据库（JSON Server 数据源）
    ├── server.js                   # JSON Server 启动文件
    └── package.json                # 项目依赖与脚本
```

---

## 🚀 快速开始

1. **环境准备**

    安装 **Node.js**（推荐 v16 及以上）

    包管理器：**npm** 或 **yarn**

2. **安装依赖**

    在 BookManagementSystem 和 BookManagementSystemBackend 目录下执行：

    ```bash
    npm install
    ```

3. **启动 Mock 后端服务（必须）**

    打开一个终端窗口，在 BookManagementSystemBackend 目录运行：

    ```bash
    npm start
    ```

    成功启动后，终端显示：

    ```bash
    JSON Server is running on port 3000
    ```

4. **启动前端开发服务器**

    另开一个终端窗口（保持后端服务运行），在 BookManagementSystemBackend 目录运行：

    ```bash
    npm run dev
    ```

    默认访问地址为：http://localhost:5173（具体端口以终端输出为准）。

5. **访问系统**

    打开浏览器访问 http://localhost:5173，页面会自动跳转至登录页。

---

## 👤 默认测试账号

| 角色         | 用户名 | 密码     | 权限                 |
| :----------  | :----- | :------- | :------------------- |
| **管理员**   | admin  | admin123 | 增删改查（全部权限） |
| **普通用户** | user   | user123  | 仅查看（无权限操作） |

```diff
注：如需添加新用户或修改密码，直接编辑 db.json 中的 users 数组即可，服务会自动热更新。
```

---

## 📡 模拟 API 说明

本项目使用 json-server 提供以下 RESTful 接口：

| 方法       | 路径       | 功能                         |
| :--------- | :--------- | :--------------------------- |
| **GET**    | /books     | 获取所有图书                 |
| **GET**    | /users     | 获取所有用户（用于登录校验） |
| **POST**   | /books     | 新增图书                     |
| **PUT**    | /books/:id | 更新指定图书                 |
| **DELETE** | /books/:id | 删除指定图书                 |

所有数据均存储在 db.json 中，重启服务后数据保留。

---

## ⚙️ 开发注意事项

### 关于密码安全

本项目为**演示用途**，密码以明文形式存储在 db.json 中，且登录请求通过 URL 参数传递。**请勿用于生产环境**。

如需生产级安全，建议：

- 使用 bcrypt 对密码进行哈希存储。
- 改用 POST 请求 + JWT Token 进行身份认证。

### 数据重置

如需重置图书数据，可直接修改 db.json 中的 books 数组，保存后无需重启服务，刷新页面即可生效。

---

## 📝 许可证

本项目仅供学习交流使用，遵循 MIT 许可证。
