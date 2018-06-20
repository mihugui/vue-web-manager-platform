<template>
    <div>
        <section class="content-search">
            <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                <el-form-item
                    label="企业名称" label-width="80px">
                    <el-input
                        placeholder="请输入企业名称"
                        v-model="placename"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="企业类型" label-width="80px">
                    <el-select v-model="enttype" clearable placeholder="请选择">
                        <el-option
                            v-for="item in dicts.enttype"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section class="content-operate">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showPerMission">权限分配</el-button>
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
                    <el-input placeholder="请输入名称"  v-model="dialog.entName">
                        <template slot="prepend">企业名称</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入编号" v-model="dialog.entCode">
                        <template slot="prepend">企业编号</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入法人名称" v-model="dialog.entLerep">
                        <template slot="prepend">企业法人</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">企业类型</div>
                    <el-select v-model="dialog.entType" clearable placeholder="请选择">
                        <el-option
                            v-for="item in dicts.enttype"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                    </div>
                </div>
                <!--<div class="dialog-input" style="margin-top: 15px;">-->
                    <!--<el-input placeholder="请输入企业开票名称" v-model="dialog.entNo">-->
                        <!--<template slot="prepend">企业开票名称</template>-->
                    <!--</el-input>-->
                <!--</div>-->
                 <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入企业税号" v-model="dialog.entNo">
                        <template slot="prepend">企业税号</template>
                    </el-input>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入负责人电话" v-model="dialog.entTel">
                        <template slot="prepend">负责人电话</template>
                    </el-input>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入父级企业" v-model="dialog.entParentId">
                        <template slot="prepend">父级企业</template>
                    </el-input>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入入驻园区" v-model="dialog.businessScope">
                        <template slot="prepend">入驻园区</template>
                    </el-input>
                </div>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                :title="title_permission"
                :visible.sync="dialogVisible_permission"
                width="850px"
                heigth = "80%"
                :modal-append-to-body="false"
                :before-close="handleClose"
                @close='closeDialog_permission'
                style="z-index: 99999;">
            <span>

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
    import Vue from 'vue'
    export default {
        name: "PlaceManager",
        data(){
            return {

                //弹出框
                title:'',
                dialog:{
                    entName:'',
                    entCode:'',
                    entLerep:'',
                    entType:'',
                    entNo:'',
                    entTel:'',
                    entParentId:'',
                    businessScope:'',
                    entDimension:'',
                },
                dialogVisible:false,
                soururl:'',

                //权限弹出框
                title_permission:'',
                dialogVisible_permission:false,

                //表格
                page:{
                    page:1,
                    pageSize:20,
                },
                showEdit:true,
                showDetele:true,
                url:'/enterprise/list',
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                },{
                    name: '企业编号',
                    value: 'entCode',
                    operate: true
                },{
                    name: '企业名称',
                    value: 'entName',
                    operate: true
                },{
                    name: '企业法人',
                    value: 'entLerep',
                    operate: true
                },{
                    name: '企业类型',
                    value: 'placeArea',
                    operate: true,
                    formatter:function(row, column, cellValue, index){
                        if(row.entType==='in')
                        {
                            return "内部企业"
                        }else{
                            return "外部企业"
                        }
                    }
                },{
                    name: '企业税号',
                    value: 'entNo',
                    operate: true
                },{
                    name: '负责人电话',
                    value: 'entTel',
                    operate: true
                },{
                    name: '父级企业',
                    value: 'placeDescription',
                    operate: true
                },{
                    name: '入驻园区',
                    value: 'placeDescription',
                    operate: true
                },{
                    name: '组织管理',
                    value: 'placeDescription',
                    operate: true,
                    formatter:function(){
                        return "测试"
                    }
                }],
                param:null,

                enttype:'',
                placename:'',
            }
        },
        components:{
            'mini-table':Table
        },
        computed:{
            ...mapGetters({
                tableData:'tableData',
                total:'total',
                dicts:'dicts'
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
                console.log(val)
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
                this.setSureUrl('/enterprise/add');
                this.dialogVisible=true;
            },
            showEditModal(){
                this.title="编辑";
                this.setSureUrl('/enterprise/update');
                this.dialogVisible=true;
            },

            showPerMission(){
                this.title_permission="编辑";
                this.setSureUrl('/enterprise/update');
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
                if(this.updateSureOK(this.dialog).retcode===200){
                    this.dialogVisible=false;
                    this.getTableByOther();
                }
            },

            closeDialog:function(){
                this.entName='';
                this.entCode='';
                this.entLerep='';
                this.entType='';
                this.entNo='';
                this.entTel='';
                this.entParentId='';
                this.businessScope='';
                this.entDimension='';
            },

            closeDialog_permission:function(){

            },

            getTableByOther:function(){
                this.getTableData(this.page);
            }

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableByOther();
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
