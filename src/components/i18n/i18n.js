import Vue from 'vue'
import VueI18n from 'vue-i18n'

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.lang || localLang || 'zh-CN';

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: lang,
    messages: {
        'zh-CN': require('./locale/zh_CN'),
        'en-US': require('./locale/en_US')
    }
})

export default i18n
