/**
 * 语言管理组件
 * 处理语言切换和文本更新
 */
import { CONFIG } from '../utils/config.js';

export class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || CONFIG.settings.defaultLanguage;
        this.languageToggle = null;
        this.categorySwitcher = null;
    }

    init() {
        this.languageToggle = document.getElementById('language-toggle');
        this.bindEvents();
        this.updateLanguageToggleText();
    }

    // 设置分类切换器引用
    setCategorySwitcher(categorySwitcher) {
        this.categorySwitcher = categorySwitcher;
    }

    // 更新语言切换按钮文本
    updateLanguageToggleText() {
        if (this.languageToggle) {
            this.languageToggle.textContent = this.currentLanguage === 'zh' ? 'EN' : 'ZH';
        }
    }

    // 绑定事件
    bindEvents() {
        if (!this.languageToggle) return;

        this.languageToggle.addEventListener('click', () => {
            this.toggleLanguage();
        });
    }

    // 切换语言
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'zh' ? 'en' : 'zh';
        localStorage.setItem('language', this.currentLanguage);
        this.updateLanguageToggleText();
        this.updateLanguageText();
    }

    // 更新语言文本
    updateLanguageText() {
        // 更新免责声明
        const footerDisclaimer = document.getElementById('footer').querySelector('.disclaimer');
        if (footerDisclaimer) {
            footerDisclaimer.textContent = CONFIG.text[this.currentLanguage].disclaimer;
        }

        // 更新分类标签文本
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            const category = button.dataset.category;
            button.textContent = CONFIG.text[this.currentLanguage].categories[category];
        });

        // 更新卡片复制文本
        const copyKeyElements = document.querySelectorAll('.copy-key');
        copyKeyElements.forEach(element => {
            element.textContent = CONFIG.text[this.currentLanguage].copyKey;
        });

        // 更新下载提示文本
        const downloadBannerElement = document.getElementById('download-banner').querySelector('.download-text');
        if (downloadBannerElement && this.categorySwitcher) {
            const currentCategory = this.categorySwitcher.getCurrentCategory();
            const infoText = CONFIG.text[this.currentLanguage].downloadInfo[currentCategory] ||
                CONFIG.text[this.currentLanguage].downloadInfo.jetbrains;
            downloadBannerElement.innerHTML = infoText;
        }
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}