<template>
<div>
    <section class="content-search">
        <div style="padding-left: 20px">
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
                    <el-button type="primary" icon="el-icon-search" @click="searchTable">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
    </section>
    <section class="content-operate">
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal" v-if="button.filter(btn =>{return btn.path === '/places/add'}).length!=0">新增</el-button>
    <el-button type="primary" size="mini" icon="el-icon-edit" v-if="showEdit && (button.filter(btn =>{return btn.path === '/places/edit'}).length!=0)" @click="showEditModal" >编辑</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele && (button.filter(btn =>{return btn.path === '/places/del'}).length!=0)" @click="handleClose(deleteList)" >删除</el-button>
    </section>
    <section class="content-table">
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
    </section>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="850px"
            heigth = "80%"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            @close='closeDialog'
            style="z-index: 99999;">
            <span>
                <el-form :model="dialog" :rules="rules" ref="dialog" label-width="120px"  class="demo-ruleForm">
                    <el-form-item label="园区名称" prop="placeName">
                        <el-col :span="20">
                        <el-input v-model="dialog.placeName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="园区编号" prop="placeCode">
                        <el-col :span="20">
                        <el-input v-model="dialog.placeCode"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="园区地址" prop="placeAddress">
                        <el-col :span="20">
                        <el-input v-model="dialog.placeAddress"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="园区面积" prop="placeArea">
                        <el-col :span="20">
                        <el-input v-model="dialog.placeArea">
                            <el-button slot="append">平方米</el-button>
                        </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="园区描述" prop="placeDescription">
                        <el-col :span="20">
                        <el-input v-model="dialog.placeDescription"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('dialog')">取 消</el-button>
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

            var checkPlaceCode = (rule, value, callback) => {
                if(this.userStatue === false){
                    this.setCheckUrl('/places/checkPlaceCode')
                    this.getCheakNO({placeCode:value}).then(function(val){
                        if(val.data.retcode === 200){
                            callback();
                        }else{
                            callback(new Error('园区编号已经存在'));
                        }
                    })}else{
                    callback()
                }
            };

            return {
                //输入框规则
                rules:{
                    placeName:[
                        { required: true, message: '请输入园区名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    placeCode:[
                        { required: true, message: '请输入园区编号', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
                        { validator: checkPlaceCode, trigger: 'blur' }
                    ],
                    placeAddress:[
                        { required: true, message: '请输入园区地址', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    placeArea:[
                        { required: true, message: '请输入面积', trigger: 'blur' },
                        { pattern:/^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '你的面积格式不正确'}
                    ],
                    placeDescription:[
                        { required: false, message: '请输入园区描述', trigger: 'blur' },
                        { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
                    ],
                },

                title:'',
                url:'/places/list',
                //弹出框
                dialog:{
                    placeName:'',
                    placeCode:'',
                    placeAddress:'',
                    placeArea:'',
                    placeDescription:'',
                },
                dialogVisible:false,
                showEdit:false,
                showDetele:false,
                soururl:'',
                userStatue:false,


                //表格
                loading:true,
                page:{
                    pageNum:1,
                    pageSize:10,
                },
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
                placename:'',
                seltable:'',
                selall:[],
            }
        },
        components:{
            'mini-table':Table
        },
        computed:{
            ...mapGetters({
                tableData:'tableData',
                total:'total',
                button:'buttonpermission'
            }),
        },
        methods:{

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL',
                setCheckUrl:'SET_CHECK_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK : 'UPDATE_TABLE_DATA',
                getCheakNO : 'GET_CHECK_NO'
            }),

            selectedChange(val){
                var vm = this;
                this.selall = val;
                if(val.length>0){
                this.seltable ={
                    "placeName":val[0].placeName,
                    "placeCode":val[0].placeCode,
                    "placeAddress":val[0].placeAddress,
                    "placeArea":val[0].placeArea,
                    "placeDescription":val[0].placeDescription,
                    "Id":val[0].id,
                };}
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
                let vm = this
                this.page.pageSize = val;
                this.loading=true
                this.getTableData({...this.page,...this.placename}).then(function() {
                    vm.loading = false
                })
            },
            currentChange(val){
                let vm = this
                this.page.pageNum = val;
                this.loading=true
                this.getTableData(this.page).then(function() {
                    vm.loading = false
                })
            },

            searchTable(){
                let vm = this
                this.loading=true
                this.getTableData({...this.page,"placeName":this.placename}).then(function() {
                    vm.loading = false
                })
            },

            showAddModal(){
                this.title="新增";
                this.setSureUrl('/places/add');
                this.userStatue = false;
                this.dialogVisible=true;
            },
            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.setSureUrl('/places/update');
                this.userStatue = true;
                this.dialogVisible=true;
            },
            deleteList(){

                let vm = this;
                this.setSureUrl('/places/delete');
                var ids = new Array();
                for (var item of vm.selall) {
                    ids.push(item.id)
                }
                let result = {'ids':ids}
                vm.updateSureOK(result).then(function (val) {
                    if (val.data.retcode === 200) {
                        vm.$message.success("删除成功");
                        vm.getTableByOther();
                    } else {
                        vm.$message.error("删除失败");
                    }
                })
            },

            handleClose(done) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },

            resetForm(formName) {
                let vm =this
                vm.dialogVisible = false;
                vm.$refs[formName].resetFields();
            },

            sureok:function(){
                let vm =this;
                this.$refs['dialog'].validate((valid) => {
                    if (valid) {
                        vm.updateSureOK(vm.dialog).then(function (val) {
                            if (val.data.retcode === 200) {
                                vm.dialogVisible = false;
                                vm.getTableByOther();
                            }else{
                                vm.$message.error(val.data.retmsg)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })

            },

            closeDialog:function(){
                this.resetForm('dialog');
                this.dialog.placeArea='';
                this.dialog.placeAddress='';
                this.dialog.placeCode='';
                this.dialog.placeDescription='';
                this.dialog.placeName='';
                if(this.dialog.Id){
                    delete this.dialog.Id;
                }
            },

            getTableByOther:function(){
                let vm =this
                this.getTableData(this.page).then(function() {
                    vm.loading = false
                })
            }

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableByOther();
        },
    }
</script>
<style scoped>
    .content-search {
        background-color: #fff;
        border-bottom: 2px solid hsla(0,0%,92%,.9);
        margin:20px 0 0 0;
        width: 100% ;
    }
    .content-operate {
        margin:10px 0 10px 30px;
        flex: 1;
        overflow-y: auto;
    }

    .content-table{
        background-color: #f0f4f7;
        padding: 10px 20px 60px;
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
