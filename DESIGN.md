---
version: alpha
name: Sales Agent iOS
description: An interpreted design system for the logged-in home screen of 销售通 on iOS — a compact mobile workbench that pairs a misty white canvas with a sharp blue AI accent, soft decorative gradients, rounded card geometry, and a bottom-tab-plus-composer workflow optimized for sales actions.

colors:
  primary: "#2563EB"
  primary-ai: "#2E62FF"
  on-primary: "#FFFFFF"
  ink: "#262626"
  ink-strong: "#333333"
  body: "#262626"
  body-mid: "#525252"
  mute: "#969696"
  mute-soft: "#A3A3A3"
  hairline: "#E5E6EB"
  canvas: "#FBFDFF"
  surface: "#FFFFFF"
  surface-soft: "#F9FAFB"
  danger: "#EC4848"
  decor-purple: "#F4F1FF"
  decor-blue: "#EDF4FF"
  decor-cyan: "#D7F3FF"
  decor-lavender: "#E6DFFF"
  decor-sky: "#E6F0FF"
  gradient-decor: "linear-gradient(135deg, #F4F1FF 0%, #EDF4FF 35%, #D7F3FF 100%)"

typography:
  display-lg:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 28px
    fontWeight: 700
    lineHeight: 36px
  display-md:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 18px
    fontWeight: 700
    lineHeight: 26px
  body-lg:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-lg-strong:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px
  body-md:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-md-strong:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  label:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  label-strong:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 18px
  button-pill:
    fontFamily: Source Han Sans CN, PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  system-sm:
    fontFamily: PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 22px
  xl: 24px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px

components:
  status-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.system-sm}"
    padding: "{spacing.sm} {spacing.lg}"
  nav-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg-strong}"
    padding: "{spacing.sm} {spacing.lg}"
  nav-tab-active:
    textColor: "{colors.primary}"
    underlineColor: "{colors.primary}"
    typography: "{typography.body-lg-strong}"
  nav-tab-inactive:
    textColor: "{colors.body-mid}"
    typography: "{typography.body-lg}"
  greeting-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.xl} {spacing.lg}"
  data-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  action-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.primary-ai}"
    typography: "{typography.button-pill}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md} {spacing.lg}"
  refresh-link:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    padding: "{spacing.sm} 0"
  bottom-tab-bar:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.body-mid}"
    typography: "{typography.label}"
    padding: "{spacing.sm} {spacing.lg}"
  bottom-tab-active:
    textColor: "{colors.primary}"
    typography: "{typography.label-strong}"
  text-input:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    placeholderColor: "{colors.mute-soft}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md} {spacing.lg}"
  voice-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  send-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  home-indicator:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "{spacing.xs} {spacing.xl}"

  # Examples (illustrative)
  ex-dashboard-stat-card:
    description: "Dual metric card shell used for modules like 待拜访客户 and 待处理标讯. Keeps a white base and lets iconography or badges carry the semantic color."
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  ex-quick-action-pill:
    description: "Rounded action button for pushes, AI analysis, or other lightweight shortcuts in the home feed."
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.primary-ai}"
    typography: "{typography.button-pill}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md} {spacing.lg}"
  ex-bottom-tab-item:
    description: "Bottom navigation item composed of an icon and a short label. Active state resolves to the primary blue."
    backgroundColor: "{colors.surface}"
    activeTextColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  ex-chat-composer:
    description: "Bottom input region with text field, voice entry, and send action."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.sm} {spacing.lg}"
  ex-greeting-band:
    description: "Greeting cluster containing the Hi~ message and a softer supporting subtitle."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: "{spacing.xl} {spacing.lg}"
  ex-module-card:
    description: "Secondary module surface for AI recommendations or lightweight summaries below the hero section."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  ex-input-toolbar:
    description: "Accessory row housing voice, search, or add controls near the composer."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  ex-empty-state-card:
    description: "Fallback card used when no tasks or no bids are available."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Transient system message for AI actions, send status, or warning notices."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.body-md}"
  ex-home-shell:
    description: "The overall 375 x 812 single-column shell composed of nav, greeting, cards, actions, tab bar, and composer."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.none}"
    padding: "0"

---


## Overview

