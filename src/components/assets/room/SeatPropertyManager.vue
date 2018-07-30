<template>
    <div>
        <section class="content-operate">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal" v-if="button.filter(btn =>{return btn.path === '/places/add'}).length!=0">新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit && (button.filter(btn =>{return btn.path === '/places/edit'}).length!=0)" @click="showEditModal" >编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele && (button.filter(btn =>{return btn.path === '/places/del'}).length!=0)" @click="handleClose(deleteList)" >删除</el-button>
        </section>
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="60%"
                heigth = "80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" :rules="rules" ref="dialog" label-width="120px"  class="demo-ruleForm">
                    <el-form-item label="属性名称" prop="propertyName">
                        <el-input v-model="dialog.propertyName"></el-input>
                    </el-form-item>
                    <el-form-item label="属性排序" prop="propertyOrder">
                        <el-input v-model.number="dialog.propertyOrder"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必填">
                            <el-switch v-model="dialog.isRequired" active-value="是"
                                       inactive-value="否"></el-switch>
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
    import { Message, MessageBox } from 'element-ui';
    export default {
        name: "PlaceManager",
        data(){
            return {
                //输入框规则
                rules:{
                    propertyName:[
                        { required: true, message: '请输入属性名称', trigger: 'blur' },
                        { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
                    ],
                    propertyOrder:[
                        { required: true, message: '请输入属性排序', trigger: 'blur' },
                        { type: 'number', message: '排序必须为数字值'}
                    ],
                },
                title:'',
                url:'/seat/property/list',
                //弹出框
                dialog:{
                    propertyName:'',
                    propertyOrder:'',
                    isRequired:'否'
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
                    name: '属性名称',
                    value: 'propertyName',
                    operate: true
                },{
                    name: '排序',
                    value: 'propertyOrder',
                    operate: true
                },{
                    name: '是否必填',
                    value: 'isRequired',
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
                        "propertyName":val[0].propertyName,
                        "propertyOrder":val[0].propertyOrder,
                        "isRequired":val[0].isRequired,
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
                this.setSureUrl('/seat/property/add');
                this.userStatue = false;
                this.dialogVisible=true;
            },
            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.setSureUrl('/seat/property/update');
                this.userStatue = true;
                this.dialogVisible=true;
            },
            deleteList(){
                let vm = this;
                this.setSureUrl('/seat/property/delete');
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
                        vm.$message.error(val.data.retmsg);
                    }
                })
            },

            handleClose(done) {
                MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
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
