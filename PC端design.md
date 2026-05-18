# 销售智能体-设计规范

> 设计稿版本: 2026-05-14
> 规范维护: 联想中国区领域智能体设计团队

---

## 目录

1. [颜色规范](#1-颜色规范)
2. [字体规范](#2-字体规范)
3. [阴影规范](#3-阴影规范)
4. [布局规范](#4-布局规范)
5. [组件规范](#5-组件规范)
6. [图标规范](#6-图标规范)
7. [CSS变量参考](#7-css变量参考)

---

## 1. 颜色规范

### 1.1 品牌色 (Brand)

| 编号 | 色值 | 状态 |
|------|------|------|
| Brand1-1 | `#E8F3FF` | 浅色背景 |
| Brand1-2 | `#BEDAFF` | 文字禁用 |
| Brand1-3 | `#94BFFF` | 禁用 |
| Brand1-4 | `#6AA1FF` | 特殊场景 |
| Brand1-5 | `#4080FF` | 悬浮 |
| Brand1-6 | `#2563EB` | 常规 |
| Brand1-7 | `#0E42D2` | 点击 |

### 1.2 功能色 (Functional)

#### Warning 警告色

| 编号 | 色值 | 状态 |
|------|------|------|
| Warning-6 | `#FF7D00` | 常规 |
| Warning-5 | `#FF9A2E` | 悬浮 |
| Warning-7 | `#D25F00` | 点击 |
| Warning-3 | `#FFCF8B` | 禁用 |

#### Success 成功色

| 编号 | 色值 | 状态 |
|------|------|------|
| Success-6 | `#00B42A` | 常规 |
| Success-5 | `#23C343` | 悬浮 |
| Success-7 | `#009A29` | 点击 |
| Success-3 | `#7BE188` | 禁用 |

#### Danger 错误色

| 编号 | 色值 | 状态 |
|------|------|------|
| Danger-6 | `#F53F3F` | 常规 |
| Danger-5 | `#F76560` | 悬浮 |
| Danger-7 | `#CB2634` | 点击 |
| Danger-3 | `#FBACA3` | 禁用 |

### 1.3 其他系统色

| 色系 | 常规 | 悬浮 | 点击 | 禁用 | 浅色背景 | 特殊场景 |
|------|------|------|------|------|----------|----------|
| **Orange Red 晚秋红** | #F77234 | #F99057 | #CC5120 | #FCC59F | #FFF3E8 | #FDDDC3 |
| **Gold** | #F7BA1E | #F9CC45 | #CC9213 | #FCE996 | #FFFCE8 | #FDF4BF |
| **Blue** | #3491FA | #57A9FB | #206CCF | #9FD4FD | #E8F7FF | #C3E7FE |
| **Purple** | #722ED1 | #8D4EDA | #551DB0 | #C396ED | #F5E8FF | #DDBEF6 |
| **Cyan 碧涛青** | #00B2E6 | #26C4E8 | #0086BF | #7DD4F2 | #E6F7FD | #B8E5F8 |

### 1.4 中性色

#### 文字色 (Text)

| 编号 | 色值 | 用途 |
|------|------|------|
| color-text-1 | `#0F172A` | 强调/正文标题 |
| color-text-2 | `#626C7B` | 次强调 |
| color-text-3 | `#9CA3AF` | 次要信息 |
| color-text-4 | `#C9CDD4` | 置灰信息 |

#### 边框色 (Border)

| 编号 | 色值 | 用途 |
|------|------|------|
| color-border-4 | `#86909C` | 重/按钮描边 |
| color-border-3 | `#C9CDD4` | 深/悬浮 |
| color-border-2 | `#E5E6EB` | 一般 |
| color-border-1 | `#F2F3F5` | 浅 |

#### 填充色 (Fill)

| 编号 | 色值 | 用途 |
|------|------|------|
| color-fill-5 | `#5E6673` | 强调/图标 |
| color-fill-3 | `#E5E6EB` | 深/灰底悬浮 |
| color-fill-2 | `#F2F3F5` | 一般/白底悬浮 |
| color-fill-1 | `#F7F8FA` | 浅/禁用 |

---

## 2. 字体规范

### 2.1 字体家族

- **中文字体**: Lenovo China
- **英文字体**: Lenovo PRC Experience Design Center
- **备用字体**: system-ui, -apple-system, sans-serif

### 2.2 字号规范

| 字号 | 用途 |
|------|------|
| 56px | 运营标题-大 |
| 48px | 运营标题-中 |
| 36px | 标题-大 |
| 24px | 标题-中 |
| 20px | 标题-小 |
| 16px | 正文-大 |
| 14px | 正文-常规 |
| 12px | 最小文本 |

### 2.3 行高规范

| 场景 | 行高 |
|------|------|
| 标题 (36px以上) | 1.2 |
| 正文 (14-24px) | 1.5 |
| 辅助文字 (12px) | 1.6 |
| 按钮文字 | 1.0 |

---

## 3. 阴影规范

### 3.1 投影 (Drop Shadow)

| 编号 | 参数 | 效果 |
|------|------|------|
| shadow-菜单 | `x:0, y:8, blur:20, #000000, 10%` | 下拉菜单阴影 |
| shadow-卡片 | `x:0, y:4, blur:10, #000000, 10%` | 卡片阴影 |
| shadow-BackTop | `x:0, y:4, blur:10, #000000, 10%` | 返回顶部阴影 |

### 3.2 方向阴影 (Directional Shadow)

| 编号 | 参数 |
|------|------|
| shadow1-left | `x:-2, y:0, blur:5, #000000, 10%` |
| shadow1-right | `x:2, y:0, blur:5, #000000, 10%` |
| shadow1-down | `x:0, y:2, blur:5, #000000, 10%` |
| shadow1-left-up | `x:-2, y:-2, blur:5, #000000, 10%` |
| shadow1-right-up | `x:2, y:-2, blur:5, #000000, 10%` |

---

## 4. 布局规范

### 4.1 页面尺寸

| 参数 | 值 |
|------|------|
| 设计宽度 | 1440px |
| 侧边栏宽度 | 240px |
| 顶栏高度 | 56px |
| 安全边距 | 24px |

### 4.2 间距规范

| 名称 | 值 | 用途 |
|------|------|------|
| xs | 4px | 紧凑间距 |
| sm | 8px | 小间距 |
| md | 16px | 标准间距 |
| lg | 24px | 大间距 |
| xl | 32px | 区块间距 |
| xxl | 48px | 页面间距 |

### 4.3 圆角规范

| 组件 | 圆角值 |
|------|--------|
| 按钮/标签 | 4px |
| 输入框/下拉框 | 6px |
| 卡片 | 8px |
| 弹窗 | 16px |

---

## 5. 组件规范

### 5.1 按钮

#### 按钮尺寸

| 尺寸 | 高度 | 字号 |
|------|------|------|
| 大 | 36px | 16px |
| 中 | 32px | 14px |
| 小 | 24px | 12px |

#### 按钮状态

| 状态 | 背景色 | 文字色 |
|------|--------|--------|
| 常规 | Brand1-6 `#2563EB` | #FFFFFF |
| 悬浮 | Brand1-5 `#4080FF` | #FFFFFF |
| 点击 | Brand1-7 `#0E42D2` | #FFFFFF |
| 禁用 | Brand1-3 `#94BFFF` | #FFFFFF |

### 5.2 输入框

| 参数 | 值 |
|------|------|
| 高度 | 40px |
| 圆角 | 6px |
| 边框色 | color-border-2 `#E5E6EB` |
| 聚焦边框 | Brand1-6 `#2563EB` |

### 5.3 卡片

| 参数 | 值 |
|------|------|
| 背景色 | #FFFFFF |
| 圆角 | 8px |
| 阴影 | shadow-卡片 |
| 内边距 | 16px / 24px |

---

## 6. 图标规范

> 图标总数: 196 个（从Figma设计稿导出）

### 6.1 图标分类

| 分类 | 数量 |
|------|------|
| ✏️ 编辑类 (edit) | 40 |
| ⚙️ 通用类 (general) | 80 |
| ➡️ 方向指示类 (direction) | 30 |
| 🖱️ 交互按钮类 (interactive-button) | 36 |
| 🎬 影音类 (media) | 10 |

### 6.2 ✏️ 编辑类图标 (Edit)

- `align-center`
- `align-left`
- `align-right`
- `bg-colors`
- `bold`
- `brush`
- `copy`
- `delete`
- `edit`
- `eraser`
- `filter`
- `find-replace`
- `font-colors`
- `formula`
- `h1`
- `h2`
- `h3`
- `h4`
- `h5`
- `h6`
- `h7`
- `highlight`
- `italic`
- `line-height`
- `oblique-line`
- `ordered-list`
- `original-size`
- `paste`
- `quote`
- `redo`
- `scissor`
- `sort`
- `sort-ascending`
- `sort-descending`
- `strikethrough`
- `underline`
- `undo`
- `unordered-list`
- `zoom-in`
- `zoom-out`


### 6.3 ⚙️ 通用类图标 (General)

- `Fire`
- `apps`
- `book`
- `branch`
- `bug`
- `bulb`
- `calendar`
- `camera`
- `cloud`
- `command`
- `common`
- `compass`
- `copyright`
- `dashboard`
- `desktop`
- `dice`
- `drag-dot`
- `drag-dot-vertical`
- `drive-file`
- `ear`
- `email`
- `empty`
- `experiment`
- `file`
- `file-audio`
- `file-image`
- `file-pdf`
- `file-video`
- `folder`
- `folder-add`
- `folder-delete`
- `gift`
- `idcard`
- `image`
- `image-close`
- `interaction`
- `layout`
- `loading`
- `location`
- `lock`
- `loop`
- `man`
- `menu`
- `mind-mapping`
- `mobile`
- `moon`
- `mosaic`
- `nav`
- `notification`
- `notification-close`
- `pen`
- `phone`
- `printer`
- `public`
- `pushpin`
- `qrcode`
- `robot`
- `robot-add`
- `safe`
- `schedule`
- `shake`
- `skin`
- `stamp`
- `storage`
- `subscribe`
- `subscribe-add`
- `subscribed`
- `sun`
- `tag`
- `tags`
- `thunderbolt`
- `tool`
- `trophy`
- `unlock`
- `user`
- `user-add`
- `user-group`
- `video-camera`
- `wifi`
- `woman`


### 6.4 ➡️ 方向指示类图标 (Direction)

- `arrow-fall`
- `arrow-rise`
- `caret-down`
- `caret-left`
- `caret-right`
- `caret-up`
- `double-down`
- `double-left`
- `double-right`
- `double-up`
- `down`
- `down-circle`
- `drag-arrow`
- `expand`
- `left`
- `left-circle`
- `menu-fold`
- `menu-unfold`
- `right`
- `right-circle`
- `rotate-left`
- `rotate-right`
- `shrink`
- `swap`
- `to-bottom`
- `to-left`
- `to-right`
- `to-top`
- `up`
- `up-circle`


### 6.5 🖱️ 交互按钮类图标 (Interactive Button)

- `Export`
- `at`
- `cloud-download`
- `code`
- `code-block`
- `code-square`
- `customer-service`
- `download`
- `eye`
- `eye-invisible`
- `heart`
- `home`
- `import`
- `list`
- `message`
- `message-banned`
- `more`
- `more-vertical`
- `poweroff`
- `refresh`
- `reply`
- `scan`
- `search`
- `select-all`
- `send`
- `settings`
- `share-alt`
- `share-external`
- `share-internal`
- `star`
- `sync`
- `thumb-down`
- `thumb-up`
- `translate`
- `upload`
- `voice`


### 6.6 🎬 影音类图标 (Media)

- `backward`
- `forward`
- `fullscreen`
- `fullscreen-exit`
- `live-broadcast`
- `music`
- `pause`
- `play-arrow`
- `skip-next`
- `skip-previous`


### 6.7 图标使用方式

```html
<img src="icons/{category}_{icon-name}.png" alt="icon-name">
```

示例：
```html
<img src="icons/edit_copy.png" alt="copy">
<img src="icons/direction_right.png" alt="right">
<img src="icons/general_user.png" alt="user">
```

---

## 7. CSS 变量参考

```css
:root {
  /* ==================== 品牌色 ==================== */
  --brand-6: #2563EB;      /* 主色调 */
  --brand-5: #4080FF;      /* 悬浮 */
  --brand-7: #0E42D2;      /* 点击 */
  --brand-4: #6AA1FF;      /* 特殊场景 */
  --brand-3: #94BFFF;      /* 禁用 */
  --brand-2: #BEDAFF;      /* 文字禁用 */
  --brand-1: #E8F3FF;      /* 浅色背景 */

  /* ==================== 功能色 ==================== */
  --warning-6: #FF7D00;
  --warning-5: #FF9A2E;
  --warning-7: #D25F00;
  --warning-3: #FFCF8B;

  --success-6: #00B42A;
  --success-5: #23C343;
  --success-7: #009A29;
  --success-3: #7BE188;

  --danger-6: #F53F3F;
  --danger-5: #F76560;
  --danger-7: #CB2634;
  --danger-3: #FBACA3;

  /* ==================== 中性色 ==================== */
  /* 文字色 */
  --text-1: #0F172A;
  --text-2: #626C7B;
  --text-3: #9CA3AF;
  --text-4: #C9CDD4;

  /* 边框色 */
  --border-4: #86909C;
  --border-3: #C9CDD4;
  --border-2: #E5E6EB;
  --border-1: #F2F3F5;

  /* 填充色 */
  --fill-5: #5E6673;
  --fill-3: #E5E6EB;
  --fill-2: #F2F3F5;
  --fill-1: #F7F8FA;

  /* ==================== 阴影 ==================== */
  --shadow-menu: 0 8px 20px rgba(0, 0, 0, 0.1);
  --shadow-card: 0 4px 10px rgba(0, 0, 0, 0.1);

  /* ==================== 间距 ==================== */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;

  /* ==================== 圆角 ==================== */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 16px;

  /* ==================== 字体 ==================== */
  --font-family-cn: 'Lenovo China', 'PingFang SC', system-ui, sans-serif;
  --font-family-en: 'Lenovo PRC Experience', 'Helvetica Neue', sans-serif;
}
```

---

## 附录

### A. 状态编号说明

| 编号 | 含义 |
|------|------|
| -6 | 常规状态 |
| -5 | 悬浮 (hover) |
| -7 | 点击 (active) |
| -3 | 禁用 (disabled) |
| -1 | 浅色背景 |
| -2 | 特殊场景 |

### B. 色彩对比度要求

- 正文与背景: ≥ 4.5:1
- 大文本与背景: ≥ 3:1

### C. 图标目录

图标文件位于 `icons/` 目录下，命名规则：`{category}_{icon-name}.png`

