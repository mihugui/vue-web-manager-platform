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
    <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange"></mini-table>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="850px"
            heigth = "80%"
            :modal-append-to-body="false"
            :before-close="handleClose"
            @close='closeDialog'
            style="z-index: 99999;">
            <span>
                <div  class="dialog-input">
                    <el-input placeholder="请输入名称"  v-model="dialog.placeName">
                        <template slot="prepend">园区名称</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入编号" v-model="dialog.placeCode">
                        <template slot="prepend">园区编号</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入地址" v-model="dialog.placeAddress">
                        <template slot="prepend">园区地址</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入面积" v-model="dialog.placeArea">
                        <template slot="prepend">园区面积</template>
                        <el-button slot="append">平方</el-button>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入描述" v-model="dialog.placeDescription">
                        <template slot="prepend">园区描述</template>
                    </el-input>
                </div>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
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
                title:'',
                dialog:{
                    placeName:'',
                    placeCode:'',
                    placeAddress:'',
                    placeArea:'',
                    placeDescription:'',
                },
                page:{
                    pageNum:1,
                    pageSize:20,
                },
                dialogVisible:false,
                showEdit:false,
                showDetele:false,
                url:'/places/list',
                soururl:'',
                placename:'',
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                },{
                    name: '园区名称',
                    value: 'placeName',
                    operate: true
                },{
                    name: '园区编号',
                    value: 'placeCode',
                    operate: true
                },{
                    name: '园区地址',
                    value: 'placeAddress',
                    operate: true
                },{
                    name: '园区面积',
                    value: 'placeArea',
                    operate: true
                },{
                    name: '园区描述',
                    value: 'placeDescription',
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
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK : 'UPDATE_TABLE_DATA'
            }),

            selectedChange(val){
                var vm = this;
                console.log(val);
                this.dialog ={...val[0]} ;
                switch(val.length){
                    case 0:
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

            sizeChange(val){
                this.page.pageSize = val;

                this.getTableData({...this.page,...this.placename});
            },
            currentChange(val){
                this.page.pageNum = val;
                this.getTableData(this.page);
            },
            showAddModal(){
                this.title="新增";
                this.setSureUrl('/places/add');
                this.dialogVisible=true;
            },
            showEditModal(){
                this.title="编辑";
                this.setSureUrl('/places/update');
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
            },
            sureok:function(){
                let vm =this;
                vm.updateSureOK(vm.dialog).then(function(val){
                    if(val.data.retcode===200){
                        vm.dialogVisible=false;
                        vm.getTableByOthrt();
                    }
                })

            },

            closeDialog:function(){
                this.dialog.placeArea='';
                this.dialog.placeAddress='';
                this.dialog.placeCode='';
                this.dialog.placeDescription='';
                this.dialog.placeName='';
            },

            getTableByOthrt:function(){
                this.getTableData(this.page);
            }

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableByOthrt();
        },
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
