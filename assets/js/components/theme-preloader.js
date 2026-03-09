// 预加载脚本，防止暗黑模式闪烁 不需要引入app.js 此脚本优先加载
// 检查本地存储中的主题设置
const savedTheme = localStorage.getItem('theme');
// 检查系统主题偏好
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// 如果有保存的主题设置，使用保存的设置；否则，根据系统主题偏好设置
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark-theme');
}