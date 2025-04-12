# pet-automa

pet-automa 是一个基于 Puppeteer 和 Automa 的自动化项目，结合现代前端技术 Vue 3 和 Vite，用于实现浏览器自动化任务和便捷的前端开发。

## 功能特性

- **浏览器自动化**：基于 Puppeteer，实现对网页的自动化操作。
- **工作流自动化**：利用 Automa 构建和管理复杂的自动化流程。
- **现代前端技术**：
  - 使用 Vue 3 构建响应式用户界面。
  - 集成 Vite 提供快速开发和构建体验。

## 项目结构

```
pet-automa/
├── server.js           # 后端服务器逻辑，提供 API 接口
├── index.html          # 主页面模板，加载动态数据
├── frontend/           # 前端代码目录
│   ├── src/            # Vue 组件和逻辑
│   ├── index.html      # Vite 配置的入口页面
│   └── README.md       # 前端子目录的说明
└── README.md           # 项目总说明
```

## 安装与运行

### 前置条件

确保本地安装了以下工具：
- Node.js (推荐使用最新的 LTS 版本)
- npm 或 yarn

### 安装依赖

1. 克隆本项目到本地：
   ```bash
   git clone https://github.com/samonyu/pet-automa.git
   cd pet-automa
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

### 启动开发服务器

1. 启动后端服务：
   ```bash
   node server.js
   ```

2. 启动前端服务：
   ```bash
   cd frontend
   npm run dev
   ```

3. 打开浏览器访问：`http://localhost:3000`

## 接口说明

后端 `server.js` 提供以下主要 API 接口：

- **用户登录**：支持用户登录验证，使用会话管理用户状态。
- **视频管理**：
  - 获取视频列表：`GET /api/videos`
  - 添加视频：`POST /api/videos`
  - 修改视频：`PUT /api/videos/:id`
  - 删除视频：`DELETE /api/videos/:id`

## 技术栈

- **后端**：
  - [Express](https://expressjs.com/)：轻量级的 Node.js Web 应用框架。
  - [SQLite3](https://www.sqlite.org/)：嵌入式数据库，用于存储用户和视频数据。
  - [bcrypt](https://github.com/kelektiv/node.bcrypt.js/)：用于安全的密码加密。

- **前端**：
  - [Vue 3](https://vuejs.org/)：用于构建用户界面的渐进式框架。
  - [Vite](https://vitejs.dev/)：下一代前端构建工具。
  - [HTML & CSS](https://developer.mozilla.org/en-US/docs/Web)：用于页面布局和样式。

## 贡献指南

欢迎贡献代码或提出建议！请按照以下步骤进行：
1. Fork 本项目。
2. 创建新的分支：`git checkout -b feature-xxx`
3. 提交代码：`git commit -m "Add xxx feature"`
4. 推送分支：`git push origin feature-xxx`
5. 提交 Pull Request。

## 许可证

本项目采用 [MIT License](LICENSE) 进行授权。
