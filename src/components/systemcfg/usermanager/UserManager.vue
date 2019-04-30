<template>
    <el-container ref="usercontainer" style="margin-top: 3px;">
        <el-header height="80px">
            <el-form :model="searchdata" :inline="true" label-width="80px" style="height: 30px;margin-top: 10px;text-align: left;" size="mini">
                <el-form-item :label="$t('user.search.userName')" prop="userName">
                    <el-input  v-model="searchdata.userName" :placeholder="$t('user.search.userName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('user.search.loginName')" prop="loginName">
                    <el-input  v-model="searchdata.loginName" :placeholder="$t('user.search.loginName')"></el-input>
                </el-form-item>
            </el-form>
            <common-bar :other-buttons="searchbutton" @addClick="addUser" @editClick="editUser" @removeClick="removeUser" @searchData="searchData"></common-bar>
        </el-header>
        <el-main>
            <simple-grid :gridinfo="gridinfo" ref="usergrid" @authorPro="authorPro" @showPro="showPro" style="width:100%;"></simple-grid>
            <el-dialog :visible.sync="forminfo.visible" :title="$t(forminfo.title)" width="500px">
                <el-form label-width="100px" ref="userform" :model="forminfo.data" :rules="forminfo.rules">
                    <el-form-item style="display: none;" prop="id" label="主键">
                        <input v-model="forminfo.data.id" type="hidden"/>
                    </el-form-item>
                    <el-form-item :label="$t('user.form.userName')" prop="userName">
                        <el-input v-model="forminfo.data.userName" />
                    </el-form-item>
                    <el-form-item :label="$t('user.form.loginName')" prop="loginName">
                        <el-input v-model="forminfo.data.loginName"/>
                    </el-form-item>
                    <el-form-item :label="$t('user.form.userType')" prop="type">
                        <el-select v-model="forminfo.data.type" >
                            <el-option :label="$t('user.form.usertypes.idm')" value="idm"></el-option>
                            <el-option :label="$t('user.form.usertypes.mobility')" value="mobility"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('user.form.phone')" prop="phone">
                        <el-input v-model="forminfo.data.phone"/>
                    </el-form-item>
                    <el-form-item :label="$t('user.form.email')" prop="email">
                        <el-input v-model="forminfo.data.email"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveUser">{{$t('buttonText.confirm')}}</el-button>
                        <el-button @click="forminfo.visible = false">{{$t('buttonText.cancel')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :visible.sync="transferinfo.visiable" :title="$t('barButton.authorize')" width="550px">
                <el-transfer
                        :titles="[$t('user.transfer.unselected'),$t('user.transfer.selected')]"
                        :data="transferinfo.data"
                        v-model="transferinfo.value"
                        @left-check-change="leftcheckchange"
                        @right-check-change="rightcheckchange"
                >
                    <el-button size="small" slot="left-footer" @click="showPrev('lcp')">{{$t('user.transfer.selectprev')}}</el-button>
                    <el-button size="small" slot="right-footer" @click="showPrev('rcp')">{{$t('user.transfer.selectprev')}}</el-button>
                    <el-button size="small" slot="right-footer" @click="showPrev('rap')">{{$t('user.transfer.adjustprev')}}</el-button>
                </el-transfer>
                <el-button size="small" type="primary" @click="saveUserRole">{{$t('buttonText.save')}}</el-button>
            </el-dialog>
            <el-dialog :visible.sync="menuinfo.visible" :title="menuinfo.title" width="500px">
                <el-container>
                    <el-main>
                        <menu-tree :showcheckbox="0" :treedata="menuinfo.treedata" ></menu-tree>
                    </el-main>
                </el-container>
            </el-dialog>
        </el-main>
        <el-footer height="40">
            <el-pagination :total="pageinfo.total" background layout="prev,pager,next,->,total" :page-size="pageinfo.pageSize" @current-change="pagechange"></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
    import ElContainer from "element-ui/packages/container/src/main";
    import ElHeader from "element-ui/packages/header/src/main";
    import CommonBar from "~/components/systemcfg/CommonBar";
    import ElFooter from "element-ui/packages/footer/src/main";
    import SimpleGrid from "~/components/systemcfg/SimpleGrid";
    import MenuTree from "~/components/systemcfg/rolemanager/MenuTree";
    import axios from 'axios';

    export default {
        components: {
            SimpleGrid,
            ElFooter,
            MenuTree,
            CommonBar,
            ElHeader,
            ElContainer},
        name: "user-manager",
        data(){
            return {
                searchdata:{
                    userName:'',
                    loginName:''
                },
                gridinfo:{
                    data:[],
                    fields:[
                        {property:'userName',label:'user.form.userName',width:140},
                        {property:'loginName',label:'user.form.loginName',width:140},
                        {property:'phone',label:'user.form.phone',width:140},
                        {property:'email',label:'user.form.email',width:140},
                    ],
                    opers:[
                        {
                            label:"barButton.authorize",
                            eventName:'authorPro'
                        },{
                            label:"barButton.detail",
                            eventName:"showPro"
                        }
                    ]
                },
                forminfo:{
                    visible:false,
                    title:'user.info.addTitle',
                    ref:'userform',
                    labelWidth:'80px',
                    data:{
                        id:0,
                        userName:'',
                        loginName:'',
                        type:'idm',
                        phone:'',
                        email:'',
                        salt:'',
                        password:''
                    },
                    rules:{
                        userName:[
                            {required:true,message:this.$t('user.ruleinfo.userName'),trigger:'blur'}
                        ],
                        loginName:[
                            {required:true,message:this.$t('user.ruleinfo.loginName'),trigger:'blur'}
                        ]
                    },
                    ref:'userform',

                },
                pageinfo:{
                    pageSize:10,
                    currentPage:1,
                    total:0
                },
                searchbutton:[
                    {
                        eventName:'searchData',
                        icon:'el-icon-search',
                        name:'barButton.search'
                    }
                ],
                isAdd:true,
                transferinfo:{
                    visiable:false,
                    value:Array,
                    data:Array,
                    leftChecked:[],
                    rightChecked:[]
                },
                menuinfo:{
                    visible:false,
                    treedata:Array,
                    title: this.$t('user.info.authorTitle')
                }
            }
        },
        created:function () {
            this.loadData(1);//加载首页数据
        },
        mounted:function(){
            this.$refs.usercontainer.$el.style.height = (window.innerHeight-80) + 'px';
        },
        methods:{
            addUser:function(){
                const me = this;
                me.isAdd = true;
                me.forminfo.title = 'user.info.addTitle';
                me.forminfo.data = {
                    id:0,
                    userName:'',
                    loginName:'',
                    type:'idm',
                    phone:'',
                    email:'',
                    salt:'',
                    password:''
                };
                me.forminfo.visible = true;
            },
            editUser:function(){
                const me = this;
                me.forminfo.title = 'user.info.editTitle';
                me.isAdd = false;
                if (me.$refs.usergrid.getSelected()){
                    me.forminfo.data = {
                        id:0,
                        roleName:'',
                        roleCode:'',
                        remark:''
                    };
                    //加载数据
                    axios({
                        method:"GET",
                        url:"/author/api/useres/" + me.$refs.usergrid.getSelected().id + "/"
                    })
                        .then(response=>{
                            me.forminfo.data = response.data;
                            me.forminfo.visible = true;
                        })
                        .catch(error=>{
                            if(error.response&&error.response.status == 404){
                                me.$alert(me.$t('grid.info.nouser'));
                                return;
                            }
                            me.$alert(me.$t('commoninfo.loadfailed'));
                        })

                }else {
                    me.$alert(me.$t('commoninfo.selectinfo'));
                }
            },
            removeUser:function(){
                const me = this;
                if (me.$refs.usergrid.getSelected()) {
                    me.$confirm(me.$t('user.info.removeInfo'),me.$t('messagebox.info'),{
                        confirmButtonText:me.$t('buttonText.confirm'),
                        cancelButtonText:me.$t('buttonText.cancel'),
                        type:"warn"
                    })
                        .then(()=>{
                            axios({
                                method:"DELETE",
                                url:"/author/api/useres/" + me.$refs.usergrid.getSelected().id + "/"
                            })
                                .then(response=>{
                                    me.$alert(me.$t('commoninfo.removesuccess'));
                                    me.loadData(me.pageinfo.currentPage);
                                })
                                .catch(error=>{

                                    me.$alert(me.$t('commoninfo.removefailed'));
                                })
                        })
                        .catch(()=>{});
                }else {
                    me.$alert(me.$t('commoninfo.removeselect'))
                }
            },
            searchData:function(){
                this.loadData(1);
            },
            saveUser:function(){
                const me = this;

                me.$refs.userform.validate((success,error)=>{
                    if (!success) {
                        me.$alert(me.$t('commoninfo.checkfailed'));
                        return;
                    }
                    const method = me.isAdd ? 'PUT':'POST';
                    if (method == 'PUT' ){
                        const salt = me.$md5(new Date().getTime()+'');
                        const pwd = me.$md5(me.$initpwd + salt);
                        //保存数据
                        me.forminfo.data.salt = salt;
                        me.forminfo.data.password = pwd;
                    }
                    //判断类型生成盐
                    axios({
                        method:method,
                        url:'/author/api/useres/',
                        data:me.forminfo.data,
                        headers:{
                            'Content-Type':'application/json'
                        }
                    })
                        .then(response=>{
                            me.$alert(me.$t('commoninfo.savesuccess'));
                            me.forminfo.visible = false;
                            //更新表格
                            me.loadData(me.pageinfo.currentPage);
                        })
                        .catch(error=>{
                            me.$alert(me.$t('commoninfo.savefailed'));
                        })
                });

            },
            pagechange:function(val){
                const me = this;
                me.pageinfo.currentPage = val;
                me.loadData(val);
            },
            loadData:function(page){
                const me = this;
                if(me.$refs.usergrid){
                    me.$refs.usergrid.clearSelected();
                }
                const url = '/author/api/useres/?userName=' + me.searchdata.userName + "&loginName="
                    + me.searchdata.loginName + '&currentPage=' + me.pageinfo.currentPage + '&pageSize=' + me.pageinfo.pageSize;

                //加载数据
                axios({
                    method:'GET',
                    url:url
                })
                    .then(response=>{
                        me.pageinfo.total = response.data.total;
                        me.gridinfo.data = response.data.data;
                    })
                    .catch(error=>{})

            },
            authorPro:function(row){
                //弹出选择框
                const me = this;
                me.menuinfo.title = me.$t('user.info.authorTitle');
                axios({
                    method:"GET",
                    url:"/author/api/roles/userroles?userId=" + row.id
                })
                    .then(response=>{
                        me.transferinfo.data = response.data.roles;
                        me.transferinfo.value = response.data.userroles;
                        me.transferinfo.visiable = true;
                    })
                    .catch(error=>{
                        me.$alert(me.$t('commoninfo.loadfailed'));
                    });
            },
            showPro:function (row) {
                //弹出预览数据
                const me = this;
                me.menuinfo.title = me.$t('user.info.detailTitle');
                axios({
                    method:"GET",
                    url:'/author/api/menues/' + row.id + '/usermenues'
                })
                    .then(response=>{
                        me.menuinfo.treedata = response.data.data;
                        me.menuinfo.visible = true;
                    })
                    .catch(error=>{
                        me.$alert(me.$t('commoninfo.loadfailed'));
                    });
            },
            leftcheckchange:function(val,moveKeys){
                this.transferinfo.leftChecked = val;
            },
            rightcheckchange:function(val,moveKeys){
                this.transferinfo.rightChecked = val;
            },
            showPrev:function(type){
                const me = this;
                var roles = [];
                //判断
                if(type == 'lcp'){//预览左侧选中菜单
                    roles = me.transferinfo.leftChecked;
                    if(roles.length == 0){
                        me.$alert(me.$t('user.info.selectrole'));
                        return;
                    }
                }else if (type == 'rcp'){//预览右侧选中菜单
                    roles = me.transferinfo.rightChecked;
                    if(roles.length == 0){
                        me.$alert(me.$t('user.info.selectrole'));
                        return;
                    }
                }else {//调整预览
                    me.transferinfo.value.forEach((r)=>{
                        if(me.transferinfo.rightChecked.indexOf(r)<0){
                            roles.push(r);
                        }
                    });
                    if(roles.length == 0){
                        me.$alert(me.$t('user.info.authorclear'));
                        return;
                    }
                }

                //请求数据
                axios({
                    method:"GET",
                    url:"/author/api/menues/" + roles.join(",")+"/rolemenues"
                })
                    .then(response=>{
                        me.menuinfo.treedata = response.data.data;
                        me.menuinfo.visible = true;
                    })
                    .catch(error=>{
                        me.$alert(me.$t('commoninfo.loadfailed'));
                    });
            },
            saveUserRole:function(){
                const me = this;
                //保存授权
                axios({
                    method:"POST",
                    url:"/author/api/authores/author",
                    data:{
                        userId:me.$refs.usergrid.getSelected().id,
                        roles:me.transferinfo.value
                    }

                })
                    .then(response=>{
                        me.$alert(me.$t('user.info.authorsuccess'));
                        me.transferinfo.visiable = false;
                    })
                    .catch(error=>{
                        me.$alert(me.$t('user.info.authorfailed'));
                    });
            }
        }
    }
</script>

<style scoped>

</style>