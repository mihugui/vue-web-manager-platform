<template>
<div>
    <section class="content-search">
    <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
        <el-form-item
            label="园区名称" label-width="80px">
            <el-input
                placeholder="请输入园区名称"
                v-model="placename"
                clearable>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
    </el-form>
    </section>
    <section class="content-operate">
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">新增</el-button>
    <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">编辑</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele" @click="deleteList">删除</el-button>
    </section>
    <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"></mini-table>
    <div>
        <el-dialog
            title="修改"
            :visible.sync="dialogVisible"
            width="850px"
            heigth = "80%"
            :before-close="handleClose">
            <span>
                <div>
                    <el-input placeholder="请输入内容" v-model="input3">
                        <template slot="prepend">园区名称</template>
                    </el-input>
                </div>
                <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="input3">
                        <template slot="prepend">园区名称</template>
                    </el-input>
                </div>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>
<script>
    import Table from '@/components/Table'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "PlaceManager",
        data(){
            return {
                dialog:{

                },
                dialogVisible:false,
                showEdit:true,
                showDetele:true,
                url:'/table/data',
                placename:'',
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
                },{
                    name: '日期',
                    value: 'date',
                    operate: true
                }],
                param:null,
            }
        },
        components:{
            'mini-table':Table
        },
        computed:{
            ...mapGetters({
                tableData:'tableData',
                total:'total'
            }),
        },
        methods:{

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA'
            }),

            selectedChange(val){
                var vm = this;
                switch(val.length){
                    case 0:
                        console.log(13);
                        vm.showEdit = false;
                        vm.showDetele = false;
                        break;
                    case 1:
                        vm.showEdit = true
                        vm.showDetele = true;
                        break;
                    default:
                        vm.showEdit = false;
                        vm.showDetele = true;
                }
            },

            showAddModal(){
                this.dialogVisible=true;

            },
            showEditModal(){
                this.dialogVisible=true;
            },
            deleteList(){

            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableData(123);
        }
    }
</script>
<style>
    .content-search {
        text-align: left;
        background-color: #fff;
        border-bottom: 1px solid hsla(0,0%,92%,.9);
        padding: 15px 20px 0;
        display: block;
        margin: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    .content-operate {
        margin-bottom: 10px;
        text-align: left;
        background-color: #fff;
        border-bottom: 1px solid hsla(0,0%,92%,.9);
        display: block;
        padding-left: 30px;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }

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