销售通的这张“首页已登录”设计稿是一块 375 x 812 的 iOS 移动工作台。整体不是高对比的营销页面，而是一个需要持续操作的日常业务界面：顶部导航负责切换，问候区建立亲和感，双数据卡快速传达今日待办，胶囊按钮承接高频动作，底部 Tab Bar 和输入区则把浏览与发起操作收束到同一条流程里。

颜色策略以 `{colors.canvas}` 的轻雾白背景为底，主强调使用 `{colors.primary}` `#2563EB`，再用 `{colors.primary-ai}` `#2E62FF` 承接 AI 相关描边和次级强调。白色卡片与浅灰输入底让页面保持轻盈，装饰层则来自 `{colors.decor-purple}` / `{colors.decor-blue}` / `{colors.decor-cyan}` / `{colors.decor-lavender}` / `{colors.decor-sky}` 这一组淡彩渐变，营造温和科技感，而不是强烈品牌压迫感。

这份规范化稿沿用了 DESIGN.md 的 token 结构，并对原始 Figma 备注里两个未完全落定的点做了收敛：一是顶部导航“白底 + 未选中白字”的冲突被归一为白底 + 中性灰未选中文本；二是双数据卡的绿色系 / 黄色系被视为语义点缀，而不是替换白色卡片底面，从而保留页面的一致卡片系统。

**Key Characteristics:**
- 轻背景、强蓝色点睛：`{colors.canvas}` + `{colors.primary}` 构成主层级，适合运营型移动界面。
- 交互由“查看 + 触发”双链路构成：上半屏看状态，下半屏用 Tab 和输入栏发起动作。
- 所有高频操作都采用大圆角胶囊或圆形按钮，触感优先于几何锐度。
- 页面层次主要依靠白卡片、浅灰底、细分割线和轻阴影，不依赖大面积深色块。
- 视觉氛围由淡彩渐变装饰建立，科技感是柔和的，不是赛博或霓虹风格。

## Colors

### Brand & Accent
- **Primary Blue** (`{colors.primary}` — `#2563EB`): 页面主强调色，用于导航下划线、激活态、主要发送动作。
- **AI Blue** (`{colors.primary-ai}` — `#2E62FF`): AI 相关边框和次级强调色，常出现在功能按钮描边或智能模块里。
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): 主蓝底上的文字与图标。

### Surface
- **Canvas** (`{colors.canvas}` — `#FBFDFF`): 页面背景色，略带冷意的白。
- **Surface** (`{colors.surface}` — `#FFFFFF`): 卡片、导航栏、底部 Tab Bar 的主表面。
- **Surface Soft** (`{colors.surface-soft}` — `#F9FAFB`): 输入框与次级容器底色。
- **Hairline** (`{colors.hairline}` — `#E5E6EB`): 顶部分割线、Tab Bar 上边线、弱边框。

### Text
- **Ink** (`{colors.ink}` — `#262626`): 正文文字。
- **Ink Strong** (`{colors.ink-strong}` — `#333333`): 次级标题、深色图标。
- **Body Mid** (`{colors.body-mid}` — `#525252`): 未激活标签、中级信息。
- **Mute** (`{colors.mute}` — `#969696`): 分割或弱化文案。
- **Mute Soft** (`{colors.mute-soft}` — `#A3A3A3`): 占位文字、输入提示。

### Semantic
- **Danger** (`{colors.danger}` — `#EC4848`): 警告、重要提示、错误类反馈。

### Decorative
- **Decor Purple** (`{colors.decor-purple}` — `#F4F1FF`): 淡紫装饰底。
- **Decor Blue** (`{colors.decor-blue}` — `#EDF4FF`): 浅蓝装饰底。
- **Decor Cyan** (`{colors.decor-cyan}` — `#D7F3FF`): 浅青装饰底。
- **Decor Lavender** (`{colors.decor-lavender}` — `#E6DFFF`): 薰衣草色装饰底。
- **Decor Sky** (`{colors.decor-sky}` — `#E6F0FF`): 天蓝装饰底。
- **Decor Gradient** (`{colors.gradient-decor}`): 装饰渐变建议，用于背景光晕、顶部氛围层、AI 模块浅色涂层。

## Typography

