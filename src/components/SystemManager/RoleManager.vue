<template>
    <div>
        <section class="content-search">
            <div style="padding-left: 20px">
            <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                <el-form-item
                    label="角色名称" label-width="80px">
                    <el-input
                        placeholder="请输入角色名称"
                        v-model="roleName"
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
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="button.filter(btn =>{return btn.path === '/role/add'}).length!=0" @click="showAddModal">新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit && (button.filter(btn =>{return btn.path === '/role/edit'}).length!=0)" @click="showEditModal">编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit && (button.filter(btn =>{return btn.path === '/role/per'}).length!=0)" @click="showPerMission">权限分配</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele && (button.filter(btn =>{return btn.path === '/role/del'}).length!=0)" @click="handleClose(deleteList)">删除</el-button>
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
                    <el-form-item label="角色名称" prop="roleName">
                        <el-col :span="20">
                        <el-input v-model="dialog.roleName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="角色编号" prop="roleCode">
                        <el-col :span="20">
                        <el-input v-model="dialog.roleCode"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDescription">
                        <el-col :span="20">
                        <el-input v-model="dialog.roleDescription"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="角色状态" prop="roleForbidden">
                        <el-select v-model="dialog.roleForbidden" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.statue"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('dialog')">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                :title="title_permission"
                :visible.sync="dialogVisible_permission"
                width="300px"
                heigth = "80%"
                :modal-append-to-body="false"
                @close='closeDialog_permission'
                style="z-index: 99999;">
            <span>
                <el-tree
                    :data="allPermission"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    :default-checked-keys="entIds"
                    :props="defaultProps"
                    check-strictly
                    @check-change="gettreeid">
                 </el-tree>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_permission=false">取 消</el-button>
                <el-button type="primary" @click="surePermission">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import TreeMenu from '@/components/TreeMenu'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    import store from '../../stores'
    import Vue from 'vue'
    export default {
        name: "EnterpriseManager",
        data(){

            var checkRoleCode = (rule, value, callback) => {
                if(this.userStatue === false){
                    this.setCheckUrl('/role/checkRoleCode')
                    this.getCheakNO({roleCode:value}).then(function(val){
                        if(val.data.retcode === 200){
                            callback();
                        }else{
                            callback(new Error('角色编号已经存在'));
                        }
                    })}else{
                    callback()
                }
            };

            return {
                //输入框规则
                rules: {
                    roleName:[
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    roleCode:[
                        { required: true, message: '请输入角色编号', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
                        { validator: checkRoleCode, trigger: 'blur' }
                    ],
                    roleDescription:[
                        { required: false, message: '请输入角色描述', trigger: 'blur' },
                        { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
                    ],
                    roleForbidden:[
                        { required: true, message: '请选择角色状态', trigger: 'change' }
                    ],
                },


                //弹出框
                title:'',
                dialog:{
                    roleName:'',
                    roleCode:'',
                    roleDescription:'',
                    roleForbidden:'',
                },
                dialogVisible:false,
                soururl:'',

                //权限弹出框
                title_permission:'',
                dialogVisible_permission:false,
                dialogVisible_Organization:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                entIds:[],
                userStatue:false,

                //表格
                loading:true,
                page:{
                    page:1,
                    pageSize:10,
                },
                showEdit:false,
                showDetele:false,
                url:'/role/list',
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                },{
                    name: '角色名称',
                    value: 'roleName',
                    operate: true
                },{
                    name: '角色编号',
                    value: 'roleCode',
                    operate: true
                },{
                    name: '角色描述',
                    value: 'roleDescription',
                    operate: true
                },{
                    name: '状态',
                    value: 'roleForbidden',
                    operate: true,
                    formatter:function(row){
                        for(let type  of store.getters.dicts.statue){
                            if(type.code === row.roleForbidden){
                                return type.name
                            }
                        }
                    }
                }],
                param:null,
                allPlace:[],
                enttype:'',
                roleName:'',
                seltable:'',
                selall:[],
            }
        },
        components:{
            'mini-table':Table,
        },
        computed:{
            ...mapGetters({
                tableData:'tableData',
                total:'total',
                dicts:'dicts',
                allPermission :'permission',
                button:'buttonpermission'
            }),
        },
        methods:{

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL',
                settreeids: 'SET_TREE_IDS',
                setPermissionUrl:'SET_PERMISSION_URL',
                setCheckUrl:'SET_CHECK_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK : 'UPDATE_TABLE_DATA',
                getRolePermission : 'GET_ROLE_PERMISSION',
                getAllPermission : 'GET_ALL_PERMISSION',
                setPermission: 'SET_PERMISSION',
                axioPostNoData :'AXIO_POST_NODATA',
                getCheakNO : 'GET_CHECK_NO'
            }),

            gettreeid(){
                let vm = this;
                let tree = [...this.$refs.tree.getCheckedNodes(),...this.$refs.tree.getHalfCheckedNodes()];
                let ids = [];
                for( var item of tree){
                    ids.push(item.id);
                }
                let a = JSON.stringify(ids);
                let pids = a.substring(1,a.length-1);
                this.params = {'roleId': vm.seltable.Id,'resourceId':pids}
            },

            selectedChange(val){
                var vm = this;
                this.selall=val;
                if(val.length>0){
                    this.seltable ={
                        "roleName":val[0].roleName,
                        "roleCode":val[0].roleCode,
                        "roleDescription":val[0].roleDescription,
                        "roleForbidden":val[0].roleForbidden,
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
                this.page.pageSize = val;
                this.loading = true
                this.getTableData({...this.page,"roleName":this.roleName}).then(this.loading=false);
            },
            currentChange(val){
                this.page.pageNum = val;
                this.loading = true
                this.getTableData({...this.page,"roleName":this.roleName}).then(this.loading=false);
            },

            searchTable(){
                this.loading = true
                this.getTableData({...this.page,"roleName":this.roleName}).then(this.loading=false);
            },
            showAddModal(){
                this.title="新增";
                this.setSureUrl('/role/add');
                this.userStatue = false;
                this.dialogVisible=true;
            },
            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.setSureUrl('/role/update');
                this.userStatue = true;
                this.dialogVisible=true;
            },

            showPerMission(){
                this.setPermissionUrl('/role/updateResource');
                let vm = this ;
                this.title_permission="权限分配";
                this.params = {'Id': vm.seltable.Id}
                this.dialogVisible_permission=true;
                this.getRolePermission(this.params).then(function(val){
                    let ids = [];
                    for( var item of val.data.data){
                        ids.push(item.id)
                    }
                    console.log(ids)
                    vm.$refs.tree.setCheckedKeys(ids);
                });
            },
            deleteList(){
                let vm = this;
                this.setSureUrl('/role/delete');
                let ids = new Array();
                for( var item of vm.selall){
                    ids.push(item.id)
                }
                let result = {'ids': ids}
                vm.updateSureOK(result).then(function(val){
                    if(val.data.retcode===200){
                        vm.$message.success("删除成功");
                        vm.getTableByOther();
                    }else{
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

            surePermission:function(){
                let vm = this ;
                this.setPermission(this.params).then(function(val){
                    if(val.data.retcode = 200){
                        vm.$message.success(val.data.data);
                        vm.dialogVisible_permission = false;
                        sessionStorage.removeItem("permission");
                    }else{
                        vm.$message.error(val.data.data);
                        vm.dialogVisible_permission = false;
                    }
                })
            },

            resetForm(formName) {
                let vm = this
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
                this.dialog.roleName ='';
                this.dialog.roleCode ='';
                this.dialog.roleDescription ='';
                this.dialog.roleForbidden ='';
                if(this.dialog.Id){
                    delete this.dialog.Id;
                }
            },

            closeDialog_permission:function(){

            },

            getTableByOther:function(){
                let vm =this
                this.getTableData(this.page).then(function(){
                    vm.loading = false
                });
            },

            getAllplace:function(){
                this.axioPostNoData("/places/getAllPlaces").then(function(val){
                    console.log(val)
                })
            }

        },
        mounted () {
            this.getAllplace();
            this.getAllPermission();
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
