<template>
    <el-container>
        <el-header>
            <div class="fl title" style="display: inline-block;"><img style="margin-top: 9px ;width:125px" src="../assets/img/chinaMessage.png"></div>
            <div class="fl system">
                <el-menu
                    :default-active="activeIndex2"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#36a8fc"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="1">消费系统</el-menu-item>
                    <el-menu-item index="2">门禁系统</el-menu-item>
                    <el-menu-item index="3">视频系统</el-menu-item>
                    <el-menu-item index="4">能耗系统</el-menu-item>
                    <el-menu-item index="5">**系统</el-menu-item>
                </el-menu>
            </div>
            <div class="fr">
                <el-menu :default-active="activeIndex2"
                         class="el-menu-demo"
                         mode="horizontal"
                         @select="handleSelect"
                         background-color="#36a8fc"
                         text-color="#fff"
                         active-text-color="#ffd04b">
                    <el-submenu index="6">
                        <template slot="title">用户名</template>
                        <el-menu-item index="/6-1">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </el-header>
        <el-container>
            <el-aside width="240px">
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="1">
                        <i class="fa fa-globe fa-2x"></i>
                        <span slot="title">园区管理</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="fa fa-home fa-2x"></i>
                        <span slot="title">企业管理</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="fa fa-group fa-2x"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="fa fa-reorder fa-2x"></i>
                        <span slot="title">角色管理</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <i class="fa fa-inbox fa-2x"></i>
                        <span slot="title">资源管理</span>
                    </el-menu-item>
                    <el-menu-item index="6">
                        <i class="fa fa-book fa-2x"></i>
                        <span slot="title">日志管理</span>
                    </el-menu-item>
                    <el-menu-item index="7">
                        <i class="fa fa-cog fa-2x"></i>
                        <span slot="title">数据字典</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <mini-table :tableData="tableData" :tableKey="tableKey" :total="total"></mini-table>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import Table from '@/components/Table'
    export default{
        name:"Layout",
        data(){
            return {
                total:100,
                tableData:[{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                tableKey: [{
                    name: '日期',
                    value: 'date',
                    operate: true
                },{
                    name: '姓名',
                    value: 'name',
                    operate: false
                },{
                    name: '地址',
                    value: 'address',
                    operate: false
                }]
            }
        },
        components: {
            'mini-table': Table
        }
    }
</script>
<style>
    .el-header {
        background-color: #36a8fc;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
        width: 100px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        margin:0px 0px 0px 0px;
        height: auto;

    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .title {
        width: 220px;
        text-align: center;
        line-height: 60px;
        color: #fff;
    }


</style>
