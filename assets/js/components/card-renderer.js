/**
 * 卡片渲染组件
 * 负责软件卡片的渲染和交互
 */
import { CONFIG } from '../utils/config.js';

export class CardRenderer {
    constructor(languageManager) {
        this.languageManager = languageManager;
        this.cardContainer = null;
    }

    init() {
        this.cardContainer = document.getElementById('card-container');
    }

    // 渲染卡片
    renderCards(category) {
        if (!this.cardContainer) return;

        // 清空容器
        this.cardContainer.innerHTML = '';

        // 验证密钥是否有效
        const isKeyValid = (key) => {
            if (!key) return false;
            const trimmed = key.trim();
            if (trimmed === '') return false;
            if (trimmed.toLowerCase() === 'none') return false;
            if (trimmed.includes('无需密钥') || trimmed.includes('No key required')) return false;
            return true;
        };

        // 获取对应分类的软件数据
        const softwareList = CONFIG.software[category];

        // 为每个软件创建卡片
        if (softwareList && softwareList.length > 0) {
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
            const currentLanguage = this.languageManager.getCurrentLanguage();
            const textConfig = CONFIG.text[currentLanguage] || CONFIG.text.zh;
            card.innerHTML = `
                <div class="card-top-section">
                    <div class="version-selector">
                        <div class="version-display">${defaultVersion}</div>
                        <div class="version-options">
                            ${versionOptions}
                        </div>
                    </div>
                </div>
                <div class="card-body-section">
                    <div class="card-icon-wrapper">
                        <img src="${software.icon}" alt="${software.name}" class="card-icon" draggable="false">
                    </div>
                    <div class="card-info">
                        <div class="card-title" title="${software.name}">${software.name}</div>
                        <div class="key-display">
                            ${!isValid
                            ? `<div class="no-key">${textConfig.noKey}</div>`
                            : `${'*'.repeat(35)}<br>${'*'.repeat(35)}<br>${'*'.repeat(35)}`}
                            ${isValid ? `<div class="copy-key">${textConfig.copyKey}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;

            // 添加到容器
            this.cardContainer.appendChild(card);

            // 添加版本选择器事件
            const versionDisplay = card.querySelector('.version-display');
            const versionOptionsContainer = card.querySelector('.version-options');
            const keyDisplay = card.querySelector('.key-display');
            let realKey = currentKey;

            // 创建新的复制处理器
            const createCopyHandler = (key, lang) => {
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
            };

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
                    const textConfig = CONFIG.text[currentLanguage] || CONFIG.text.zh;
                    keyDisplay.innerHTML = `
                        ${!isValid
                            ? `<div class="no-key">${textConfig.noKey}</div>`
                            : `${'*'.repeat(35)}<br>${'*'.repeat(35)}<br>${'*'.repeat(35)}`}
                        ${isValid ? `<div class="copy-key">${textConfig.copyKey}</div>` : ''}
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
    }
}