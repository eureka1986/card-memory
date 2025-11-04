# Repository Guidelines

## 项目结构与模块组织
Vite + React + TypeScript 代码集中在 `src/`：`pages/` 存放路由级页面，`layouts/` 提供共享布局，`routes/router.tsx` 负责路由表。通用工具放入 `lib/`，领域模型在 `models/`，Zustand 状态在 `store/`，Dexie 相关适配器在 `storage/`，全局样式位于 `styles/`，静态资源位于 `public/`。新增功能请在独立子目录开发，只有当组件被多处复用时才移动到 `src/lib`（或未来的 `src/components`），避免复杂的相对路径。

## 构建、测试与开发命令
使用 `npm install` 安装依赖。`npm run dev` 运行带热更新的 Vite 开发服务器，`npm run build` 先执行 `tsc` 类型检查再产出生产包，`npm run preview` 本地预览 `dist/`，`npm run lint` 用 ESLint 校验 `src/**/*.ts(x)`。在推送前至少执行 build 和 lint，提前发现 TypeScript 或 Tailwind 回归。

## 代码风格与命名约定
保持 `src/main.tsx` 中的双空格缩进与单引号习惯。组件、Hooks、Store 使用帕斯卡命名（如 `MemoryGrid.tsx`、`useDeckStore.ts`），工具函数使用驼峰。Tailwind 类名优先内联并配合 `clsx`，`styles/` 仅容纳共享 token 与重置样式。`.eslintrc.cjs` 配置了 `@typescript-eslint` 与 React Hooks 规则，是唯一风格来源；尽量通过自动修复解决告警，谨慎添加禁用注释。

## 测试指引
当前尚未接入自动化测试；为较复杂的状态或存储逻辑引入 Vitest + React Testing Library 并将用例与源码同目录保存为 `<name>.test.tsx`，覆盖渲染、Store 迁移与 Dexie 边界。尚未落地前，需进行手动回归：运行 `npm run dev`，逐一检查 `router.tsx` 中定义的路由，并在 IndexedDB 空数据与预置数据场景下验证流程，最后把复现步骤写进 PR。

## 提交与 PR 规范
仓库暂无历史记录，建议采用 Conventional Commits（如 `feat: spaced-repetition deck view`）保持日志可搜索。单次提交聚焦一个主题，并在描述里点明主要影响区域（`pages`、`store`、`storage` 等）。PR 须包含精炼摘要、UI 变更截图、测试结论（自动或手动）、关联 issue/卡片，以及涉及数据结构或状态迁移时的额外说明，必要时提前 @ 相关负责人。

## 架构与状态提示
短生命周期的 UI 状态仅存于组件内部；跨组件共享状态通过 `src/store` 下的 Zustand Store，跨会话数据通过 `src/storage` 中的 Dexie 帮助方法持久化，并保持二者数据结构一致以便 selector 推断。新增表或迁移时需同步更新 Dexie schema、相关 hooks 与初始化逻辑，并在 PR 中解释旧用户的升级路径。
