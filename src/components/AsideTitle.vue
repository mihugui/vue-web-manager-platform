<template>
    <el-menu
        default-active="1"
        align="left"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF"
        router>
        <mini-aside-title :AsideTitle="AsideTitle"></mini-aside-title>
    </el-menu>
</template>
<script>
    import miniAside from '@/components/miniAsideTitle'
    export default{
        name:'aside-title',
        data(){
            return{

            }
        },
        components:{
            'mini-aside-title': miniAside,
        },
        props:['isCollapse','AsideTitle'],
    }
</script>
<style>
    a{
        text-decoration:none;
        color:white;
    }

    .el-menu {
        border-right: solid 0px #e6e6e6;
    }
</style>
