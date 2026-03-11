/**
 * 主脚本文件
 * 处理页面交互和动态内容生成
 */
import { ThemeManager } from './theme-manager.js';
import { LanguageManager } from './language-manager.js';
import { CardRenderer } from './card-renderer.js';
import { CategorySwitcher } from './category-switcher.js';
import { SearchManager } from './search-manager.js';

document.addEventListener('DOMContentLoaded', function () {
    // 初始化组件
    const languageManager = new LanguageManager();
    const cardRenderer = new CardRenderer(languageManager);
    const categorySwitcher = new CategorySwitcher(languageManager, cardRenderer);
    const themeManager = new ThemeManager();
    const searchManager = new SearchManager(languageManager, cardRenderer);

    // 初始化所有组件
    languageManager.init();
    cardRenderer.init();
    categorySwitcher.init();
    themeManager.init();
    searchManager.init();
    
    // 设置分类切换器引用
    languageManager.setCategorySwitcher(categorySwitcher);

    // 初始化页面
    languageManager.updateLanguageText();
    cardRenderer.renderCards('jetbrains');
    categorySwitcher.updateDownloadInfo('jetbrains');
});