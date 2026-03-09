/**
 * 主脚本文件
 * 处理页面交互和动态内容生成
 */
import { ThemeManager } from './theme-manager.js';
import { LanguageManager } from './language-manager.js';
import { CardRenderer } from './card-renderer.js';
import { CategorySwitcher } from './category-switcher.js';

document.addEventListener('DOMContentLoaded', function () {
    // 初始化组件
    const languageManager = new LanguageManager();
    const cardRenderer = new CardRenderer(languageManager);
    const categorySwitcher = new CategorySwitcher(languageManager, cardRenderer);
    const themeManager = new ThemeManager();

    // 初始化所有组件
    languageManager.init();
    cardRenderer.init();
    categorySwitcher.init();
    themeManager.init();

    // 初始化页面
    languageManager.updateLanguageText();
    cardRenderer.renderCards('jetbra');
    categorySwitcher.updateDownloadInfo('jetbra');
});