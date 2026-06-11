# Design System — SRE Atlas

## Color Palette (OKLCH)

### 深色主题（默认）

```css
:root {
  /* 背景层 */
  --color-bg:       oklch(0.080 0.000 0);        /* 近黑，无色相 */
  --color-surface:  oklch(0.120 0.002 230);      /* 微冷灰，卡片/面板 */
  --color-surface-2: oklch(0.150 0.003 230);     /* 更亮的表面 */

  /* 文字层 */
  --color-ink:      oklch(0.920 0.005 230);      /* 主文字，微冷白 */
  --color-muted:    oklch(0.600 0.010 230);      /* 次要文字 */
  --color-dim:      oklch(0.450 0.015 230);      /* 更淡的辅助文字 */

  /* 品牌色 */
  --color-primary:  oklch(0.550 0.105 230.0);    /* 钴蓝 — 品牌锚点 */
  --color-accent:   oklch(0.650 0.150 175.0);    /* 青绿 — 补充强调 */

  /* 语义色 */
  --color-success:  oklch(0.700 0.180 145.0);    /* 成功绿 */
  --color-warning:  oklch(0.780 0.150 75.0);     /* 警告琥珀 */
  --color-error:    oklch(0.600 0.200 25.0);     /* 错误红 */
  --color-info:     oklch(0.650 0.120 250.0);    /* 信息蓝 */

  /* 代码 */
  --color-code-bg:  oklch(0.100 0.003 230);      /* 代码块背景 */
  --color-code-text: oklch(0.880 0.020 230);     /* 代码文字 */
}
```

### 浅色主题（备用）

```css
:root[data-theme="light"] {
  --color-bg:       oklch(1.000 0.000 0);        /* 纯白 */
  --color-surface:  oklch(0.975 0.002 230);      /* 微冷白 */
  --color-surface-2: oklch(0.950 0.003 230);
  --color-ink:      oklch(0.150 0.005 230);      /* 近黑 */
  --color-muted:    oklch(0.500 0.010 230);
  --color-dim:      oklch(0.650 0.010 230);
  --color-primary:  oklch(0.450 0.120 230.0);    /* 深钴蓝 */
  --color-accent:   oklch(0.500 0.150 175.0);
  --color-code-bg:  oklch(0.960 0.003 230);
  --color-code-text: oklch(0.180 0.005 230);
}
```

### 语义色使用规则

| 语义 | 用途 | 文字色 |
|------|------|--------|
| Success | 健康检查通过、部署成功、状态 healthy | 白色 |
| Warning | 降级状态、接近阈值、需要关注 | 黑色 |
| Error | 故障、OOMKilled、CrashLoopBackOff | 白色 |
| Info | 提示、最佳实践、参考链接 | 白色 |

**文字填充规则：** 语义色背景上用白色文字（Helmholtz-Kohlrausch 效应）。

## Typography

### 字体栈

```css
:root {
  /* 正文 */
  --font-sans: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;

  /* 代码 */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Noto Sans Mono CJK SC', monospace;

  /* 标题 */
  --font-display: 'Inter', 'Noto Sans SC', sans-serif;
}
```

### 字号系统

```css
:root {
  --text-xs:   clamp(0.75rem, 0.70rem + 0.25vw, 0.8125rem);   /* 12-13px */
  --text-sm:   clamp(0.8125rem, 0.77rem + 0.2vw, 0.875rem);    /* 13-14px */
  --text-base: clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem);   /* 14-15px */
  --text-lg:   clamp(1.0rem, 0.95rem + 0.25vw, 1.125rem);      /* 16-18px */
  --text-xl:   clamp(1.125rem, 1.05rem + 0.38vw, 1.3125rem);   /* 18-21px */
  --text-2xl:  clamp(1.3125rem, 1.15rem + 0.8vw, 1.75rem);     /* 21-28px */
  --text-3xl:  clamp(1.75rem, 1.4rem + 1.75vw, 2.5rem);        /* 28-40px */

  /* 行高 */
  --leading-tight: 1.3;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;

  /* 字重 */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

### 排版规则

- 正文：`--text-base`，行高 `--leading-normal`，最大宽度 65-75ch
- 标题：`text-wrap: balance`，字间距 ≥ -0.04em
- 代码：`--font-mono`，`--text-sm`，行高 `--leading-tight`
- 中文：使用 Noto Sans SC，英文术语保持原字体

## Spacing

```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */

  /* 内容区域 */
  --content-max-width: 75ch;
  --sidebar-width: 260px;
  --toc-width: 220px;
}
```

## Border Radius

```css
:root {
  --radius-sm:  4px;
  --radius-md:  6px;
  --radius-lg:  8px;
  --radius-xl:  12px;
  /* 不用 32px+ 的大圆角 */
}
```

## Motion

### 动效原则

- 滚动触发动画：内容渐入（transform + opacity）
- hover 反馈：背景色微变、阴影变化
- 页面切换：淡入，150ms
- 代码块：复制按钮 hover 反馈

### 动效参数

```css
:root {
  --duration-fast:   100ms;
  --duration-normal: 200ms;
  --duration-slow:   400ms;

  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);

  --motion-stagger:  50ms;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Components

### 代码块

- 背景：`--color-code-bg`
- 文字：`--color-code-text`
- 语法高亮：冷色调（蓝、青、绿、琥珀）
- 复制按钮：右上角，hover 显示
- 行号：`--color-dim`，可选

### 表格

- 表头：`--color-surface-2` 背景
- 行：交替背景色（微弱差异）
- 边框：`--color-surface-2`，1px

### 提示框（Admonition）

- Note：`--color-primary` 左边框 + 浅背景
- Warning：`--color-warning` 左边框 + 浅背景
- Error：`--color-error` 左边框 + 浅背景
- Tip：`--color-accent` 左边框 + 浅背景

### 导航

- 侧边栏：`--color-surface` 背景
- 当前页：`--color-primary` 高亮
- hover：`--color-surface-2`
- 层级缩进：`--space-4`

### 搜索

- 搜索框：`--color-surface` 背景，`--color-muted` placeholder
- 结果高亮：`--color-primary` 背景
- 快捷键提示：`--color-dim`

## Z-Index Scale

```css
:root {
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-toast:     500;
  --z-tooltip:   600;
}
```

## 品牌场景

**深夜 SRE 控制室：**
- 深色背景模拟终端环境
- 钴蓝强调色像屏幕微光
- 青绿色补充强调，像状态指示灯
- 语义色对应监控告警（红=故障、黄=警告、绿=正常）
- 代码字体为主，终端美学
- 信息密度高，不浪费空间
