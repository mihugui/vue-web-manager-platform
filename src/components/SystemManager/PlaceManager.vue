<template>
<div>
    <container class="content-search">
    <el-form :inline="true" :model="companySearch" class="demo-form-inline" size="mini" label-width="100px">
        <el-form-item
            label="园区名称" label-width="80px">
            <el-input
                placeholder="请输入园区名称"
                v-model="placename"
                clearable>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchChange" icon="el-icon-search">查询</el-button>
        </el-form-item>
    </el-form>
    </container>
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">新增</el-button>
    <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">修改</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele" @click="deleteList">删除</el-button>
    <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"></mini-table>
</div>
</template>
<script>
    import Table from '@/components/Table'
    export default {
        name: "place",
        data(){
            return {
                placename:'',
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
            }
        },
        components:{
            'mini-table':Table
        },
        methods:{
            selectedChange(val){
                console.log(val);
            },
            searchChange(){

            }
        }
    }
</script>
<style>
    .content-search {
    margin-bottom: 10px;
    text-align: left;
    padding: 15px 20px 0;
    border-bottom: 1px solid rgba(235,235,235,0.9);
    }
</style>
