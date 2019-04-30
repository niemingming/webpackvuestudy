import Vue from 'vue';
import VueRouter from 'vue-router';
import main from './components/Main';
import menumanager from './components/systemcfg/menumanager/MenuManager'
import rolemanager from './components/systemcfg/rolemanager/RoleManager'
import usermanager from './components/systemcfg/usermanager/UserManager'

Vue.use(VueRouter);
//创建路由

const routes = [
    {
        path:"/main",
        component:main
    },{
        path:"/menu",
        component:menumanager
    },{
        path:"/role",
        component:rolemanager
    },{
        path:'/user',
        component: usermanager
    }
];

const  router = new VueRouter({
    routes:routes
});
export default router;


