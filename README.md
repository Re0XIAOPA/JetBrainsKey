# JetBraKey

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/jetbrakey?style=for-the-badge)](https://github.com/Re0XIAOPA/jetbrakey)    [![Open Issues](https://img.shields.io/github/issues/yourusername/jetbrakey?style=for-the-badge)](https://github.com/Re0XIAOPA/jetbrakey/issues)

## 快速开始

### 克隆仓库

```bash
git clone https://github.com/Re0XIAOPA/jetbrakey.git
```

## 配置指南

### 核心配置文件

`assets/js/utils/config.js`

```javascript
const CONFIG = {
    // 语言设置
    settings: {
        ...languageConfig,
    },

    // 文本配置
    text: {
        zh: {
            disclaimer: '免责声明...',
            categories: { ... },
            downloadInfo: { ... },
            copyKey: '复制密钥',
            copySuccess: '复制成功！'
        },
        en: {
            disclaimer: 'Disclaimer...',
            categories: { ... },
            downloadInfo: { ... },
            copyKey: 'Copy License',
            copySuccess: 'Copied!'
        }
    },

    // 软件配置
    software: {
        // 分类1
        ...test1Config,

        // 分类2
        ...test2Config,

        //分类3
        ...test3Config,
    },
};
```

## 模块示例

### 模块示例配置

`assets/js/utils/config/jetbrainsConfig.js`

```javascript
{
  name: 'test1',
  icon: 'assets/image/test1-icon.png',
  versions: ['2024.1'],
  keys: {
    '2024.1': 'ZZZZ-ZZZZ-ZZZZ-ZZZZ'
  }
}
```

多版本配置

```javascript
{
  name: 'test1',
  icon: 'assets/image/test1-icon.png',
  versions: ['1.0', '2.0'],
  keys: {
    '1.0': 'AAAA-AAAA-AAAA-AAAA',
    '2.0': 'BBBB-BBBB-BBBB-BBBB'
  }
}
```

## 贡献流程

| 贡献仓库  
| 请提交一个 [Pulls](https://github.com/Re0XIAOPA/ToolStore/pulls)  
| 或者克隆仓库完成之后同步分支  
| 资源收集于互联网，更多点击查看：  
[https://3.jetbra.in/](https://3.jetbra.in/)  
[https://ckey.run/](https://ckey.run/)  
[https://jb.1157pt.top/](https://jb.1157pt.top/)  


## 项目结构

```markdown
jetbrakey/
├── assets/
│   ├── css/                        # 样式文件夹
│   │   ├── components/             # 组件样式
│   │   ├── all.min.css            # 合并压缩样式
│   │   ├── responsive.css         # 响应式样式
│   │   └── styles.css             # 主样式文件
│   │
│   ├── images/                     # 图片资源
│   │   └── icons/                 # 图标资源
│   │
│   ├── js/                         # JavaScript文件
│   │   ├── components/             # 组件文件
│   │   │   ├── app.js             # 主应用组件
│   │   │   ├── card-renderer.js   # 卡片渲染组件
│   │   │   ├── category-switcher.js # 分类切换组件
│   │   │   ├── language-manager.js # 语言管理组件
│   │   │   ├── theme-manager.js   # 主题管理组件
│   │   │   └── theme-preloader.js # 主题预加载组件
│   │   │
│   │   ├── utils/                  # 工具函数
│   │   │   ├── config/            # 配置文件夹
│   │   │   │   ├── language.js    # 语言配置
│   │   │   │   ├── jetbrains2099Config.js # 2099激活配置
│   │   │   │   ├── jetbrainsConfig.js # Jetbrains配置
│   │   │   │   └── plugins.js     # 插件配置
│   │   │   └── config.js          # 主配置文件
│   │   │
│   │   └── main.js                # 主入口文件
│   │
│   └── webfonts/                   # 字体文件
│
├── jetbraZip/                      # 压缩包文件夹
│   └── files/                      # 文件存储
│
├── .gitignore                      # Git忽略文件
├── index.html                      # 主入口HTML
└── README.md                       # 项目文档
```
