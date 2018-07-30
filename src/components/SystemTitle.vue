<template>
    <el-menu
        class="el-menu-demo"
        :default-active="activeIndex"
        mode="horizontal"
        text-color="#333"
        active-text-color="#36a8fc">
        <el-menu-item  v-for="(item,key) in SystemTitle"
                       :key="key"
                       :index="item.system"
                       @click="changeSystem(item.system)">
            <i :class="item.icon"></i> {{item.name}}
        </el-menu-item>
    </el-menu>
</template>
<script>
    export default{
        data(){
            return{
                activeIndex:sessionStorage.getItem("system")
            }
        },
        props:['SystemTitle','changeSystem'],
    }
</script>
<style scoped>

    li {
        display: inline-block;
        height: 100%;
        line-height: 50px;
        padding: 0 15px;
        font-size: 14px;
        color: #fff;
        border-right: 3px solid #fff;
        cursor: pointer;
        transition: .2s;
        text-decoration: none;
    }

    a{
        text-decoration:none
    }
    i{
        color:#333;
    }
</style>
