<template>
    <div>
        <el-submenu
            v-for="(item,key) in AsideTitle"
            v-if="item.children !=''"
            :key="key">
            <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </template>
            <mini-aside-title  :AsideTitle="item.children"></mini-aside-title>
        </el-submenu>
        <el-menu-item
            v-else
            :key="key"
            :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title" >{{item.name}}</span>
        </el-menu-item>
    </div>
</template>
<script>
    export default{
        name:'mini-aside-title',
        data(){
            return{

            }
        },
        props:['AsideTitle'],
    }
</script>
<style scoped>
    a{
        text-decoration:none;
        color:white;
    }

    .el-menu {
        border-right: solid 0px #e6e6e6;
    }

    i{
        color:#fff;
    }
</style>
