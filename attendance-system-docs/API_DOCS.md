# API 接口文档

## 概述
本系统通过 Supabase 提供数据存储和认证服务，前端通过 Supabase 客户端库与后端交互。

## 认证接口
- `supabase.auth.signInWithPassword(email, password)` - 用户登录
- `supabase.auth.signUp()` - 用户注册
- `supabase.auth.getUser()` - 获取当前用户信息

## 员工端接口

### 打卡签到
```ts
// 创建或更新打卡记录
await supabase.from('attendance_records').insert({
  user_id: userId,
  date: currentDate,
  clock_in: currentTime,
  status: 'normal'
})

// 更新下班打卡
await supabase.from('attendance_records').update({
  clock_out: currentTime,
  work_hours: calculatedHours
}).eq('id', recordId)
```

### 请假申请
```ts
// 提交请假申请
await supabase.from('leave_requests').insert({
  user_id: userId,
  leave_type: type,
  start_date: startDate,
  end_date: endDate,
  days: dayCount,
  reason: reasonText,
  status: 'pending'
})
```

### 加班申请
```ts
// 提交加班申请
await supabase.from('overtime_requests').insert({
  user_id: userId,
  date: date,
  start_time: startTime,
  end_time: endTime,
  hours: hourCount,
  reason: reasonText,
  status: 'pending'
})
```

## 人事端接口

### 审批管理
```ts
// 审批请假申请
await supabase.from('leave_requests').update({
  status: 'approved', // 或 'rejected'
  reviewed_by: reviewerId,
  reviewed_at: now,
  review_remark: remark
}).eq('id', requestId)

// 审批加班申请（同上）
await supabase.from('overtime_requests').update({...})
```

### 考勤修正
```ts
// 补录或修正考勤记录
await supabase.from('attendance_corrections').insert({
  record_id: recordId,
  user_id: targetUserId,
  date: targetDate,
  original_status: oldStatus,
  corrected_status: newStatus,
  correction_type: 'clock_in' | 'clock_out' | 'status' | 'add_record',
  reason: correctionReason,
  corrected_by: correctorId
})
```

## 管理员端接口

### 用户角色管理
```ts
// 修改用户角色
await supabase.from('profiles').update({
  role: newRole // 'employee' | 'hr' | 'admin'
}).eq('id', userId)
```

### 班次配置
```ts
// 更新班次设置
await supabase.from('shift_config').update({
  name: shiftName,
  clock_in_time: inTime,
  clock_out_time: outTime,
  late_threshold_minutes: lateThreshold,
  early_threshold_minutes: earlyThreshold
}).eq('id', configId)
```

## 数据查询接口

### 获取月度统计
```ts
// 查询某月的考勤记录
const { data } = await supabase
  .from('attendance_records')
  .select('*')
  .eq('user_id', userId)
  .gte('date', monthStart)
  .lte('date', monthEnd)
```

### 获取待审批事项
```ts
// 获取所有待审批请假
const { count } = await supabase
  .from('leave_requests')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending')
```

## 工具函数

### 时间格式化
```ts
function formatDate(date: string | Date): string
function formatTime(date: string | Date): string
function formatDateTime(date: string | Date): string
```

### 状态转换
```ts
function getStatusLabel(status: string): string
function getLeaveTypeLabel(type: string): string
function getRoleLabel(role: string): string
```

### 日期工具
```ts
function getCurrentDate(): string
function getCurrentMonth(): string
```