### Font Family
中文正文以 **Source Han Sans CN** 为主，系统信息和 iOS 环境文字可回退到 **PingFang SC**。这套界面没有营销型夸张字重，真正承担层级的是 28 px / 18 px 的粗标题和 16 px / 14 px 的稳定正文层级。

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-lg}` | 28px | 700 | 36px | 问候语主标题。 |
| `{typography.display-md}` | 18px | 700 | 26px | 数据数字、大号模块标题。 |
| `{typography.body-lg}` | 16px | 400 | 24px | 正文、导航、输入内容。 |
| `{typography.body-lg-strong}` | 16px | 700 | 24px | 激活态导航标题。 |
| `{typography.body-md}` | 14px | 400 | 20px | 功能按钮、卡片标题、辅助正文。 |
| `{typography.body-md-strong}` | 14px | 500 | 20px | 底部激活标签、小强调文本。 |
| `{typography.label}` | 12px | 400 | 18px | 说明文字、次要信息。 |
| `{typography.label-strong}` | 12px | 500 | 18px | 激活态 Tab 标签。 |
| `{typography.button-pill}` | 14px | 400 | 20px | 胶囊按钮文案。 |
| `{typography.system-sm}` | 12px | 500 | 16px | 状态栏时间和系统信息。 |

### Principles
- **28 px 问候语是页面情绪起点。** 它比数据卡数字更像产品人格表达。
- **18 px / 700 是局部信息峰值。** 用在数据数字和核心模块标题，不再继续往上叠层级。
- **14 px 是动作密度核心。** 胶囊按钮、底部标签、卡片标题都在这一档完成。
- **字体体系尽量单一。** 业务移动端优先稳定、清晰、密度可控，而不是品牌字形个性。

### Note on Font Substitutes
如果运行环境里没有 Source Han Sans CN，优先回退到 PingFang SC；跨平台实现可以使用 Noto Sans SC 作为近似替代。

## Layout

### Spacing System
- **Base unit**: 4 px。
- **Tokens**: `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 24 px · `{spacing.2xl}` 32 px。
- **Card padding**: 关键卡片统一采用 `{spacing.lg}` 16 px 内边距。
- **Section rhythm**: 问候区和内容段落之间通常拉开 `{spacing.xl}` 24 px。

### Grid & Container
- 基准画板是 **375 x 812 px**，单列流式布局。
- 顶部是状态栏 + 导航栏，中段是问候区、双卡片、功能按钮列表，下段是底部 Tab 和输入区。
- 双数据卡在手机宽度里并排呈现，强调“同屏比较”，不建议在标准宽度下改成单卡堆叠。

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | 保持原始单列移动结构；双卡片可维持 2-up。 |
| Tablet | >= 768px | 页面居中为手机壳宽度，保留底部输入区和 Tab 结构，不扩展为桌面多列信息架构。 |

#### Touch Targets
功能按钮高度 44 px，输入框高度 48 px，满足 iOS 高密度操作下的基本触达要求。底部 Tab 图标和标签需要一起形成完整热区，而不是只让图标可点。

#### Collapsing Strategy
- 顶部导航保持紧凑，不引入桌面化横向信息带。
- 双数据卡是最重要的并列比较区，只有在极窄宽度下才允许转单列。
- 输入区始终贴底，不能在内容增长时被挤出首屏操作范围。

#### Image Behavior
- 设计稿主体依靠卡片、图标和浅色装饰，不依赖摄影素材。
- 装饰图形应保持模糊、浅色、渐变化，不抢占业务信息层级。

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 - Flat | No shadow, canvas only. | 页面背景与问候区。 |
| Level 1 - Hairline | 1 px solid `{colors.hairline}`. | 底部 Tab 顶部分割线、弱边框。 |
| Level 2 - Card Shadow | `0 6px 18px rgba(37,99,235,0.06), 0 2px 8px rgba(38,38,38,0.05)` | 数据卡、功能卡、次级模块。 |
| Level 3 - Floating Control | `0 10px 24px rgba(46,98,255,0.10), 0 4px 12px rgba(38,38,38,0.08)` | 输入区、圆形语音/发送按钮、浮起式 AI 控件。 |

