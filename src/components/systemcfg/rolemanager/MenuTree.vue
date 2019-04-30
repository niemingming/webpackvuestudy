<template>
    <el-tree v-if="showcheckbox==1"
            ref="rmenutree"
            :props="mprop"
            :data="treedata"
            show-checkbox
            :default-checked-keys="promenues"
             node-key="id"
             style="height: 300px;"
    ></el-tree>

    <el-tree v-else
             ref="rmenutree"
             :props="mprop"
             :data="treedata"
             :default-checked-keys="promenues"
             node-key="id"
             style="height: 300px;"
    ></el-tree>
</template>

<script>
    import axios from 'axios';
    export default {

        name: "menu-tree",
        props:{
            roleCode:String,
            promenues:Array,
            treedata:Array,
            showcheckbox:Number
        },
        data(){
            return {
                mprop:{
                    label:'menuName',
                    children:'children',
                    isLeaf:'leaf'
                }

            }
        },
        methods:{
            getSelected:function(){
                return this.$refs.rmenutree.getCheckedNodes();
            }

        }
    }
</script>

<style scoped>

</style>