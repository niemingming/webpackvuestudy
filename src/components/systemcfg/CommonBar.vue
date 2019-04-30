<template>
    <div style="border-bottom: gainsboro 1px solid;text-align: left;">
        <el-button v-if="addButton !== false" type="text" icon="el-icon-plus" @click="buttonClick('addClick')">{{$t('barButton.add')}}</el-button>
        <el-button v-if="editButton !== false" type="text" icon="el-icon-edit" @click="buttonClick('editClick')">{{$t('barButton.edit')}}</el-button>
        <el-button v-if="removeButton !== false" type="text" style="color: red;" icon="el-icon-delete" @click="buttonClick('removeClick')">{{$t('barButton.remove')}}</el-button>
        <el-button v-for="(btn,index) in otherButtons" type="text" :icon="btn.icon" @click="buttonClick(btn.eventName)" :key="index" >{{$t(btn.name)}}</el-button>
    </div>
</template>

<script>
    export default {
        name: "common-bar",
        props:{
            addButton:true,
            editButton:true,
            removeButton:true,
            otherButtons:Array
        },
        methods:{
            buttonClick:function(name){
                this.$emit(name);
            }
        }
    }
</script>

<style scoped>

</style>