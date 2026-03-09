/**
 * 主题管理组件
 * 处理主题切换、系统主题检测和本地存储
 */
import { CONFIG } from '../utils/config.js';

export class ThemeManager {
    constructor() {
        this.isDarkTheme = false;
        this.themeToggle = null;
        this.themeDebounce = false;
    }

    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.detectAndApplySystemTheme();
        this.listenForSystemThemeChanges();
        this.bindEvents();
    }

    // 检测系统主题偏好并应用
    detectAndApplySystemTheme() {
        // 检查本地存储中的主题设置
        const savedTheme = localStorage.getItem('theme');

        // 如果有保存的主题设置，使用保存的设置
        if (savedTheme) {
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark-theme');
                this.isDarkTheme = true;
            } else {
                document.documentElement.classList.remove('dark-theme');
                this.isDarkTheme = false;
            }
        } else {
            // 否则，根据系统主题偏好设置
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark-theme');
                this.isDarkTheme = true;
            } else {
                document.documentElement.classList.remove('dark-theme');
                this.isDarkTheme = false;
            }
        }

        this.updateToggleIcon();
    }

    // 监听系统主题变化
    listenForSystemThemeChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            // 添加变化监听器
            mediaQuery.addEventListener('change', (e) => {
                if (e.matches) {
                    // 切换到深色模式
                    document.documentElement.classList.add('dark-theme');
                    this.isDarkTheme = true;
                } else {
                    // 切换到浅色模式
                    document.documentElement.classList.remove('dark-theme');
                    this.isDarkTheme = false;
                }
                this.updateToggleIcon();
            });
        }
    }

    // 更新主题切换按钮图标
    updateToggleIcon() {
        if (!this.themeToggle) return;

        const themeIcon = this.themeToggle.querySelector('i');
        themeIcon.classList.remove(this.isDarkTheme ? 'fa-moon' : 'fa-sun');
        themeIcon.classList.add(this.isDarkTheme ? 'fa-sun' : 'fa-moon');
    }

    // 绑定事件
    bindEvents() {
        if (!this.themeToggle) return;

        this.themeToggle.addEventListener('click', () => {
            if (this.themeDebounce) return;
            this.themeDebounce = true;

            // 切换主题
            this.isDarkTheme = !this.isDarkTheme;
            document.documentElement.classList.toggle('dark-theme');

            // 同步保存到本地存储
            localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');

            // 强制更新图标状态
            this.updateToggleIcon();

            // 更新导航栏过渡属性
            const navbar = document.querySelector('.navbar');
            navbar.style.transition = 'background-color 0.3s, box-shadow 0.3s';

            setTimeout(() => {
                this.themeDebounce = false;
            }, 300);
        });
    }
}