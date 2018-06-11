<template>
    <div>
        <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>

        <el-dialog
            title="修改"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">

            <span>
                <el-form :inline="true" :model="companySearch" class="demo-form-inline" size="mini" label-width="100px">
                <el-form-item
                v-for ="(search,index) in searchData"
                :key="index"
                v-if="search.seachtype===1"
                :label="search.name" label-width="80px">
        <el-input
            :placeholder="'请输入'+search.name"
            :id="search.key"
            clearable>
        </el-input>
    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                dialogVisible: false,
                searchData:[{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区设备',
                    seachtype:2,
                    key:'device',
                    url:'/Employee/type',
                    optionvalue:'classtype',
                    optionname:'classname',
                }]
            };
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }
        }
    }
</script>
<style>
    .el-dialog{
        max-height:calc(100% - 300px);
        max-width:calc(100% - 30px);
        display:flex;
        flex-direction:column;

    }
    .el-dialog__body
    {
    overflow:auto;
    }

</style>

