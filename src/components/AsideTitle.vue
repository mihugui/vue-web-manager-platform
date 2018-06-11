<template>
    <el-menu

        default-active="1"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu
                    v-for="(item,key) in AsideTitle"
                    v-if="item.children != null"
                    :key="key"
                    :index="key">
            <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
            </template>
            <el-menu-item-group>
                <el-menu-item
                    v-for="(miniitem,minikey) in item.children"
                    :key="minikey"><router-link :to="miniitem.url">{{miniitem.name}}</router-link></el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-menu-item
            v-else
            :key="key"
            :index="key">
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

    .el-menu {
        border-right: solid 0px #e6e6e6;
    }
</style>
