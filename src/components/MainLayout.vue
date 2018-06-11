<template>
    <el-container>
        <el-header>
            <div>
                <div class="fl title" style="display: inline-block;"><img style="margin-top: 9px ;width:125px" src="../assets/img/chinaMessage.png"></div>
                <div class="fl system">
                    <mini-system :SystemTitle="SystemTitle"></mini-system>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="myWidth"><mini-asidetitle :AsideTitle="AsideTitle" :isCollapse="isCollapse"></mini-asidetitle></el-aside>
            <el-main>

                <mini-table :tableData="tableData" :tableKey="tableKey" :total="total"></mini-table>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import Table from '@/components/Table'
    import SystemTitle from '@/components/SystemTitle'
    import AsideTitle from '@/components/AsideTitle'
    import Search from '@/components/Search'
    export default {
        name: "Layout",
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
                },{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },{
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },],
                SystemTitle:[{
                    icon:'fa fa-money',
                    url: '/login',
                    name: '消费系统',
                },{
                    icon:'fa fa-map-signs',
                    url: 'login',
                    name: '门禁系统',
                },{
                    icon:'fa fa-map-signs',
                    url: 'login',
                    name: '***系统',
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
                }],
                AsideTitle:[{
                    name:'园区管理',
                    url:'/yqgl',
                    icon:'fa fa-globe fa-2x'
                },{
                    name:'企业管理',
                    url:'/yqgl',
                    icon:'fa fa-home fa-2x'
                },{
                    name:'用户管理',
                    url:'/yqgl',
                    icon:'fa fa-group fa-2x'
                }],
                isCollapse:true,
                myWidth:"65px"
            }
        },
        methods:{
            changertitle(){
                if(window.innerWidth>600) {
                    this.isCollapse = false;
                    this.myWidth = "200px";
                }
                else{
                    this.isCollapse = true;
                    this.myWidth = "65px";
                }
            },
        },
        mounted () {
            this.changertitle();
            var _this =this
            // 注：window.onresize只能在项目内触发1次
            window.onresize = function windowResize () {
                // 通过捕获系统的onresize事件触发我们需要执行的事件
                _this.changertitle()
            }
        },
        components: {
            'mini-table': Table,
            'mini-system': SystemTitle,
            'mini-asidetitle':AsideTitle,
            'mini-search':Search,
        },
    }
</script>
<style scoped>
    .el-header {
        background-color: #36a8fc;
        color: #333;
        text-align: center;
        line-height: 60px;
        padding: 0;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
        width: 65px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        margin:0px 0px 0px 0px;
        height: auto;

    }

    .title {
        width: 200px;
        text-align: center;
        line-height: 60px;
        color: #fff;
    }

    .fl {
        float: left;
    }
    .fr {
        float: right;
    }

    .system{
        position:absolute;
        left:210px;
        height:60px ;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
</style>
