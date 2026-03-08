/**
 * 主脚本文件
 * 处理页面交互和动态内容生成
 */
import { CONFIG } from './config.js';
document.addEventListener('DOMContentLoaded', function () {
    // 初始化状态
    let currentCategory = 'jetbra';
    let currentLanguage = CONFIG.settings.defaultLanguage;
    // 根据系统主题或本地存储的设置初始化主题状态
    let isDarkTheme = document.documentElement.classList.contains('dark-theme');

    // 获取DOM元素
    const themeToggle = document.getElementById('theme-toggle');
    const languageToggle = document.getElementById('language-toggle');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const cardContainer = document.getElementById('card-container');
    const downloadInfo = document.querySelector('.download-info');

    // 检测系统主题偏好并应用
    function detectAndApplySystemTheme() {
        // 检查本地存储中的主题设置
        const savedTheme = localStorage.getItem('theme');

        // 如果有保存的主题设置，使用保存的设置
        if (savedTheme) {
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark-theme');
                isDarkTheme = true;

                // 更新主题切换按钮图标
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.documentElement.classList.remove('dark-theme');
                isDarkTheme = false;

                // 更新主题切换按钮图标
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        } else {
            // 否则，根据系统主题偏好设置
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark-theme');
                isDarkTheme = true;

                // 更新主题切换按钮图标
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.documentElement.classList.remove('dark-theme');
                isDarkTheme = false;

                // 更新主题切换按钮图标
                const themeIcon = themeToggle.querySelector('i');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }

    // 监听系统主题变化
    function listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // 添加变化监听器
            mediaQuery.addEventListener('change', (e) => {
                if (e.matches) {
                    // 切换到深色模式
                    document.documentElement.classList.add('dark-theme');
                    isDarkTheme = true;

                    // 更新主题切换按钮图标
                    const themeIcon = themeToggle.querySelector('i');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    // 切换到浅色模式
                    document.documentElement.classList.remove('dark-theme');
                    isDarkTheme = false;

                    // 更新主题切换按钮图标
                    const themeIcon = themeToggle.querySelector('i');
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            });
        }
    }

    // 应用系统主题设置
    detectAndApplySystemTheme();
    listenForSystemThemeChanges();

    // 初始化页面
    updateLanguageText();
    renderCards(currentCategory);
    updateDownloadInfo(currentCategory);

    // 主题切换（添加防抖）
    let themeDebounce = false;
    themeToggle.addEventListener('click', function () {
        if (themeDebounce) return;
        themeDebounce = true;

        // 移除系统主题监听
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', detectAndApplySystemTheme);
        }

        // 切换主题
        isDarkTheme = !isDarkTheme;
        document.documentElement.classList.toggle('dark-theme');

        // 同步保存到本地存储
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');

        // 强制更新图标状态
        const themeIcon = this.querySelector('i');
        themeIcon.classList.remove(isDarkTheme ? 'fa-moon' : 'fa-sun');
        themeIcon.classList.add(isDarkTheme ? 'fa-sun' : 'fa-moon');

        // 更新导航栏过渡属性
        const navbar = document.querySelector('.navbar');
        navbar.style.transition = 'background-color 0.3s, box-shadow 0.3s';

        setTimeout(() => {
            themeDebounce = false;
        }, 300);
    });

    // 语言切换
    languageToggle.addEventListener('click', function () {
        currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        updateLanguageText();
        renderCards(currentCategory);
    });

    // 分类切换
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.dataset.category;

            // 更新活动按钮
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 更新当前分类并重新渲染卡片
            currentCategory = category;
            renderCards(category);

            // 更新下载提示栏内容
            updateDownloadInfo(category);
        });
    });

    /**
     * 渲染卡片
     * @param {string} category - 要渲染的分类
     */
    function renderCards(category) {
        // 清空容器
        cardContainer.innerHTML = '';

        // 验证密钥是否有效
        function isKeyValid(key) {
            if (!key) return false;
            const trimmed = key.trim();
            if (trimmed === '') return false;
            if (trimmed.toLowerCase() === 'none') return false;
            if (trimmed.includes('无需密钥') || trimmed.includes('No key required')) return false;
            return true;
        }

        // 获取对应分类的软件数据
        const softwareList = CONFIG.software[category];

        // 为每个软件创建卡片
        softwareList.forEach(software => {
            // 创建卡片元素
            const card = document.createElement('div');
            card.className = 'card';

            // 获取默认版本（第一个版本）
            const defaultVersion = software.versions[0];
            let currentKey = software.keys[defaultVersion] || '';

            // 创建版本选择器选项
            const versionOptions = software.versions.map(version =>
                `<div class="version-option" data-version="${version}">${version}</div>`
            ).join('');

            // 设置卡片HTML
            const isValid = isKeyValid(currentKey);
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-icon-container">
                        <img src="${software.icon}" alt="${software.name}" class="card-icon" draggable="false">
                        <div class="card-title" title="${software.name}">${software.name}</div>
                    </div>
                    <div class="version-selector">
                        <div class="version-display">${defaultVersion}</div>
                        <div class="version-options">
                            ${versionOptions}
                        </div>
                    </div>
                </div>
                <div class="key-display">
                    ${!isValid
                    ? `<div class="no-key">${CONFIG.text[currentLanguage].noKey}</div>`
                    : `${'*'.repeat(32)}<br>${'*'.repeat(32)}<br>${'*'.repeat(32)}`}
                    ${isValid ? `<div class="copy-key">${CONFIG.text[currentLanguage].copyKey}</div>` : ''}
                </div>
            `;

            // 添加到容器
            cardContainer.appendChild(card);

            // 添加版本选择器事件
            const versionDisplay = card.querySelector('.version-display');
            const versionOptionsContainer = card.querySelector('.version-options');
            const keyDisplay = card.querySelector('.key-display');
            let realKey = currentKey;

            // 创建新的复制处理器
            function createCopyHandler(key, lang) {
                return function () {
                    if (!isKeyValid(key)) {
                        return;
                    }
                    const copyKeyElement = this.querySelector('.copy-key');
                    if (!copyKeyElement) return;

                    navigator.clipboard.writeText(key).then(() => {
                        copyKeyElement.textContent = CONFIG.text[lang].copySuccess;
                        setTimeout(() => {
                            copyKeyElement.textContent = CONFIG.text[lang].copyKey;
                        }, 2000);
                    });
                };
            }

            // 初始化绑定事件
            if (isKeyValid(realKey)) {
                keyDisplay.onclick = createCopyHandler(realKey, currentLanguage);
            }

            // 反调试检测
            const antiDebug = setInterval(() => {
                if (typeof console.profiles !== 'undefined' || typeof console._commandLineAPI !== 'undefined') {
                    document.body.innerHTML = '<h1 style="color:red">禁止使用开发者工具！</h1>';
                    clearInterval(antiDebug);
                }
            }, 500);

            // 显示/隐藏版本选项
            versionDisplay.addEventListener('click', function (e) {
                e.stopPropagation();
                versionOptionsContainer.style.display = versionOptionsContainer.style.display === 'block' ? 'none' : 'block';
            });

            // 点击其他地方关闭版本选项
            document.addEventListener('click', function () {
                versionOptionsContainer.style.display = 'none';
            });

            // 版本选择
            card.querySelectorAll('.version-option').forEach(option => {
                option.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const selectedVersion = this.dataset.version;
                    realKey = software.keys[selectedVersion] || '';

                    // 更新显示 - 只显示版本号
                    versionDisplay.textContent = selectedVersion;
                    versionDisplay.title = selectedVersion;

                    const isValid = isKeyValid(realKey);
                    // 更新密钥显示
                    keyDisplay.innerHTML = `
                        ${!isValid
                            ? `<div class="no-key">${CONFIG.text[currentLanguage].noKey}</div>`
                            : `${'*'.repeat(32)}<br>${'*'.repeat(32)}<br>${'*'.repeat(32)}`}
                        ${isValid ? `<div class="copy-key">${CONFIG.text[currentLanguage].copyKey}</div>` : ''}
                    `;

                    // 重新绑定点击事件
                    // 重新绑定点击事件时传递当前语言状态
                    if (isValid) {
                        keyDisplay.onclick = createCopyHandler(realKey, currentLanguage);
                    } else {
                        keyDisplay.onclick = null;
                    }
                    versionOptionsContainer.style.display = 'none';
                });
            });

            // 添加标题属性，鼠标悬停时显示完整版本号
            versionDisplay.title = versionDisplay.textContent;
        });
    }

    /**
     * 更新下载提示栏内容
     * @param {string} category - 当前分类
     */
    function updateDownloadInfo(category) {
        // 只更新底部提示栏，不更新导航栏提示
        const downloadBannerElement = document.getElementById('download-banner').querySelector('.download-text');

        // 获取当前分类的下载提示
        const infoText = CONFIG.text[currentLanguage].downloadInfo[category] ||
            CONFIG.text[currentLanguage].downloadInfo.jetbra; // 默认使用jetbra的提示

        // 更新底部提示栏内容
        downloadBannerElement.innerHTML = infoText;
    }

    /**
     * 更新语言文本
     */
    function updateLanguageText() {
        // 更新免责声明
        document.getElementById('footer').querySelector('.disclaimer').textContent = CONFIG.text[currentLanguage].disclaimer;

        // 更新分类标签文本
        categoryButtons.forEach(button => {
            const category = button.dataset.category;
            button.textContent = CONFIG.text[currentLanguage].categories[category];
        });

        // 更新当前分类的下载提示
        updateDownloadInfo(currentCategory);

        // 更新卡片内容
        renderCards(currentCategory);
    }
});