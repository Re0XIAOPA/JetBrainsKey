/**
 * 搜索管理器
 * 实现精准搜索和模糊搜索功能
 */
import { CONFIG } from '../utils/config.js';

export class SearchManager {
    constructor(languageManager, cardRenderer) {
        this.languageManager = languageManager;
        this.cardRenderer = cardRenderer;
        this.searchInput = null;
        this.originalCards = [];
    }

    init() {
        this.searchInput = document.querySelector('.search-input');
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
                this.toggleSearchContainer(e.target.value);
            });
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
            
            // 添加搜索按钮点击事件
            const searchButton = document.querySelector('.search-button');
            if (searchButton) {
                searchButton.addEventListener('click', () => {
                    if (this.searchInput.value.trim()) {
                        this.handleSearch(this.searchInput.value);
                    } else {
                        this.searchInput.focus();
                    }
                });
            }
        }

        // 清空按钮事件
        const clearButton = document.querySelector('.clear-button');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.searchInput.value = '';
                this.handleSearch('');
                this.toggleSearchContainer('');
            });
        }
        
        // 分类切换时重新搜索
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.searchInput.value.trim()) {
                    this.handleSearch(this.searchInput.value);
                }
            });
        });
    }

    toggleSearchContainer(value) {
        const searchContainer = document.querySelector('.search-container');
        const clearButton = document.querySelector('.clear-button');
        if (searchContainer && clearButton) {
            if (value.trim()) {
                searchContainer.classList.add('has-content');
                clearButton.style.display = 'flex';
            } else {
                searchContainer.classList.remove('has-content');
                clearButton.style.display = 'none';
            }
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            // 如果搜索框为空，显示当前激活分类的卡片
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            this.cardRenderer.renderCards(activeCategory);
            return;
        }

        const searchResults = this.performSearch(query);
        this.displaySearchResults(searchResults);
    }

    performSearch(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        // 只在当前激活分类中搜索
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        const softwareList = CONFIG.software[activeCategory];
        if (softwareList) {
            softwareList.forEach(software => {
                const score = this.calculateSearchScore(software, lowerQuery);
                if (score > 0) {
                    results.push({ software, category: activeCategory, score });
                }
            });
        }

        // 按搜索得分排序
        return results.sort((a, b) => b.score - a.score);
    }

    calculateSearchScore(software, query) {
        let score = 0;
        const nameLower = software.name.toLowerCase();
        const descriptionLower = software.description ? software.description.toLowerCase() : '';

        // 精准匹配（完全匹配）
        if (nameLower === query) {
            score += 100;
        } 
        // 前缀匹配
        else if (nameLower.startsWith(query)) {
            score += 70;
        }
        // 模糊匹配（包含）
        else if (nameLower.includes(query)) {
            score += 50;
        } 
        // 描述中包含
        else if (descriptionLower.includes(query)) {
            score += 20;
        }

        // 部分匹配（概率搜索）
        const nameParts = nameLower.split(/\s+/);
        nameParts.forEach(part => {
            if (part.startsWith(query)) {
                score += 30;
            } else if (part.includes(query)) {
                score += 15;
            }
        });

        return score;
    }

    displaySearchResults(results) {
        const cardContainer = document.getElementById('card-container');
        if (!cardContainer) return;

        // 清空容器
        cardContainer.innerHTML = '';

        if (results.length === 0) {
            // 没有搜索结果
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            const currentLanguage = this.languageManager.getCurrentLanguage();
            const textConfig = CONFIG.text[currentLanguage] || CONFIG.text.zh;
            noResults.textContent = textConfig.noResults;
            cardContainer.appendChild(noResults);
            return;
        }

        // 渲染搜索结果
        results.forEach(result => {
            const software = result.software;
            this.renderSearchResultCard(software);
        });
    }

    renderSearchResultCard(software) {
        const cardContainer = document.getElementById('card-container');
        if (!cardContainer) return;

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

        // 验证密钥是否有效
        const isKeyValid = (key) => {
            if (!key) return false;
            const trimmed = key.trim();
            if (trimmed === '') return false;
            if (trimmed.toLowerCase() === 'none') return false;
            if (trimmed.includes('无需密钥') || trimmed.includes('No key required')) return false;
            return true;
        };

        const isValid = isKeyValid(currentKey);
        const currentLanguage = this.languageManager.getCurrentLanguage();
        const textConfig = CONFIG.text[currentLanguage] || CONFIG.text.zh;

        // 设置卡片HTML
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
        cardContainer.appendChild(card);

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
    }
}