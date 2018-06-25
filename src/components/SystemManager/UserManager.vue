<template>
    <div>
        <section class="content-search">
            <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                <el-form-item
                    label="姓名" label-width="80px">
                    <el-input
                        placeholder="请输入姓名"
                        v-model="username"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="园区名称" label-width="80px">
                    <el-input
                        placeholder="请输入园区名称"
                        v-model="placename"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="状态" label-width="80px">
                    <el-select v-model="statue" clearable placeholder="请选择">
                        <el-option
                            v-for="item in dicts.statue"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchTable">查询</el-button>
                </el-form-item>
            </el-form>
        </section>
        <section class="content-operate">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal" v-if="button.filter(btn =>{return btn.path === '/user/add'}).length!=0" >新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="importfile" v-if="button.filter(btn =>{return btn.path === '/user/import'}).length!=0">导入</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit &&(button.filter(btn =>{return btn.path === '/user/edit'}).length!=0)" @click="showEditModal">编辑
            </el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit &&(button.filter(btn =>{return btn.path === '/user/per'}).length!=0)" @click="showPerMission">权限分配
            </el-button>
            <!--<el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="pwdreset">密码重置-->
            <!--</el-button>-->
            <!--<el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showPlaces">园区分配-->
            <!--</el-button>-->
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showEdit &&(button.filter(btn =>{return btn.path === '/user/del'}).length!=0)" @click="handleClose(deleteList)">删除
            </el-button>
        </section>
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"
                    :sizeChange="sizeChange" :currentChange="currentChange"></mini-table>
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="850px"
                heigth="80%"
                :modal-append-to-body="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <div class="dialog-input">
                    <el-input placeholder="请输入姓名" v-model="dialog.userRealname">
                        <template slot="prepend">姓名</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入编号" v-model="dialog.userNo">
                        <template slot="prepend">编号</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入用户名" v-model="dialog.userName">
                        <template slot="prepend">用户名</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">用户角色</div>
                    <el-select v-model="dialog.userRoleIds" multiple clearable placeholder="请选择">
                        <el-option
                            v-for="item in allRole"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
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
                    <el-input placeholder="请输入手机号" v-model="dialog.userMobile">
                        <template slot="prepend">手机号</template>
                    </el-input>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入身份证号" v-model="dialog.userIdno">
                        <template slot="prepend">身份证号</template>
                    </el-input>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">入住园区</div>
                    <el-select v-model="dialog.placeIds" multiple clearable placeholder="请选择">
                        <el-option
                            v-for="item in allPlace"
                            :key="item.id"
                            :label="item.placeName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    </div>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">管理归属企业</div>
                    <el-select v-model="dialog.manageEntId" clearable placeholder="请选择">
                        <el-option
                            v-for="item in allEnt"
                            :key="item.id"
                            :label="item.entName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    </div>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">消费归属企业</div>
                    <el-select v-model="dialog.consumeEntId" clearable placeholder="请选择">
                        <el-option
                            v-for="item in allEnt"
                            :key="item.id"
                            :label="item.entName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    </div>
                </div>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">用户状态</div>
                    <el-select v-model="dialog.userStatus" clearable placeholder="请选择">
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

            <el-dialog
                :title="title_places"
                :visible.sync="dialogVisible_places"
                width="500px"
                heigth="80%"
                :modal-append-to-body="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <div class="dialog-input" style="margin-top: 15px;">
                    <div class="el-input el-input-group el-input-group--prepend">
                    <div class="el-input-group__prepend">归属园区</div>
                    <el-select v-model="dialog.placeIds" multiple clearable placeholder="请选择">
                        <el-option
                            v-for="item in allPlace"
                            :key="item.id"
                            :label="item.placeName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    </div>
                </div>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_places = false">取 消</el-button>
                <el-button type="primary" @click="surePlaces">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import TreeMenu from '@/components/TreeMenu'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {base} from '../../axios/base'
    import store from '../../stores'
    import Vue from 'vue'

    export default {
        name: "UserManager",
        data() {
            return {
                //弹出框
                title: '',
                title_places:'',
                dialog: {
                    userRealname:'',
                    userNo:'',
                    userName:'',
                    userRoleIds: '',
                    placeIds: '',
                    userIdno:'',
                    userMobile:'',
                    manageEntId: '',
                    consumeEntId: '',
                    userStatus: '',
                },
                dialogVisible: false,
                soururl: '',

                //权限弹出框
                title_permission: '',
                dialogVisible_permission: false,
                dialogVisible_places:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                entIds: '',
                allPlace: [],
                allRole: [],
                allEnt:[],

                //表格
                page: {
                    page: 1,
                    pageSize: 20,
                },
                showEdit: true,
                showDetele: true,
                url: '/user/query',
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                }, {
                    name: '姓名',
                    value: 'userRealname',
                    operate: true
                }, {
                    name: '编号',
                    value: 'userNo',
                    operate: true
                }, {
                    name: '用户名',
                    value: 'userName',
                    operate: true
                }, {
                    name: '用户角色 ',
                    value: 'userRoleNames',
                    operate: true,
                }, {
                    name: '手机',
                    value: 'userMobile',
                    operate: true
                }, {
                    name: '身份证号',
                    value: 'userIdno',
                    operate: true
                }, {
                    name: '所在园区',
                    value: 'placeNames',
                    operate: true
                }, {
                    name: '管理所属企业',
                    value: 'consumeEntName',
                    operate: true
                },{
                    name: '消费所属企业',
                    value: 'manageEntName',
                    operate: true
                }, {
                    name: '状态',
                    value: 'userStatus',
                    operate: true,
                    formatter:function(row){
                        for(let type  of store.getters.dicts.statue){
                            if(type.code === row.userStatus){
                                return type.name
                            }
                        }
                    }
                }],
                param: null,

                enttype: '',
                placeid: '',
                placename:'',
                username:'',
                statue:'',
                seltable: '',
                selall:[],
            }
        },
        components: {
            'mini-table': Table,
            'tree-menu': TreeMenu
        },
        computed: {
            ...mapGetters({
                tableData: 'tableData',
                total: 'total',
                dicts: 'dicts',
                allPermission :'permission',
                button:'buttonpermission'
            }),
        },
        methods: {

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl: 'SET_SURE_URL',
                settreeids: 'SET_TREE_IDS',
                setPermissionUrl:'SET_PERMISSION_URL',
            }),
            ...mapActions({
                getTableData: 'GET_TABLE_DATA',
                updateSureOK: 'UPDATE_TABLE_DATA',
                getUserPermission: 'GET_SUSER_PERMISSION',
                getAllPermission : 'GET_ALL_PERMISSION',
                setPermission: 'SET_PERMISSION',
                axioPostNoData: 'AXIO_POST_NODATA'
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
                this.params = {'userId': vm.seltable.Id,'resourceId':pids}
            },

            selectedChange(val) {
                var vm = this;
                this.selall = val;
                if (val.length > 0) {
                    let result =[];
                    let result2 =[];
                    console.log(val[0].placeIds);
                    if(val[0].placeIds != null) {
                        result = base.toNum(val[0].placeIds);
                        console.log(result);
                    }
                    if(val[0].userRoleIds != null) {
                        result2 = base.toNum(val[0].userRoleIds);
                    }
                    this.seltable = {
                        "userRealname": val[0].userRealname,
                        "userNo": val[0].userNo,
                        "userName": val[0].userName,
                        "userRoleIds": result2,
                        "placeIds": result,
                        "userMobile": val[0].userMobile,
                        "userIdno": val[0].userIdno,
                        "manageEntId": val[0].manageEntId,
                        "consumeEntId": val[0].consumeEntId,
                        "userStatus": val[0].userStatus,
                        "Id": val[0].id,
                    };}
                switch (val.length) {
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

            sizeChange(val) {
                this.page.pageSize = val;

                this.getTableData({...this.page, "userRealname":this.username,"userStatus":this.statue,"placeNames":this.placename});
            },
            currentChange(val) {
                this.page.pageNum = val;
                this.getTableData({...this.page,"userRealname":this.username,"userStatus":this.statue,"placeNames":this.placename});
            },

            searchTable(){
                this.getTableData({...this.page,"userRealname":this.username,"userStatus":this.statue,"placeNames":this.placename});
            },

            showPlaces(){

            },

            showAddModal() {
                this.closeDialog();
                this.title = "新增";
                this.setSureUrl('/user/add');
                this.dialogVisible = true;
            },
            showEditModal() {
                this.dialog = {...this.seltable};
                this.title = "编辑";
                this.setSureUrl('/user/update');
                this.dialogVisible = true;
            },

            showPerMission() {
                this.setPermissionUrl('/user/updateResource');
                let vm = this ;
                this.title_permission="权限分配";
                this.params = {'Id': vm.seltable.Id}
                this.dialogVisible_permission=true;
                this.getUserPermission(this.params).then(function(val){
                    let ids = [];
                    for( var item of val.data.data){
                        ids.push(item.id)
                    }
                    console.log(ids)
                    vm.$refs.tree.setCheckedKeys(ids);
                });
            },
            deleteList() {
                let vm = this;
                this.setSureUrl('/user/delete');
                let result = {'id': vm.selall[0].id}
                vm.updateSureOK(result).then(function (val) {
                    if (val.data.returnCode === "0") {
                        vm.$message.success("删除成功");
                        vm.getTableByOther();
                    } else {
                        vm.$message.error("删除失败");
                    }
                })
            },

            pwdreset(){

            },

            handleClose(done) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },

            surePlaces:function(){

            },


            importfile:function(){

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

            sureok: function () {
                let vm = this;
                let a = JSON.stringify(vm.dialog.placeIds);
                let apids = a.substring(1, a.length - 1);
                vm.dialog.placeIds=apids;
                let b = JSON.stringify(vm.dialog.userRoleIds);
                let bpids = b.substring(1, b.length - 1);
                vm.dialog.userRoleIds=bpids;

                vm.updateSureOK(vm.dialog).then(function (val) {
                    if (val.data.returnCode === "0") {
                        vm.dialogVisible = false;
                        vm.getTableByOther();
                    }
                })
            },

            closeDialog: function () {
                this.dialog.userRealname=''
                this.dialog.userNo=''
                this.dialog.userName=''
                this.dialog.userRoleIds= ''
                this.dialog.placeIds= ''
                this.dialog.userIdno=''
                this.dialog.userMobile=''
                this.dialog.manageEntId= ''
                this.dialog.consumeEntId= ''
                this.dialog.userStatus= ''
                if (this.dialog.Id) {
                    delete this.dialog.Id;
                }
            },

            closeDialog_permission: function () {

            },

            getTableByOther: function () {
                this.getTableData(this.page);
            },
            getAllPlace: function () {
                let vm = this;
                this.axioPostNoData("/places/getAllPlaces").then(function (val) {
                    vm.allPlace = val.data.data
                })
            },
            getAllRole: function () {
                let vm = this;
                this.axioPostNoData("/role/getAllRole").then(function (val) {
                    vm.allRole = val.data.data
                })
            },
            getAllEnt: function () {
                let vm = this;
                this.axioPostNoData("/enterprise/getAllEnterprise").then(function (val) {
                    vm.allEnt = val.data.data
                })
            }

        },
        mounted() {
            this.getAllPermission();
            this.getAllEnt();
            this.getAllRole();
            this.getAllPlace();
            this.setTableUrl(this.url);
            this.getTableByOther();
        },
    }
</script>
<style scoped>
    .content-search {
        text-align: left;
        background-color: #fff;
        border-bottom: 1px solid hsla(0, 0%, 92%, .9);
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
        border-bottom: 1px solid hsla(0, 0%, 92%, .9);
        display: block;
        padding-left: 30px;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }

    .el-dialog {
        max-height: calc(100% - 300px);
        max-width: calc(100% - 30px);
        display: flex;
        flex-direction: column;

    }

    .el-dialog__body {
        overflow: auto;
    }

    .dialog-input {
        width: 80%;
        padding-left: 50px;
    }

</style>
