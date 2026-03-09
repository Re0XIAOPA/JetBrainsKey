/**
 * 语言管理组件
 * 处理语言切换和文本更新
 */
import { CONFIG } from '../utils/config.js';

export class LanguageManager {
    constructor() {
        this.currentLanguage = CONFIG.settings.defaultLanguage;
        this.languageToggle = null;
    }

    init() {
        this.languageToggle = document.getElementById('language-toggle');
        this.bindEvents();
        this.updateLanguageToggleText();
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
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}