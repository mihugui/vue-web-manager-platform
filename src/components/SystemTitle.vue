<template>
    <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#36a8fc"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item  v-for="(item,key) in SystemTitle"
                       :key="key"
                       :index="item.path"
                       @click="changeSystem(item.system)">
            <i :class="item.icon"></i> {{item.name}}
        </el-menu-item>
    </el-menu>
</template>
<script>
    export default{
        data(){
            return{
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
        border-right: 1px solid rgba(161,206,240,.4);
        cursor: pointer;
        transition: .2s;
        text-decoration: none;
    }

    a{
        text-decoration:none
    }
    i{
        color:#FFF;
    }
</style>
