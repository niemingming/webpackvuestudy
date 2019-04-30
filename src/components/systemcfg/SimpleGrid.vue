<template>
    <el-table :data="gridinfo.data"  stripe highlight-current-row @current-change="selectRow" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column v-for="field in gridinfo.fields" :width="field.width" :property="field.property" :label="$t(field.label)"></el-table-column>
        <el-table-column v-if="gridinfo.opers && gridinfo.opers.length > 0" :label="$t('grid.operation')">
            <template slot-scope="scope">
                <el-button v-for="btn in gridinfo.opers" @click="$emit(btn.eventName,scope.row)" type="text" size="small">{{$t(btn.label)}}</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "simple-grid",
        props:{
            gridinfo:{
                data:Array,
                fields:Array,
                opers:Array
            }
        },
        data(){
            return {
                currentRow:null
            }
        },
        methods:{
            selectRow:function(val){
                this.currentRow = val;
            },
            getSelected:function(){
                return this.currentRow;
            },
            clearSelected:function(){
                this.currentRow = null;//取消选择
            }
        }
    }
</script>

<style scoped>

</style>