import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router';
import md5 from 'js-md5'
import axios from 'axios'
import config from './common'
import home from './components/Main.vue'
import i18n from './components/i18n/i18n'
import modifypassword from './components/systemcfg/modifypassword/ModifyPassword'

Vue.use(ElementUI)

Vue.prototype.$md5 = md5

Vue.prototype.$commoncfg = config;

//初始化密码
Vue.prototype.$initpwd = 123456;


new Vue({
  el: '#app',
    router,
    i18n,
  created:function(){
      // this.$router.push({path:"/main"});
      var me = this;
      //配置axios的初始值
      //配置axios
      axios.defaults.baseURL = config.hosts.authorurl;
      axios.interceptors.response.use(config=>{return config},
          error=>{
              if(error.response){
                  switch (error.response.status){
                      case 403://未登录
                      case 407://超时
                          me.$router.push({path:"/login"});
                          window.location.reload();
                          break;
                  }
              }
              return Promise.reject(error);
          });
      axios.interceptors.request.use(cfg=>{
          //配置token
          if(localStorage.getItem("token")) {
              cfg.headers['authorization']=localStorage.getItem("token");
          }
          return cfg;
      },error=>{
          return Promise.reject(error);
      })

  },
    data:{
      currhref:window.location.href
    },
    computed:{
      ViewComponent(){
          var pos = this.currhref.indexOf('login');
          if(pos >= 0){
              return App;
          }else if(this.currhref.indexOf("home") >= 0){
              return home;
          }else if(this.currhref.indexOf("modifypassword")>=0){
              return modifypassword;
          }else {
              return home;
          }
        }
    },
    mounted:function(){
      if (this.currhref.indexOf("login") < 0 && this.currhref.indexOf("home")<0){
          const path = this.currhref.substr(this.currhref.indexOf("#")+1);
          this.$router.push(path);
      }
    },
  render(h){
      return h(this.ViewComponent);
  }
})
