<template>
    <el-dropdown @command="changeLange">
                  <span class="el-dropdown-link">
                    {{$t('currentLang')}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    export default {
        name: "lang-select",
        methods:{
            changeLange:function(cmd){
                localStorage.lang = cmd;
                this.$i18n.locale = cmd;
            }
        }
    }
</script>

<style scoped>
    .el-dropdown{
        float: right;
        margin-top: 15px;
        margin-right: 10px;
    }
</style>