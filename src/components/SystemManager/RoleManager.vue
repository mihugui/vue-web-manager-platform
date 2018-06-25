<template>
    <div>
        <section class="content-search">
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
        </section>
        <section class="content-operate">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showPerMission">权限分配</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele" @click="handleClose(deleteList)">删除</el-button>
        </section>
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange"></mini-table>
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="850px"
                heigth = "80%"
                :modal-append-to-body="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <div  class="dialog-input">
                    <el-input placeholder="请输入角色名称"  v-model="dialog.roleName">
                        <template slot="prepend">角色名称</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入角色编号" v-model="dialog.roleCode">
                        <template slot="prepend">角色编号</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入角色描述" v-model="dialog.roleDescription">
                        <template slot="prepend">角色描述</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">角色状态</div>
                    <el-select v-model="dialog.roleForbidden" clearable placeholder="请选择">
                        <el-option
                            v-for="item in dicts.statue"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                    </div>
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
                <el-button @click="dialogVisible_permission = false">取 消</el-button>
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
    import Vue from 'vue'
    export default {
        name: "EnterpriseManager",
        data(){
            return {

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

                //表格
                page:{
                    page:1,
                    pageSize:20,
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
                    value: 'roleForbidden',
                    operate: true
                },{
                    name: '状态',
                    value: 'roleForbidden',
                    operate: true,
                    formatter:function(row){
                        if(row.roleForbidden==0){
                            return '启用'
                        }else{
                            return '禁用'
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
                allPermission :'permission'
            }),
        },
        methods:{

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL',
                settreeids: 'SET_TREE_IDS',
                setPermissionUrl:'SET_PERMISSION_URL',
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK : 'UPDATE_TABLE_DATA',
                getRolePermission : 'GET_ROLE_PERMISSION',
                getAllPermission : 'GET_ALL_PERMISSION',
                setPermission: 'SET_PERMISSION',
                axioPostNoData :'AXIO_POST_NODATA',
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

                this.getTableData({...this.page,"roleName":this.roleName});
            },
            currentChange(val){
                this.page.pageNum = val;
                this.getTableData({...this.page,"roleName":this.roleName});
            },

            searchTable(){
                this.getTableData({...this.page,"roleName":this.roleName});
            },
            showAddModal(){
                this.closeDialog();
                this.title="新增";
                this.setSureUrl('/role/add');
                this.dialogVisible=true;
            },
            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.setSureUrl('/role/update');
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
                let result = {'ids': pids}
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
                    }else{
                        vm.$message.error(val.data.data);
                        vm.dialogVisible_permission = false;
                    }
                })
            },

            sureok:function(){
                let vm =this;

                if(vm.dialog.placeName == '')
                {
                    vm.$message.error("角色名称不能为空");
                    return;
                }
                if(vm.dialog.placeCode == '')
                {
                    vm.$message.error("园区编号不能为空");
                    return;
                }

                if(vm.dialog.placeAddress == '')
                {
                    vm.$message.error("园区地址不能为空");
                    return;
                }
                if(vm.dialog.placeArea == '')
                {
                    vm.$message.error("园区面积不能为空");
                    return;
                }

                vm.updateSureOK(vm.dialog).then(function(val){
                    if(val.data.retcode===200){
                        vm.dialogVisible=false;
                        vm.getTableByOther();
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
                this.getTableData(this.page);
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