### Decorative Depth
- 科技感主要来自浅紫到浅蓝的氛围渐变，而不是厚重阴影。
- 阴影应保持轻薄，避免把业务卡片做成拟物悬浮面板。

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | 页面整体画布。 |
| `{rounded.sm}` | 8px | 小型图标容器或轻量标签。 |
| `{rounded.md}` | 12px | 标准卡片。 |
| `{rounded.lg}` | 22px | 44 px 高胶囊按钮。 |
| `{rounded.xl}` | 24px | 48 px 输入框。 |
| `{rounded.full}` | 9999px | 圆形语音按钮、发送按钮、Home Indicator。 |

## Components

### Navigation

**`status-bar`** - iOS 顶部系统信息区。
- 背景 `{colors.surface}`，文字 `{colors.ink}`，使用 `{typography.system-sm}`。

**`nav-bar`** - 顶部主导航。
- 高度 44 px，背景 `{colors.surface}`，标题使用 `{typography.body-lg-strong}`。

**`nav-tab-active`** - 导航激活态。
- 文本 `{colors.primary}`，底部下划线同色。

**`nav-tab-inactive`** - 导航未激活态。
- 为保证白底可读性，归一为 `{colors.body-mid}`，而不是原始备注中的白字。

### Cards & Information Blocks

**`greeting-band`** - 问候区。
- 承载 “Hi~ 早上好！” 及副标题，背景 `{colors.canvas}`，标题使用 `{typography.display-lg}`。

**`data-card`** - 数据摘要卡片。
- 白色 `{colors.surface}` 卡面，圆角 `{rounded.md}`，内边距 `{spacing.lg}`，使用 Level 2 轻阴影。
- “待拜访客户” 与 “待处理标讯” 的绿色 / 黄色被视为图标或徽标语义色，而非替换整张卡片底色。

### Actions

**`action-pill`** - 功能胶囊按钮。
- 高度 44 px，描边 `{colors.primary-ai}`，圆角 `{rounded.lg}`，文案使用 `{typography.button-pill}`。

**`refresh-link`** - “换一批” 刷新动作。
- 使用 `{colors.primary}` 作为文本色，视觉权重低于主按钮但高于说明文字。

### Bottom Navigation & Input

**`bottom-tab-bar`** - 底部标签栏。
- 背景 `{colors.surface}`，顶部 1 px `{colors.hairline}` 分割线，图标与文字纵向组合。

**`bottom-tab-active`** - 底部激活项。
- 文本和图标统一使用 `{colors.primary}`，标签字重提升到 `{typography.label-strong}`。

**`text-input`** - 输入框。
- 高度 48 px，背景 `{colors.surface-soft}`，圆角 `{rounded.xl}`，占位文字 `{colors.mute-soft}`。

**`voice-button`** - 语音入口。
- 采用圆形按钮语义，配合输入框形成轻量工具组。

**`send-button`** - 发送按钮。
- 使用主蓝 `{colors.primary}` 实现最高动作优先级。

**`home-indicator`** - iPhone Home Indicator。
- 保持系统感，不做装饰性重绘。

### Signature Components

**`ex-dashboard-stat-card`** - 双指标卡模板。
- 适合待拜访客户、待处理标讯等任务摘要。

**`ex-quick-action-pill`** - AI 推送 / 需求分析等轻操作模板。
- 重点是“可快速连续点按”，不是强销售转化按钮。

**`ex-chat-composer`** - 输入区组合模板。
- 统一收纳文字输入、语音输入与发送动作。

## Do's and Don'ts

### Do
- 用 `{colors.primary}` 做激活态、下划线和高优先级操作。
- 保持 `{colors.surface}` 白卡 + `{colors.canvas}` 浅背景的主结构，不要把页面刷成大面积纯蓝。
- 用 `{rounded.md}` / `{rounded.lg}` / `{rounded.xl}` 建立统一的圆角层级。
- 让渐变装饰停留在背景和氛围层，不要压住业务内容。
- 把底部 Tab 和输入区视为整套交互闭环的一部分，保证贴底和连续性。

### Don't
- 不要把卡片阴影做得过重，避免金融广告页式的悬浮感。
- 不要把所有按钮都做成主蓝实底；大多数快捷动作应是白底描边胶囊。
- 不要把未激活标签继续做成白字；在白底界面里这会直接损坏可读性。
- 不要引入过多高饱和颜色；这套界面的气质依赖浅色、干净和温和科技感。
