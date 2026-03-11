// 预加载脚本，防止暗黑模式闪烁 不需要引入app.js 此脚本优先加载
// 检查本地存储中的主题设置
const savedTheme = localStorage.getItem('theme');
// 检查系统主题偏好
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// 应用主题
function applyTheme() {
    if (savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark) || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-theme');
    } else if (savedTheme === 'light' || (savedTheme === 'auto' && !prefersDark) || (!savedTheme && !prefersDark)) {
        document.documentElement.classList.remove('dark-theme');
    }
}

// 立即应用主题
applyTheme();

// 监听系统主题变化
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (savedTheme === 'auto') {
            applyTheme();
        }
    });
}