/**
 * 分类切换组件
 * 处理分类切换和下载信息更新
 */
import { CONFIG } from '../utils/config.js';

export class CategorySwitcher {
    constructor(languageManager, cardRenderer) {
        this.currentCategory = 'jetbrains';
        this.languageManager = languageManager;
        this.cardRenderer = cardRenderer;
        this.categoryButtons = null;
    }

    init() {
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.bindEvents();
    }

    // 绑定事件
    bindEvents() {
        if (!this.categoryButtons) return;

        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = button.dataset.category;
                this.switchCategory(category);
            });
        });
    }

    // 切换分类
    switchCategory(category) {
        // 更新活动按钮
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`[data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // 更新当前分类并重新渲染卡片
        this.currentCategory = category;
        this.cardRenderer.renderCards(category);

        // 更新下载提示栏内容
        this.updateDownloadInfo(category);
    }

    // 更新下载提示栏内容
    updateDownloadInfo(category) {
        // 只更新底部提示栏，不更新导航栏提示
        const downloadBannerElement = document.getElementById('download-banner').querySelector('.download-text');
        if (!downloadBannerElement) return;

        const currentLanguage = this.languageManager.getCurrentLanguage();
        // 获取当前分类的下载提示
        const infoText = CONFIG.text[currentLanguage].downloadInfo[category] ||
            CONFIG.text[currentLanguage].downloadInfo.jetbrains; // 默认使用jetbrains的提示

        // 更新底部提示栏内容
        downloadBannerElement.innerHTML = infoText;
    }
}