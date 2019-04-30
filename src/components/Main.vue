<template>
    <div id="app">
        <el-menu v-if="menus && menus.length > 0" :default-active="menus.id+''" mode="horizontal" >
            <menu-tree v-for="menu in menus" :menu="menu" :key="menu.id"></menu-tree>
            <lang-select></lang-select>
            <el-button type="text" @click="modifypassword" v-if="showchangepassword">{{$t('modifypwd.info.title')}}</el-button>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script>

    import MenuTree from "./MenuTree";
    import axios from 'axios'
    import LangSelect from "~/components/systemcfg/LangSelect";

    export default {
        components: {
            LangSelect,
            MenuTree},
        name: "home",
        data(){
            return {
                menus:[
                ]
            }
        },
        computed:{
            showchangepassword(){
                return window.localStorage.usertype=='mobility';
            }
        },
        mounted:function(){
            const me = this;
            //请求菜单权限
            axios({
                method:"GET",
                url:"/author/api/menues/menuauthor"
            }).then(response=>{
                this.menus = response.data.data;
            }).catch(error=>{
                    this.$alert("获取权限失败！");
                });
        },
        methods:{
            modifypassword:function(){
                this.$router.push({path:"/modifypassword"});
                window.location.reload();
            }
        }
    }
</script>

<style scoped>
    .el-button{
        float:right;
        margin-top: 7px;
        margin-right: 10px;
    }
</style>