<template>
    <el-menu
        class="el-menu-vertical-demo"
        default-active="1"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF">
        <el-menu-item v-for="(item,key) in AsideTitle"
                      :key="key"
                      :index="item.name">
            <i :class="item.icon"></i>
            <span slot="title"><router-link :to="item.url">{{item.name}}</router-link></span>
        </el-menu-item>
    </el-menu>
</template>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        props:['isCollapse','AsideTitle'],
    }
</script>
<style>
    a{
        text-decoration:none;
        color:white;
    }
</style>
