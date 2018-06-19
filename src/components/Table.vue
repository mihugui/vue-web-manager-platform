<template>
    <div class="content-wrap">
    <el-table
        ref="multipleTable"
        :data="tableData"
        align="left"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="selectedChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            v-for="(item,key) in tableKey"
            :key="key"
            :prop="item.value"
            :label="item.name"
            :width="item.width">
        </el-table-column>
    </el-table>
    <el-pagination
        style="position: fixed;bottom: 0px"
        :page-sizes="[20 , 40, 60, 100]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </div>
</template>
<script>
    export default{
        data(){
            return{
            }
        },
        props:['tableData','tableKey','total','selectedChange'],
    }
</script>
<style>
    .content-wrap {
        height:100%;
        background-color:#f0f4f7;
        display: flex;
        flex-direction:column;
    }

    .el-pagination{
        position: relative;
        margin-top: 0px;
    }

    .el-table{
        padding-left: 20px;
        border-top-width: 20px;
        padding-top: 20px;
        padding-right: 10px;
    }
</style>
