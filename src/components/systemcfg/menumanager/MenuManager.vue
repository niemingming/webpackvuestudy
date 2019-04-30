<template>
    <el-container ref="container">
        <el-aside width="200px">
            <left-menu-tree @nodeclick="searchMenu" ref="menutree"></left-menu-tree>
        </el-aside>
        <el-main>
            <common-bar :other-buttons="buttons" @addClick="addMenu" @editClick="editMenu" @removeClick="removeMenu" @configApi="configApi"></common-bar>

            <el-table :data="menus" stripe highlight-current-row @current-change="selectRow" style="width: 100%">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column width="160" property="parentMenu" :label="$t('menu.form.parentMenu')"></el-table-column>
                <el-table-column width="160" property="menuName" :label="$t('menu.form.menuName')" />
                <el-table-column width="160" property="component" :label="$t('menu.form.component')"/>
                <el-table-column property="url" :label="$t('menu.form.url')" />
            </el-table>
            <el-dialog :visible.sync="dialogFormVisiable" :title="dialogTitle" width="500px">
                <el-form :model="menudata" :rules="menurule" label-width="80px" ref="menuform">
                    <el-form-item prop="id" style="display: none;">
                        <el-input type="hidden" v-model="menudata.id"></el-input>
                    </el-form-item>
                    <el-form-item prop="parentMenu"  style="display: none;">
                        <el-input type="hidden" v-model="menudata.parentMenu"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('menu.form.parentMenu')" prop="parentMenuName">
                        <el-input v-model="menudata.parentMenuName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item prop="menuName" :label="$t('menu.form.menuName')">
                        <el-input v-model="menudata.menuName"></el-input>
                    </el-form-item>
                    <el-form-item prop="component" :label="$t('menu.form.component')">
                        <el-input v-model="menudata.component"></el-input>
                    </el-form-item>
                    <el-form-item prop="url" :label="$t('menu.form.url')">
                        <el-input v-model="menudata.url"></el-input>
                    </el-form-item>
                    <el-form-item prop="remark" :label="$t('menu.form.remark')">
                        <el-input type="textarea" v-model="menudata.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveForm">{{$t('buttonText.confirm')}}</el-button>
                        <el-button @click="dialogFormVisiable = false">{{$t('buttonText.cancel')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!--api选择列表-->
            <el-dialog :visible.sync="transferinfo.visiable" :title="transferinfo.title" width="800px">
                <el-row>
                    <el-col :span="10">
                        <el-form >
                            <el-form-item>
                                <el-input :placeholder="$t('menu.placeholder.menuName')" v-model="transferinfo.search" @change="searchApi" ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="12">
                        <el-button type="primary" @click="saveMapping">{{$t('buttonText.confirm')}}</el-button>
                        <el-button type="primary" @click="transferinfo.visiable = false">{{$t('buttonText.cancel')}}</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11"><span>{{$t('menu.transfer.unselected')}}</span></el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="11"><span>{{$t('menu.transfer.selected')}}</span></el-col>
                </el-row>
                <el-row style="height: 400px;">
                    <el-col :span="11" style="border: lightgray 1px solid;height: 100%;">
                        <el-table ref="sourcedata" :data="transferinfo.sourcedata"   height="100%" border @selection-change="sourceselect" >
                            <el-table-column type="selection" width="45"></el-table-column>
                            <el-table-column :label="$t('menu.transfer.apiName')" property="apiName" width="100"></el-table-column>
                            <el-table-column :label="$t('menu.transfer.apiPath')" property="apiPath"></el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="2" style="height: 100%;">
                        <div style="margin-top: 100%;">
                            <el-button icon="icon el-icon-d-arrow-right" @click="selectApi" type="primary"></el-button>
                            <el-button icon="icon el-icon-d-arrow-left" @click="unselectApi" type="primary"></el-button>
                        </div>
                    </el-col>
                    <el-col :span="11" style="border: lightgray 1px solid;height: 100%;">
                        <el-table ref="targetdata" :data="transferinfo.targetdata"  height="100%" border @selection-change="targetselect">
                            <el-table-column type="selection" width="45"></el-table-column>
                            <el-table-column :label="$t('menu.transfer.apiName')" property="apiName" width="100"></el-table-column>
                            <el-table-column :label="$t('menu.transfer.apiPath')" property="apiPath"></el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    //菜单管理主页面
    import LeftMenuTree from "~/components/systemcfg/menumanager/LeftMenuTree";
    import axios from 'axios'
    import ElRow from "element-ui/packages/row/src/row";
    import CommonBar from "~/components/systemcfg/CommonBar";
    export default {
        components: {
            CommonBar,
            ElRow,
            LeftMenuTree},
        name: "menu-manager",
        data(){
            return {
                buttons:[
                    {
                        name:'barButton.setting',
                        eventName:'configApi'
                    }
                ],
                menus:[],
                currentnode:{
                    id:0,
                    name:this.$t('menu.tree.rootName')
                },
                currenttreenode:null,
                currentrow:{},
                dialogFormVisiable:false,
                transferinfo:{
                    visiable:false,
                    title:'',
                    search:'',
                    sourcedata:[],
                    targetdata:[],
                    sourceSelected:[],
                    targetSelected:[]
                },
                dialogTitle:this.$t('barButton.add'),
                menudata:{
                    id:'',
                    parentMenu:'',
                    parentMenuName:'',
                    menuName:'',
                    component:'',
                    url:'',
                    remark:''
                },
                menurule:{
                    menuName:[
                        {required:true,message:this.$t('menu.rules.menuName'),trigger:"blur"}
                    ]
                }
            }
        },
        created:function(){
            this.loadData(0);
        },
        mounted:function(){
            this.$refs.container.$el.style.height = (window.innerHeight-80) + 'px';
        },
        methods:{
            searchMenu:function(data,node){
                this.currentnode = data;
                this.loadData(data.id);
            },
            selectRow:function(val){
                this.currentrow = val;
            },
            addMenu:function(){
                const me = this;
                //初始化form
                this.menudata = {
                    id:0,
                    parentMenu:me.currentnode.id,
                    parentMenuName:me.currentnode.name,
                    menuName:'',
                    component:'',
                    url:'',
                    remark:''
                };
                this.dialogTitle = this.$t('barButton.add');
                this.dialogFormVisiable = true;
            },
            editMenu:function(){
                var me = this;
                //请求详细信息
                if(me.currentrow){
                    axios({
                        method:'GET',
                        url:'/author/api/menues/'+ me.currentrow.id + "/"
                    })
                        .then(response=>{
                            me.menudata = response.data.data;
                            this.dialogTitle = this.$t('barButton.edit');
                            this.dialogFormVisiable = true;
                        })
                        .catch(error=>{
                            if(error.response&&error.response.status == 404){
                                me.$alert(me.$t('menu.info.nomenu'));
                                return;
                            }
                            me.$alert(me.$t('commoninfo.loadfailed'));
                        })
                }else {
                    this.$alert(me.$t('commoninfo.selectinfo'));
                }
            },
            removeMenu:function(){
                //获取选择记录
                if(!this.currentrow){
                    this.$alert(this.$t('commoninfo.removeselect'));
                    return;
                }
                var me = this;
                this.$confirm(me.$t('menu.info.removeInfo'),me.$t('messagebox.info'),{
                    confirmButtonText:me.$t('buttonText.confirm'),
                    cancelButtonText:me.$t('buttonText.cancel'),
                    type:"warn"
                })
                    .then(()=>{
                        axios({
                            method:"DELETE",
                            url:"/author/api/menues/" + me.currentrow.id + "/"
                        })
                            .then(response=>{
                                me.$alert(me.$t('commoninfo.removesuccess'));
                                const tree = me.$refs['menutree'];
                                tree.removeNode({id:me.currentrow.id,name:me.currentrow.menuName});
                                me.loadData(me.currentnode.id);

                            })
                            .catch(error=>{
                                if(error.response){
                                    switch(error.response.status){
                                        case 603:
                                            me.$alert(me.$t('menu.info.cantremove'));
                                            return ;
                                    }
                                }
                                me.$alert(me.$t('commoninfo.removefailed'));
                            })
                    })
                    .catch(()=>{})
            },
            saveForm:function(){
                var me = this;
                this.$refs['menuform'].validate((success,error)=>{
                   if (!success){
                       me.$alert(me.$t('commoninfo.checkfailed'));
                       return;
                   }
                   var method = me.menudata.id === 0?'PUT':"POST";
                   axios({
                       method:method,
                       url:'/author/api/menues/',
                       data:me.menudata,
                       headers:{
                           'Content-Type':'application/json'
                       }
                   })
                       .then(response=>{
                           const tree = me.$refs['menutree'];
                           if(method == 'PUT'){
                               tree.appendNode(response.data);
                           }else {
                               tree.updateNode(response.data);
                           }
                           me.dialogFormVisiable = false;
                           //更新表格
                            me.loadData(me.currentnode.id);
                       })
                       .catch(error=>{
                           me.$alert(me.$t('commoninfo.savefailed'));
                       })
                });
            },
            loadData:function(parentMenu){
                var me = this;
                axios({
                    method:"GET",
                    url:"/author/api/menues/gridmenues?parentMenu=" + parentMenu
                })
                    .then(response=>{
                        me.menus = response.data.data;
                        me.currentrow = null;
                    })
                    .catch(error=>{
                        me.$alert(me.$t('commoninfo.loadfailed'));
                    })
            },
            configApi:function(){
                const me = this;
                if (!me.currentrow){
                    me.$alert(me.$t('menu.info.cfgselectinfo'));
                    return;
                }
                me.transferinfo.search = '';
                me.transferinfo.sourcedata = [];
                me.transferinfo.targetdata = [];
                //加载已选择数据
                axios({
                    method:'GET',
                    url:'/author/api/menues/apis?menuId=' + me.currentrow.id
                })
                    .then(response=>{
                        me.transferinfo.targetdata = response.data.data;
                    })
                    .catch(error=>{
                       me.$alert(me.$t('commoninfo.loadfailed'));
                    });

                me.transferinfo.visiable = true;
            },//查询待选api
            searchApi:function(){
                const me = this;
                //获取已经选择项目
                const selected = [];
                me.transferinfo.targetdata.forEach(v=>{
                   selected.push(v.id);
                });
                axios({
                    method:'GET',
                    url:'/author/api/systemapis/apis?selected=' + selected.join(',') + '&search='+me.transferinfo.search
                })
                    .then(response=>{
                        if(response.data.success){
                            me.transferinfo.sourcedata = response.data.data;
                        }else {
                            me.$alert(response.data.msg);
                        }
                    })
                    .catch(error=>{
                        me.$alert(me.$t('commoninfo.loadfailed'));
                    });

            },
            selectApi:function(){
                const me = this;
                me.transferinfo.sourceSelected.forEach((v,i)=>{
                    const pos = me.transferinfo.sourcedata.indexOf(v);
                    me.transferinfo.sourcedata.splice(pos,1);
                    me.transferinfo.targetdata.push(v);
                });
            },
            unselectApi:function(){
                const me = this;
                me.transferinfo.targetSelected.forEach((v,i)=>{
                    const pos = me.transferinfo.targetdata.indexOf(v);
                    me.transferinfo.targetdata.splice(pos,1);
                    me.transferinfo.sourcedata.push(v);
                });
            },
            sourceselect:function(val){
                this.transferinfo.sourceSelected = val;
            },
            targetselect:function(val) {
                this.transferinfo.targetSelected = val;
            },
            saveMapping:function(){
                //保存数据
                const ids = [];
                this.transferinfo.targetdata.forEach(v=>{
                    ids.push(v.id);
                });
                var me = this;
                //发送数据
                axios({
                    method:"POST",
                    url:"/author/api/menues/apimapping",
                    data:{
                        menuId:me.currentrow.id,
                        ids:ids
                    }
                })
                    .then(response=>{
                        if(response.data.success){
                            me.$alert(me.$t('commoninfo.savesuccess'));
                            me.transferinfo.visiable = false;
                        }else {
                            me.$alert(response.data.msg);
                        }
                    })
                    .catch(response=>{
                        me.$alert(me.$t('commoninfo.savefailed'));
                    })
            }
        }
    }
</script>

<style scoped>
    .el-aside{
        border-right: gainsboro 1px solid;
    }
    .el-button{
        margin-left: 3px;
    }
    .el-button+.el-button{
        margin-left: 3px;
        margin-top: 3px;
    }
</style>