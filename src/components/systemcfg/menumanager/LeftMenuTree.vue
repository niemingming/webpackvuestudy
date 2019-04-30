<template>
    <el-tree :props="mprop" :load = "loadMenu" lazy @node-click="handleClick" node-key="id" ref="menutree"></el-tree>
</template>

<script>
    import axios from 'axios'
    //左侧菜单树
    export default {
        name: "left-menu-tree",
        data(){
            return {
                mprop:{
                    label:'name',
                    children:'menus',
                    isLeaf:'leaf'
                }
            }
        },
        methods:{
            loadMenu(node,resolve){
                if(node.level === 0){
                    //根目录
                    return resolve([{name:this.$t('menu.tree.rootName'),id:0}]);
                }else {
                    axios({
                        method:"GET",
                        url:"/author/api/menues/children?parentMenu=" + node.data.id
                    })
                        .then(response=>{
                            return resolve(response.data.data);
                        })
                        .catch(error=>{
                            this.$alert("加载失败！");
                        })
                }
            },
            handleClick:function(data,node){
                this.$emit('nodeclick',data,node);
            },
            appendNode:function(data){
                const tree = this.$refs['menutree'];
                //当前选中节点添加
                var currnode = tree.getCurrentNode();
                if (!currnode){
                    tree.setCurrentKey(0);
                    currnode = tree.getCurrentNode();
                }
                //添加数据
                tree.append(data,currnode);
            },
            updateNode:function (data) {
                const tree = this.$refs['menutree'];
                const node = tree.getNode(data);
                if (node){
                    node.data = data;
                }
            },
            removeNode:function(data){
                const tree = this.$refs['menutree'];
                tree.remove(data);
            },
            selectNode:function(key){
                const tree = this.$refs['menutree'];
                tree.selectNode(key);
            }
        }
    }
</script>

<style scoped>

</style>