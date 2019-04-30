<template>
    <el-container ref="rolecontainer">
        <el-header height="40">
            <common-bar :other-buttons="otherButtons" @addClick="addRole" @editClick="editRole" @removeClick="removeRole" @premission="authorPro"  />
        </el-header>
        <el-main>
            <el-table :data="roles" stripe highlight-current-row @current-change="selectRow" style="width: 100%">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column width="160" property="roleName" :label="$t('role.form.roleName')"></el-table-column>
                <el-table-column width="160" property="roleCode" :label="$t('role.form.roleCode')" />
                <el-table-column property="remark" :label="$t('role.form.remark')"/>
            </el-table>
            <el-dialog :visible.sync="forminfo.visible" :title="forminfo.title" width="500px">
                <el-form :model="forminfo.data" :rules="forminfo.rolerule" label-width="80px" ref="roleform">
                    <el-form-item prop="id" style="display: none;">
                        <el-input type="hidden" v-model="forminfo.data.id"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('role.form.roleName')" prop="roleName">
                        <el-input v-model="forminfo.data.roleName" ></el-input>
                    </el-form-item>
                    <el-form-item prop="roleCode" :label="$t('role.form.roleCode')">
                        <el-input v-model="forminfo.data.roleCode"></el-input>
                    </el-form-item>
                    <el-form-item prop="remark" :label="$t('role.form.remark')">
                        <el-input type="textarea" v-model="forminfo.data.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveForm">{{$t('buttonText.confirm')}}</el-button>
                        <el-button @click="forminfo.visible = false">{{$t('buttonText.cancel')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :visible.sync="menuinfo.visible" :title="$t('role.info.authorTitle')" width="500px">
                <el-container>
                    <el-main>
                        <menu-tree ref="pmenutree" :showcheckbox="1" :treedata="treedata"  :promenues="promenues" :role-code="menuinfo.roleCode"></menu-tree>
                    </el-main>
                    <el-footer height="40">
                        <el-button type="primary" @click="savePremission" >{{$t('buttonText.confirm')}}</el-button>
                        <el-button @click="menuinfo.visible = false;">{{$t('buttonText.cancel')}}</el-button>
                    </el-footer>
                </el-container>
            </el-dialog>
        </el-main>
        <el-footer height="40">
            <el-pagination :total="pageinfo.total" background layout="prev,pager,next,->,total" :page-size="pageinfo.pageSize" @current-change="pagechange"></el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
    import CommonBar from "~/components/systemcfg/CommonBar";
    import axios from "axios"
    import MenuTree from "~/components/systemcfg/rolemanager/MenuTree";

    export default {
        components: {
            MenuTree,
            CommonBar},
        name: "role-manager",
        data(){
            return {
                roles:[],
                pageinfo:{
                    pageSize:10,
                    currentPage:1,
                    total:0
                },
                currentRole:null,
                forminfo:{
                    data:{
                        id:0,
                        roleName:'',
                        roleCode:'',
                        remark:''
                    },
                    visible:false,
                    title:'',
                    rolerule:{
                        roleName:[
                            {required:true,message:"角色名称不能为空！",trigger:'blur'}
                        ],
                        roleCode:[
                            {required:true,message:"角色编码不能为空！",trigger:'blur'}
                        ]
                    }
                },
                otherButtons:[
                    {
                        eventName:'premission',
                        name:'barButton.authorize'
                    }
                ],
                menuinfo:{
                    visible:false,
                    roleCode:String,
                },
                treedata:Array,
                promenues:Array
            }
        },
        created:function () {
            this.loadData(1);//加载首页数据
        },
        mounted:function(){
            this.$refs.rolecontainer.$el.style.height = (window.innerHeight-80) + 'px';
        },
        methods:{
            addRole:function(){
                this.forminfo.data = {
                    id:0,
                    roleName:'',
                    roleCode:'',
                    remark:''
                };
                this.forminfo.title = this.$t('role.info.addTitle');
                this.forminfo.visible = true;
            },
            editRole:function(){
                const me = this;
                this.forminfo.title = this.$t('role.info.editTitle');
                if (!me.currentRole) {
                    me.$alert(me.$t('commoninfo.selectinfo'));
                    return;
                }
                me.forminfo.data = {
                    id:0,
                    roleName:'',
                    roleCode:'',
                    remark:''
                };
                //加载数据
                axios({
                    method:"GET",
                    url:"/author/api/roles/" + me.currentRole.id + "/"
                })
                    .then(response=>{
                        me.forminfo.data = response.data;
                        me.forminfo.visible = true;
                    })
                    .catch(error=>{
                        if(error.response&&error.response.status == 404){
                            me.$alert(me.$t('role.info.norole'));
                            return;
                        }
                        me.$alert(me.$t('commoninfo.loadfailed'));
                    })
            },
            removeRole:function(){
                //获取选择记录
                var me = this;
                if(!this.currentRole){
                    this.$alert(me.$t('commoninfo.removeselect'));
                    return;
                }
                this.$confirm(me.$t('role.info.removeInfo'),me.$t('messagebox.info'),{
                    confirmButtonText:me.$t('buttonText.confirm'),
                    cancelButtonText:me.$t('buttonText.cancel'),
                    type:"warn"
                })
                    .then(()=>{
                        axios({
                            method:"DELETE",
                            url:"/author/api/roles/" + me.currentRole.id + "/"
                        })
                            .then(response=>{
                                me.$alert(me.$t('commoninfo.removesuccess'));
                                me.loadData(me.pageinfo.currentPage);
                            })
                            .catch(error=>{
                                if(error.response){
                                    switch(error.response.status){
                                        case 603:
                                            me.$alert(me.$t('role.info.cantremove'));
                                            return ;
                                    }
                                }
                                me.$alert(me.$t('commoninfo.removefailed'));
                            })
                    })
                    .catch(()=>{});
            },
            selectRow:function(val){
                this.currentRole = val;
            },
            saveForm:function(){
                var me = this;
                me.$refs.roleform.validate((success,error)=> {
                    if (!success) {
                        me.$alert(me.$t('commoninfo.checkfailed'));
                        return;
                    }
                    if (me.forminfo.data.roleCode == 'admin'){
                        me.$alert(me.$t('role.info.onevalidate'))
                        return;
                    }
                    var method = me.forminfo.data.id === 0?'PUT':"POST";
                    axios({
                        method:method,
                        url:'/author/api/roles/',
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
                this.pageinfo.currentPage = val;
                this.loadData(val);
            },
            loadData:function(page){
                const me = this;
                //加载数据
                axios({
                    method:'GET',
                    url:'/author/api/roles/?pageSize=' + me.pageinfo.pageSize + '&currentPage='+me.pageinfo.currentPage
                })
                    .then(response=>{
                        me.pageinfo.total = response.data.total;
                        me.roles = response.data.data;
                    })
                    .catch(error=>{})
            },
            //授权方法
            authorPro:function(){
                const me = this;
                if(!this.currentRole){
                    this.$alert(me.$t('role.info.authorinfo'));
                    return;
                }
                me.menuinfo.roleCode = me.currentRole.roleCode;
                me.loadMenuData();

            },
            loadMenuData:function(){
                const me = this;
                axios({
                    method:"GET",
                    url:"/author/api/menues/promenus?roleCode=" +  me.menuinfo.roleCode
                })
                    .then(response=>{
                        me.treedata = response.data.data;
                        me.promenues = response.data.promenus;
                        me.menuinfo.visible = true;
                    })
                    .catch(error=>{
                        this.$alert(me.$t('commoninfo.loadfailed'));
                    })
            },
            savePremission:function(){
                const me = this;
                //获取选择数据
                const nodes = me.$refs.pmenutree.getSelected();
                //保存授权
                const nids = [];
                nodes.forEach(n=>{
                    nids.push(n.id);
                });
                //授权
                axios({
                    method:'POST',
                    url:'/author/api/systempremissiones/promenues' ,
                    data:{
                        roleCode:me.menuinfo.roleCode,
                        nids:nids
                    }
                })
                    .then(response=>{
                        me.menuinfo.visible = false;
                        me.$alert(me.$t('role.info.authorsuccess'));
                    })
                    .catch(error=>{
                        me.$alert(me.$t('role.info.authorfailed'));
                    });
            }
        }
    }
</script>

<style scoped>

</style>