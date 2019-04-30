<template>
    <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.id+''">
        <template slot="title">{{$t('menunames.' + menu.component)}}</template>
        <menu-tree v-for="m in menu.children" :key="m.id+''" :menu="m"></menu-tree>
    </el-submenu>
    <el-menu-item v-else :index="menu.id+''" @click="handleRoute(menu)">{{$t('menunames.' + menu.component)}}</el-menu-item>
</template>

<script>
    export default {
        name: "menu-tree",
        props:{
            menu:{
                type:Object,
                require:true
            }
        },
        methods:{
            handleRoute:function(menu){
                if(menu.url){
                    document.title = this.$t('menunames.' + menu.component);
                    this.$router.push(menu.url);
                }
            }
        }
    }
</script>

<style scoped>

</style>