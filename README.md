# Card Memory

[![CI](https://github.com/eureka1986/card-memory/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/eureka1986/card-memory/actions/workflows/ci.yml)

一个基于 React + Vite 的卡片记忆与复习管理应用，支持自定义卡片内容、分类标签及基于间隔重复（SRS）的复习计划。项目默认运行在浏览器端，通过 IndexedDB 保留用户数据，即使刷新也不会丢失。

## 功能亮点
- **卡片管理**：为每条知识卡片定义关键信息、例子、行动提示、触发器与反思记录。
- **分类与标签**：`categories` 与 `tags` 帮助快速筛选内容。
- **复习日志与计划**：结合 `reviewLogs` 与 `reviewSchedules` 记录复习质量与下一次复习时间。
- **离线持久化**：Dexie + IndexedDB 保存所有数据，无需后端即可长期使用。

## 技术栈
- React 18、TypeScript、Vite 5
- Zustand（带 devtools）管理运行态状态
- Dexie 4 实现 IndexedDB 访问
- TailwindCSS + PostCSS 负责样式，配合 Radix UI、Framer Motion 等组件/动画库
- ESLint + TypeScript 提供静态检查

## 快速开始
```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器（默认 http://localhost:5173）
npm run build        # 生成生产构建（含 TypeScript 检查）
npm run preview      # 预览 dist 产物
npm run lint         # 运行 ESLint
```

## 项目结构
```
src/
  layouts/        # 页面框架与共用布局
  pages/          # 视图页面
  routes/router.tsx  # react-router 配置
  lib/            # 复习调度、工具函数等通用逻辑
  models/         # Card / Review 等 TypeScript 类型
  storage/        # Dexie 数据库定义
  store/          # Zustand store（useCardsStore）
  styles/         # 全局与 Tailwind 入口
```

## 数据模型与存储
`src/storage/db.ts` 定义 `MemoryDeckDB`，包含 `cards`、`categories`、`tags`、`reviewLogs`、`reviewSchedules` 五张表。`useCardsStore` 在初始化时批量读取，并通过 Dexie 事务写入，确保：
- 卡片与复习计划的字段同步（`nextReviewAt` 等）
- 复习日志记录质量分 `ReviewQuality`
- 反思笔记、行动提示追加在卡片对象中

## 贡献指南
- 满足 `AGENTS.md` 中的《Repository Guidelines》，确保目录、命名与提交规范一致。
- 提交前运行 `npm run lint` 与 `npm run build`，必要时附上手动测试步骤或截图。

如需更多帮助或讨论，请打开 Issue/PR 并描述问题上下文与复现方式。
