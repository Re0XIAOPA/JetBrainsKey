# JetBraKey

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/jetbrakey?style=for-the-badge)](https://github.com/Re0XIAOPA/jetbrakey)    [![Open Issues](https://img.shields.io/github/issues/yourusername/jetbrakey?style=for-the-badge)](https://github.com/Re0XIAOPA/jetbrakey/issues)

## 快速开始

### 克隆仓库

```bash
git clone https://github.com/Re0XIAOPA/jetbrakey.git
```

## 配置指南

### 核心配置文件

`assets/js/config.js`

```javascript
const CONFIG = {
    // 语言设置
    settings: {
        ...languageConfig,
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

`assets/js/config/jetbraConfig.js`

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
│   ├── js/config/                  # 配置文件夹
│   │   ├── languageConfig.js       # 语言配置文件
│   │   ├── jetbra2099Config.js     # 2099激活配置文件
│   │   ├── jetbraConfig.js         # Jetbra配置文件
│   │   └── plugins.js              # 插件配置文件
│   │
│   └── image/              # 分类图标存储
├── index.html              # 主入口文件
└── README.md               # 项目文档
```
