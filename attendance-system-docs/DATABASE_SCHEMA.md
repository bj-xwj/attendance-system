# 数据库 Schema 说明

## 概述
系统使用 PostgreSQL 数据库，通过 Supabase 提供数据存储服务。所有表都启用了 Row Level Security (RLS) 策略，确保数据安全。

## 表结构详情

### 1. profiles - 用户资料表
**用途**: 扩展 Supabase 的 auth.users，存储用户详细信息

**字段**:
- `id` (UUID): 主键，关联 auth.users
- `employee_no` (VARCHAR): 员工工号（唯一）
- `name` (VARCHAR): 姓名
- `email` (VARCHAR): 邮箱
- `role` (VARCHAR): 角色（'employee', 'hr', 'admin'）
- `department` (VARCHAR): 部门
- `phone` (VARCHAR): 手机号
- `avatar_url` (TEXT): 头像链接
- `created_at`, `updated_at`: 时间戳

**约束**: 
- role 必须是 employee/hr/admin 之一
- employee_no 唯一

### 2. attendance_records - 考勤记录表
**用途**: 存储员工每日打卡记录

**字段**:
- `id` (UUID): 主键
- `user_id` (UUID): 关联 profiles.id
- `date` (DATE): 考勤日期
- `clock_in` (TIMESTAMPTZ): 上班打卡时间
- `clock_out` (TIMESTAMPTZ): 下班打卡时间
- `status` (VARCHAR): 状态（'normal', 'late', 'early', 'absent', 'overtime', 'leave'）
- `work_hours` (DECIMAL): 工作小时数
- `remark` (TEXT): 备注
- `created_at`, `updated_at`: 时间戳

**约束**: 
- user_id + date 组合唯一
- status 必须在指定范围内

### 3. leave_requests - 请假申请表
**用途**: 存储员工请假申请

**字段**:
- `id` (UUID): 主键
- `user_id` (UUID): 申请人 ID
- `leave_type` (VARCHAR): 请假类型（'personal', 'sick', 'annual', 'marriage', 'maternity', 'other'）
- `start_date`, `end_date` (DATE): 请假起止日期
- `days` (DECIMAL): 请假天数
- `reason` (TEXT): 请假原因
- `status` (VARCHAR): 状态（'pending', 'approved', 'rejected'）
- `reviewed_by` (UUID): 审批人 ID
- `reviewed_at` (TIMESTAMPTZ): 审批时间
- `review_remark` (TEXT): 审批意见
- `created_at`, `updated_at`: 时间戳

### 4. overtime_requests - 加班申请表
**用途**: 存储员工加班申请

**字段**:
- `id` (UUID): 主键
- `user_id` (UUID): 申请人 ID
- `date` (DATE): 加班日期
- `start_time`, `end_time` (TIME): 加班起止时间
- `hours` (DECIMAL): 加班小时数
- `reason` (TEXT): 加班原因
- `status` (VARCHAR): 状态（'pending', 'approved', 'rejected'）
- `reviewed_by` (UUID): 审批人 ID
- `reviewed_at` (TIMESTAMPTZ): 审批时间
- `review_remark` (TEXT): 审批意见
- `created_at`, `updated_at`: 时间戳

### 5. attendance_corrections - 考勤修正记录表
**用途**: 记录考勤数据的修改历史

**字段**:
- `id` (UUID): 主键
- `record_id` (UUID): 关联的考勤记录 ID
- `user_id` (UUID): 相关用户 ID
- `date` (DATE): 修正的考勤日期
- `original_status` (VARCHAR): 原始状态
- `corrected_status` (VARCHAR): 修正后状态
- `correction_type` (VARCHAR): 修正类型（'clock_in', 'clock_out', 'status', 'add_record'）
- `reason` (TEXT): 修正原因
- `corrected_by` (UUID): 修正操作人
- `created_at` (TIMESTAMPTZ): 修正时间

### 6. shift_config - 班次配置表
**用途**: 存储系统的班次设置

**字段**:
- `id` (UUID): 主键
- `name` (VARCHAR): 班次名称
- `clock_in_time`, `clock_out_time` (TIME): 上下班时间
- `late_threshold_minutes` (INT): 迟到阈值（分钟）
- `early_threshold_minutes` (INT): 早退阈值（分钟）
- `is_active` (BOOLEAN): 是否激活
- `created_at` (TIMESTAMPTZ): 创建时间

**默认值**: 插入一条标准班次配置（9:00-18:00，迟到/早退阈值15分钟）

## RLS (Row Level Security) 策略

### profiles 表
- **读取**: 员工可读自己的资料；HR/Admin 可读全部
- **更新**: 员工可更新自己的资料；HR/Admin 可更新全部

### attendance_records 表
- **读取**: 员工可读自己的记录；HR/Admin 可读全部
- **更新**: 员工可更新自己的记录；HR/Admin 可更新全部

### leave_requests & overtime_requests 表
- **读取**: 员工可读自己的申请；HR/Admin 可读全部
- **更新**: 员工可更新自己的申请；HR/Admin 可更新全部

### attendance_corrections 表
- **读取**: 员工可读自己的修正；HR/Admin 可读全部
- **插入/更新**: 仅 HR/Admin 可操作

### shift_config 表
- **读取**: 所有人可读
- **更新**: 仅 Admin 可更新

## 触发器

### 自动创建 profile
当 auth.users 中有新用户注册时，自动在 profiles 表中创建对应的个人资料记录。

### 自动判定考勤状态
一个函数 `evaluate_attendance_status(user_id, date)` 用于根据打卡时间、班次配置和请假情况，自动判断并更新考勤状态。

## 索引
为提高查询性能，在以下字段上创建了索引：
- `attendance_records` (user_id, date)
- `attendance_records` (date)
- `leave_requests` (user_id, status)
- `overtime_requests` (user_id, status)
- `attendance_corrections` (user_id)
