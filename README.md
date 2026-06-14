# 员工考勤管理系统

中小型企业员工考勤管理系统 Web 应用，实现企业打卡、请假、加班、旷工的数字化、自动化考勤管理。

## 功能特性

### 员工端
- ✅ 上下班在线打卡（自动记录时间）
- ✅ 提交请假申请（事假/病假/年假/婚假/产假等）
- ✅ 提交加班申请
- ✅ 查看个人每日/月度考勤明细
- ✅ 考勤状态自动判定（正常/迟到/早退/旷工/加班/休假）

### 人事端
- ✅ 审核员工请假申请
- ✅ 审核员工加班申请
- ✅ 手动登记迟到、早退记录
- ✅ 异常考勤补录与修正
- ✅ 员工信息管理
- ✅ 可视化考勤报表

### 管理员端
- ✅ 全部人事功能
- ✅ 用户角色权限管理
- ✅ 系统班次配置
- ✅ 全局数据统计

### 三级权限
- **普通员工**：打卡、请假、加班、查看个人记录
- **人事**：审批、员工管理、考勤修正、报表
- **超级管理员**：全部权限 + 系统设置

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth + RLS)
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
cd attendance-system
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 前往 [Supabase](https://supabase.com) 创建项目
2. 在 SQL Editor 中执行 `supabase/schema.sql` 创建表和策略
3. 在项目设置中获取 API 凭证

### 4. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

填入你的 Supabase 凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 方式一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/attendance-system)

### 方式二：手动部署

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 点击 Deploy

## 项目结构

```
attendance-system/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # 仪表盘布局
│   │   │   ├── employee/         # 员工端页面
│   │   │   │   ├── page.tsx      # 工作台
│   │   │   │   ├── attendance/   # 打卡签到
│   │   │   │   ├── leave/        # 请假申请
│   │   │   │   ├── overtime/     # 加班申请
│   │   │   │   └── records/      # 考勤记录
│   │   │   ├── hr/               # 人事端页面
│   │   │   │   ├── page.tsx      # 工作台
│   │   │   │   ├── approvals/    # 审批管理
│   │   │   │   ├── employees/    # 员工管理
│   │   │   │   ├── corrections/  # 考勤修正
│   │   │   │   ├── records/      # 考勤记录
│   │   │   │   └── reports/      # 统计报表
│   │   │   └── admin/            # 管理员页面
│   │   │       ├── page.tsx      # 工作台
│   │   │       ├── users/        # 用户管理
│   │   │       └── settings/     # 系统设置
│   │   ├── login/                # 登录页
│   │   ├── register/             # 注册页
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── sidebar.tsx           # 侧边栏导航
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # 浏览器端 Supabase 客户端
│   │   │   ├── server.ts         # 服务端 Supabase 客户端
│   │   │   └── middleware.ts     # 认证中间件
│   │   └── utils.ts              # 工具函数
│   ├── types/
│   │   └── index.ts              # TypeScript 类型定义
│   └── middleware.ts             # Next.js 中间件
├── supabase/
│   └── schema.sql                # 数据库初始化脚本
├── .env.example                  # 环境变量示例
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 数据库说明

### 表结构

- **profiles** - 用户资料（关联 auth.users）
- **attendance_records** - 打卡记录
- **leave_requests** - 请假申请
- **overtime_requests** - 加班申请
- **attendance_corrections** - 考勤修正记录
- **shift_config** - 班次配置

### 安全策略 (RLS)

所有表都启用了 Row Level Security：
- 员工只能查看和修改自己的数据
- 人事和管理员可以查看和管理所有数据
- 自动创建用户 Profile 触发器

### 考勤状态自动判定

系统根据以下规则自动判定考勤状态：
- **正常**: 按时上下班打卡
- **迟到**: 超过上班时间 + 阈值（默认15分钟）
- **早退**: 早于下班时间 - 阈值（默认15分钟）
- **旷工**: 未打卡且无请假记录
- **休假**: 有已审批的请假记录
- **加班**: 有已审批的加班记录

## 默认账号

首次注册的用户默认为普通员工角色。如需设置管理员：

1. 注册账号后登录
2. 在 Supabase SQL Editor 中执行：

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 代码检查
```

## 注意事项

1. **Supabase 配置**: 确保在 Supabase 项目中执行了 `schema.sql`
2. **环境变量**: 部署时必须配置 Supabase URL 和 Anon Key
3. **权限管理**: 首个用户需手动在数据库中设置为 admin 角色
4. **时区**: 系统使用服务器时区，建议在 Supabase 中设置正确的时区

## License

MIT
