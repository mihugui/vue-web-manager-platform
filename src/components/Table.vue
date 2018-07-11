<template>
    <div class="content-wrap">
    <el-table
        ref="multipleTable"
        :data="tableData"
        height="500"
        v-loading="loading"
        align="left"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="selectedChange"
        :row-class-name="tableRowClassName">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            v-for="(item,key) in tableKey"
            :key="key"
            :prop="item.value"
            :label="item.name"
            :type="item.type"
            :width="item.width"
            :formatter="item.formatter">
        </el-table-column>
    </el-table>
    <el-pagination
        style="position: fixed;bottom: 0px"
        :page-sizes="[10 , 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="sizeChange"
        @current-change="currentChange"
    >
    </el-pagination>
    </div>
</template>
<script>
    export default{
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (rowIndex%2 != 1) {
                    return 'warning-row';
                }
                return '';
            }
        },
        data(){
            return{
            }
        },
        props:['tableData','tableKey','total','selectedChange','sizeChange','currentChange','loading'],
    }
</script>
<style>
    .content-wrap {
        height:500px;
        background-color:#f0f4f7;
        display: flex;
        flex-direction:column;
    }

    .el-pagination{
        position: relative;
        margin-top: 0px;
    }

    .el-table .warning-row {
        background: hsla(0,0%,92%,.9);
        margin-bottom: 30px;
    }
</style>
