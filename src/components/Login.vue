<template>
    <el-container ref="logincontainer">
        <el-header height="30">
            <lang-select></lang-select>
        </el-header>
        <el-main>
            <div id="login" style="text-align: center;width: 320px;margin: 100px auto;">

                <el-form :model="form" style="width: 300px;">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" :placeholder="$t('login.placeholder.username')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.password" type="password" :placeholder="$t('login.placeholder.password')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login">{{$t('login.button.login')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-main>
    </el-container>
</template>

<script>

    import axios from "axios"
    import LangSelect from "~/components/systemcfg/LangSelect";
    import ElContainer from "element-ui/packages/container/src/main";
    export default {
        components: {
            ElContainer,
            LangSelect},
        name: "login",
        data(){
            return {
                form:{
                    username:"",
                    password:""
                }
            }
        },
        mounted:function(){
            this.$refs.logincontainer.$el.style.height = (window.innerHeight-80) + 'px';
        },
        methods:{
            login:function(){
                var me = this;
                //首先获取用户类型和盐
                axios({method:"get",url:"/author/api/login/salt?username=" + me.$data.form.username})
                    .then(response =>{
                        var type = response.data.type;
                        localStorage.usertype = type;//将用户类型存入
                        var pwd = this.$data.form.password;
                        if(type == 'mobility'){
                            pwd = me.$md5(pwd + response.data.salt);
                        }
                        //登录方法
                        axios({method:"post",url:"/author/api/login",data:{
                            username:me.$data.form.username,
                            password:pwd
                        },headers:{"Content-Type":"application/json"}}).then(response=>{//"Access-Control-Allow-Origin":"*",
                            if (response.data.redirect){//需要跳转到修改密码页
                                me.$router.push({path:"/modifypassword"});
                            }else {
                                me.$router.push({path:"/home"});
                            }
                            window.location.reload();
                            localStorage.setItem("token",response.data.token);
                        }).catch(error =>{
                            if(error.response){
                                switch (error.response.status){
                                    case 601:
                                        me.$alert(me.$t('login.info.nouser'));
                                        break;
                                    case 602:
                                        me.$alert(me.$t('login.info.error'));
                                        break;
                                }
                            }
                        });
                    })
                    .catch(error =>{
                        if(error.response){
                            switch (error.response.status){
                                case 500:
                                    me.$alert(me.$t('login.info.exception'));
                                case 601:
                                    me.$alert(me.$t('login.info.nouser'));
                                    break;
                                case 602:
                                    me.$alert(me.$t('login.info.error'));
                                    break;
                            }
                        }else {
                            me.$alert(error.message);
                        }
                    });
            }
        }
    }
</script>

<style scoped>

</style>