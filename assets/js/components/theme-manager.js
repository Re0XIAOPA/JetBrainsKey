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
        const savedTheme = localStorage.getItem('theme') || CONFIG.settings.defaultTheme;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // 如果有保存的主题设置，使用保存的设置
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            this.isDarkTheme = true;
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark-theme');
            this.isDarkTheme = false;
        } else if (savedTheme === 'auto') {
            // 自动模式下根据系统主题设置
            if (prefersDark) {
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
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'auto') {
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
                }
            });
        }
    }

    // 更新主题切换按钮图标
    updateToggleIcon() {
        if (!this.themeToggle) return;

        const savedTheme = localStorage.getItem('theme') || CONFIG.settings.defaultTheme;
        const themeIcon = this.themeToggle.querySelector('i');
        
        // 移除所有可能的图标类
        themeIcon.classList.remove('fa-moon', 'fa-sun', 'fa-adjust');
        
        // 根据当前主题或模式设置图标
        if (savedTheme === 'auto') {
            themeIcon.classList.add('fa-adjust');
        } else {
            themeIcon.classList.add(this.isDarkTheme ? 'fa-sun' : 'fa-moon');
        }
    }

    // 绑定事件
    bindEvents() {
        if (!this.themeToggle) return;

        this.themeToggle.addEventListener('click', () => {
            if (this.themeDebounce) return;
            this.themeDebounce = true;

            // 获取当前主题设置
            const savedTheme = localStorage.getItem('theme') || CONFIG.settings.defaultTheme;
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // 循环切换主题模式：auto -> light -> dark
            if (savedTheme === 'auto' || !savedTheme) {
                // 从自动切换到浅色
                document.documentElement.classList.remove('dark-theme');
                this.isDarkTheme = false;
                localStorage.setItem('theme', 'light');
            } else if (savedTheme === 'light') {
                // 从浅色切换到深色
                document.documentElement.classList.add('dark-theme');
                this.isDarkTheme = true;
                localStorage.setItem('theme', 'dark');
            } else if (savedTheme === 'dark') {
                // 从深色切换到自动
                if (prefersDark) {
                    document.documentElement.classList.add('dark-theme');
                    this.isDarkTheme = true;
                } else {
                    document.documentElement.classList.remove('dark-theme');
                    this.isDarkTheme = false;
                }
                localStorage.setItem('theme', 'auto');
            }

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