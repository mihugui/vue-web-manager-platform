<template>
    <el-menu

        default-active="1"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF">
        <el-submenu v-for="(item,key) in AsideTitle"
                      :key="key"
                      :index="item.name">
            <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title"><router-link :to="item.url">{{item.name}}</router-link></span>
            </template>
            <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
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

    .el-menu {
        border-right: solid 0px #e6e6e6;
    }
</style>
