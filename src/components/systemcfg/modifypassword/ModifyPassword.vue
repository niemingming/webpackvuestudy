<template>
        <el-container ref="modifycontainer">
            <el-header height="30">
                <lang-select></lang-select>
            </el-header>
            <el-main>
                <el-form ref="modifyform" :model="forminfo.data" :rules="forminfo.rules" label-width="160px">
                    <el-form-item :label="$t('modifypwd.form.oldpwd')" prop="oldpwd">
                        <el-input type="password" v-model="forminfo.data.oldpwd"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('modifypwd.form.newpwd')" prop="newpwd">
                        <el-input type="password" v-model="forminfo.data.newpwd"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('modifypwd.form.newpwd2')" prop="newpwd2">
                        <el-input type="password" v-model="forminfo.data.newpwd2"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">{{$t('buttonText.submit')}}</el-button>
                        <el-button @click="this.$refs.modifyform.resetFields();">{{$t('buttonText.reset')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
</template>

<script>
    import LangSelect from "~/components/systemcfg/LangSelect";
    import axios from 'axios'
    export default {
        name: "modify-password",
        components: {
            LangSelect},
        data(){
            //定义校验规则
            var checkpass = (rule,value,callback)=>{
                if(value===''){
                    callback(new Error(this.$t("modifypwd.rules.newpwd")));
                }else {
                    if (this.forminfo.data.newpwd2 !== ''){
                        this.$refs.modifyform.validateField('newpwd2');
                    }
                    callback();
                }
            };
            var checkpass2 = (rule,value,callback)=>{
                if(value===''){
                    callback(new Error(this.$t("modifypwd.rules.newpwd2")));
                }else if (value !== this.forminfo.data.newpwd){
                    callback(new Error(this.$t('modifypwd.rules.differ')));
                }else {
                    callback();
                }
            };
            return {
                forminfo:{
                    data:{
                        oldpwd:'',
                        newpwd:'',
                        newpwd2:''
                    },
                    rules:{
                        oldpwd:[
                            {required:true,message:this.$t('modifypwd.rules.oldpwd'),trigger:'blur'}
                        ],
                        newpwd:[
                            {validator:checkpass,trigger:'blur'}
                        ],
                        newpwd2:[
                            {validator:checkpass2,trigger:'blur'}
                        ]
                    }
                }
            }
        },
        mounted:function(){
            this.$refs.modifycontainer.$el.style.height = (window.innerHeight-80) + 'px';
        },
        methods:{
            submit:function(){
                var me = this;
                this.$refs.modifyform.validate((success,error)=> {
                    if (!success) {
                        me.$alert(me.$t('commoninfo.checkfailed'));
                        return;
                    }
                    axios({method:"get",url:"/author/api/salt"})
                        .then(response =>{
                            //修改密码的一定是自己管理的用户
                            var pwd = this.forminfo.data.oldpwd;
                            pwd = me.$md5(pwd + response.data.salt);
                            const salt = me.$md5(new Date().getTime()+'');
                            var newpwd = me.$md5(this.forminfo.data.newpwd + salt);//加盐加密
                            //登录方法
                            axios({method:"post",url:"/author/api/modify",data:{
                                    password:pwd,
                                    newpassword:newpwd,
                                    salt:salt
                                },headers:{"Content-Type":"application/json"}}).then(response=>{//"Access-Control-Allow-Origin":"*",
                                    me.$router.push({path:"/home"});
                                    window.location.reload();
                                    localStorage.setItem("token",response.data.token);
                            }).catch(error =>{
                                if(error.response){
                                    if(error.response){
                                        switch (error.response.status){
                                            case 602:
                                                me.$alert(me.$t('login.info.error'));
                                                break;
                                            case 604:
                                                me.$alert(me.$t('modifypwd.info.info'))
                                        }
                                    }else {
                                        me.$alert(me.$t('commoninfo.savefailed'));
                                    }
                                }
                            });
                        })
                        .catch(error =>{
                            if(error.response){
                                switch (error.response.status){
                                    case 500:
                                        me.$alert(me.$t('login.info.exception'));
                                }
                            }else {
                                me.$alert(error.message);
                            }
                        });
                });
            }
        }
    }
</script>

<style scoped>
    .el-form{
        width:500px;
        margin: 100px auto;
    }
</style>