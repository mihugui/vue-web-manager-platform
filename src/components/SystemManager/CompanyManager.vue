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
                :before-close="handleClose"
                style="z-index: 99999;">
            <span>
                <div  class="dialog-input">
                    <el-input placeholder="请输入名称" v-model="dialog.placename">
                        <template slot="prepend">园区名称</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;" v-model="dialog.placename">
                    <el-input placeholder="请输入编号" >
                        <template slot="prepend">园区编号</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;" v-model="dialog.placename">
                    <el-input placeholder="请输入地址" >
                        <template slot="prepend">园区地址</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;" v-model="dialog.placename">
                    <el-input placeholder="请输入面积" >
                        <template slot="prepend">园区面积</template>
                        <el-button slot="append">平方</el-button>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;" v-model="dialog.placename">
                    <el-input placeholder="请输入描述" >
                        <template slot="prepend">园区描述</template>
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
    import {Permission} from '../../axios/Permission'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "CompanyManager",
        data(){
            return {
                dialog:{
                    placename:''
                },
                dialogVisible:false,
                showEdit:true,
                showDetele:true,
                url:'/table/data',
                placename:'',
                tableKey: [{
                    name: '序号',
                    value: 'date',
                    operate: true
                },{
                    name: '企业名称',
                    value: 'name',
                    operate: false
                },{
                    name: '企业编号',
                    value: 'address',
                    operate: false
                },{
                    name: '企业法人',
                    value: 'date',
                    operate: true
                },{
                    name: '企业类型',
                    value: 'date',
                    operate: true
                },{
                    name: '企业税号',
                    value: 'date',
                    operate: true
                },{
                    name: '负责人电话',
                    value: 'date',
                    operate: true
                },{
                    name: '父级企业',
                    value: 'date',
                    operate: true
                },{
                    name: '入驻园区',
                    value: 'date',
                    operate: true
                },{
                    name: '默认资源',
                    value: 'date',
                    operate: true
                },{
                    name: '组织管理',
                    value: 'date',
                    operate: true
                }
                ],
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
                Permission.getpermission();

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

    .dialog-input{
        width: 80%;
        padding-left: 50px;
    }
</style>
