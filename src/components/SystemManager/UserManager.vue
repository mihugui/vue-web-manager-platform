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
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit &&(button.filter(btn =>{return btn.path === '/user/edit'}).length!=0)" @click="showEditModal">编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="button.filter(btn =>{return btn.path === '/user/examin'}).length!=0" @click="F">审核</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit &&(button.filter(btn =>{return btn.path === '/user/per'}).length!=0)" @click="showPerMission">权限分配</el-button>
            <!--<el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="pwdreset">密码重置-->
            <!--</el-button>-->
            <!--<el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showPlaces">园区分配-->
            <!--</el-button>-->
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showEdit &&(button.filter(btn =>{return btn.path === '/user/del'}).length!=0)" @click="handleClose(deleteList)">删除</el-button>
        </section>
        <section class="content-table">
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"
                    :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
        </section>
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="850px"
                heigth="80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" :rules="rules" ref="dialog" label-width="120px"  class="demo-ruleForm">
                    <el-form-item label="用户姓名" prop="userRealname">
                        <el-col :span="20">
                        <el-input v-model="dialog.userRealname"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户编号" prop="userNo">
                        <el-col :span="20">
                        <el-input v-model="dialog.userNo" ></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户名" prop="userName">
                        <el-col :span="20">
                        <el-input v-model="dialog.userName" :disabled="userStatue"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户角色" prop="userRoleIds">
                        <el-select v-model="dialog.userRoleIds" multiple placeholder="请选择角色">
                            <el-option
                            v-for="item in allRole"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="userMobile">
                        <el-col :span="20">
                        <el-input v-model="dialog.userMobile"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="userIdno">
                        <el-col :span="20">
                        <el-input v-model="dialog.userIdno"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="入驻园区" prop="placeIds">
                        <el-select v-model="dialog.placeIds" multiple placeholder="请选择入住园区">
                            <el-option
                                v-for="item in allPlace"
                                :key="item.id"
                                :label="item.placeName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管理归属企业" prop="manageEntId">
                        <el-select v-model="dialog.manageEntId" placeholder="请选择管理归属企业">
                            <el-option
                                v-for="item in allEnt"
                                :key="item.id"
                                :label="item.entName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="消费归属企业" prop="consumeEntId">
                        <el-select v-model="dialog.consumeEntId" placeholder="请选择消费归属企业">
                            <el-option
                                v-for="item in allEnt"
                                :key="item.id"
                                :label="item.entName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="userStatus">
                        <el-select v-model="dialog.userStatus" placeholder="请选择状态">
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
                :close-on-click-modal="false"
                @close='closeDialog_permission'
                style="z-index: 99998;">
            <span>
                <el-tree
                    :data="allPermission"
                    show-checkbox
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
                :title="title_file"
                :visible.sync="dialogVisible_file"
                default-expand-all
                width="500px"
                heigth="80%"
                :modal-append-to-body="false"
                style="z-index: 99999;">
            <span>
                 <div class="dialog-input" style="margin-top: 15px;">
                    <!--<el-input type="file" @change="getFile" placeholder="请导入文件" v-model="dialog.userNo">-->
                        <!--<template   slot="prepend">导入文件</template>-->
                        <!--<template slot="append"><a style="color: rgb(144, 147, 153); "target="_blank" :href="downurl">下载模板</a></template>-->
                    <!--</el-input>-->
                        <el-upload
                            class="upload-demo"
                            drag
                            action="/"
                            :before-upload="getFile"
                            >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip" v-if="upFileName !=null">上传文件名称:{{ upFileName }}</div>
                            <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过500kb</div>
                            <div class="el-upload__tip" slot="tip"><a target="_blank" :href="downurl" style="color: rgb(144, 147, 153);">下载模板</a></div>
                        </el-upload>


                    <!--<div data-v-f48b85f8="" class="el-input el-input-group el-input-group&#45;&#45;append el-input-group&#45;&#45;prepend">-->
                        <!--<div class="el-input-group__prepend">导入文件</div>-->
                        <!--<input type="file" name="file" autocomplete="off" placeholder="请导入文件" class="el-input__inner" @change="getFile">-->
                        <!--<div class="el-input-group__append">-->
                        <!---->
                        <!--</div>-->
                    <!--</div>-->
                </div>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_file = false;upFileName =null">取 消</el-button>
                <el-button type="primary" @click="upfile">确 定</el-button>
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
    import geturl from '../../globbal/url'
    import axios from 'axios'
    import Vue from 'vue'

    export default {
        name: "UserManager",
        data() {
            var checkUserNo = (rule, value, callback) => {
                console.log(this.userStatue)
                if(this.userStatue === false){
                    this.setCheckUrl('/user/checkUserNo')
                    this.getCheakNO({userNo:value}).then(function(val){
                        if(val.data.retcode === 200){
                            callback();
                        }else{
                            callback(new Error('用户编号已经存在'));
                        }
                    })}else{
                    callback()
                }
            };

            var checkUserName = (rule, value, callback) => {
                if(this.userStatue === false){
                    this.setCheckUrl('/user/checkUserName')
                    this.getCheakNO({userName:value}).then(function(val){
                        if(val.data.retcode === 200){
                            callback();
                        }else{
                            callback(new Error('用户名已经存在'));
                        }
                    })}else{
                    callback()
                }
            };

            return {
                //输入框规则
                saverules:null,
                rules: {
                    userRealname: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                    ],
                    userNo: [
                        { required: true, message: '请输入用户编号', trigger: 'blur' },
                        { pattern: /^[0-9]*$/, message: '你的用户编号格式不对,请输入8位数字'},
                        { min: 8, max: 8, message: '长度为8个字符', trigger: 'blur' },
                        { validator: checkUserNo, trigger: 'blur' }
                    ],
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { pattern: /^[0-9a-zA-Z]*$/, message: '你的用户名不正确'},
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
                        { validator: checkUserName, trigger: 'blur' }
                    ],
                    placeIds: [
                        {  required: true, message: '请至少选择一个园区', trigger: 'change' }
                    ],
                    userIdno: [
                        { required: true, message: '请输入证件号码', trigger: 'blur' },
                        { min: 16, max: 18, message: '长度在 16 到 18 个字符', trigger: 'blur' }
                        ],
                    userMobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
                    ],
                    manageEntId: [
                        { required: true, message: '请选择管理企业', trigger: 'change' }
                    ],
                    consumeEntId: [
                        { required: true, message: '请选择消费企业', trigger: 'change' }
                    ],
                    userStatus: [
                        { required: true, message: '请选择用户状态', trigger: 'change' }
                    ]
                },
                //弹出框
                title: '',
                title_places:'',
                title_file:"导入文件",
                dialog: {
                    userRealname:'',
                    userNo:'',
                    userName:'',
                    userRoleIds: [],
                    placeIds: [],
                    userIdno:'',
                    userMobile:'',
                    manageEntId: '',
                    consumeEntId: '',
                    userStatus: '',
                },
                dialogVisible: false,
                soururl: '',
                downurl:'',
                uploadurl:'',
                userStatue:false,
                upFileName:null,

                //权限弹出框
                title_permission: '',
                dialogVisible_permission: false,
                dialogVisible_places:false,
                dialogVisible_file:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                entIds: [],
                allPlace: [],
                allRole: [],
                allEnt:[],

                //表格
                loading:true,
                page: {
                    page: 1,
                    pageSize: 10,
                },
                showEdit: false,
                showDetele: false,
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
                files:'',
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
                setCheckUrl:'SET_CHECK_URL'
            }),
            ...mapActions({
                getTableData: 'GET_TABLE_DATA',
                updateSureOK: 'UPDATE_TABLE_DATA',
                getUserPermission: 'GET_SUSER_PERMISSION',
                getAllPermission : 'GET_ALL_PERMISSION',
                setPermission: 'SET_PERMISSION',
                axioPostNoData: 'AXIO_POST_NODATA',
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
                this.params = {'userId': vm.seltable.Id,'resourceId':pids}
            },

            selectedChange(val) {
                var vm = this;
                this.selall = val;
                console.log(val)
                if (val.length > 0) {
                    let presult = new Array();
                    let rresult = new Array();
                    if(val[0].placeIds != null) {
                        presult = base.toNum(val[0].placeIds);
                    }
                    if(val[0].userRoleIds != null) {
                        rresult = base.toNum(val[0].userRoleIds);
                    }
                    this.seltable = {
                        "userRealname": val[0].userRealname,
                        "userNo": val[0].userNo,
                        "userName": val[0].userName,
                        "userRoleIds": rresult,
                        "placeIds": presult,
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
                let vm = this
                this.page.pageSize = val;
                this.loading = true
                this.getTableData({...this.page, "userRealname":this.username,"userStatus":this.statue,"placeNames":this.placename}).then(function(){
                    vm.loading = false
                });
            },
            currentChange(val) {
                let vm = this
                this.loading = true
                this.page.pageNum = val;
                this.getTableData({...this.page,"userRealname":this.username,"userStatus":this.statue,"placeNames":this.placename}).then(function(){
                    vm.loading = false
                });
            },

            searchTable(){
                let vm = this
                this.loading = true
                this.getTableData({...this.page,"userRealname":this.username,"userStatus":this.statue,"placeNames":this.placename}).then(function(){
                    vm.loading = false
                });
            },

            showPlaces(){

            },

            showExamin(){

            },

            showAddModal() {
                let vm =this
                this.title = "新增";
                this.setSureUrl('/user/add');
                this.userStatue = false;
                this.dialogVisible = true;

            },
            showEditModal() {
                let vm =this
                this.dialog = {...this.seltable};
                this.title = "编辑";
                this.setSureUrl('/user/update');
                this.userStatue = true;
                this.dialogVisible = true;
            },

            showPerMission() {
                this.setPermissionUrl('/user/updateResource');
                let vm = this ;
                this.title_permission="权限分配";
                this.params = {'Id': vm.seltable.Id}
                this.dialogVisible_permission=true;
                this.getUserPermission(this.params).then(function(val){
                    let ids = new Array();
                    for( var item of val.data.data){
                        ids.push(item.id)
                    }
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
                this.setSureUrl('');
                this.downurl = geturl.allurl + '/templateFile/userTemplate.xlsx';
                this.uploadurl = geturl.allurl + '/user/import?token='+sessionStorage.getItem("token");
                this.dialogVisible_file = true;
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

            getFile:function(file){
                 this.files = file;
                 this.upFileName = file.name
                 console.log(this.files);
                 return false
            },

            upfile:function(){
                if(this.upFileName == null){
                    this.$message.warning("请选择文件后，确认上传")
                    return;
                }
                let vm = this;
                let formData = new FormData();
                formData.append('file', vm.files);

                let config = {
                    headers: {
                        'Accept':'*/*',
                        'Accept-Encoding': 'gzip, deflate',
                        'Connection': 'keep-alive',
                        'Content-Length': '36352',
                        'Content-Type': 'multipart/form-data'
                    }
                }

                axios.post(geturl.allurl+"/user/importUser?token="+sessionStorage.getItem('token'), formData, config).then(function(val){
                    if (val.data.returnCode === "0") {
                        vm.dialogVisible_file = false;
                        vm.$message.success("上传成功")
                    }else{
                        vm.dialogVisible_file = false;
                        vm.$message.success("上传失败")
                    }
                }).catch(function(error){
                    console.log(error)
                });
            },

            downtemp:function(){

            },

            resetForm(formName) {
                let vm = this
                vm.dialogVisible = false;
                vm.$refs[formName].resetFields();
            },

            sureok: function () {
                let vm = this;
                if(vm.dialog.userIdno.indexOf('********')===-1 ){
                    let rule = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
                    if(!rule.test(vm.dialog.userIdno)){
                        vm.$message.error("身份证不符合规范");
                        return
                    }
                };
                if(vm.dialog.userMobile.indexOf('****')===-1 ){
                    let rule = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                    if(!rule.test(vm.dialog.userMobile)){
                        vm.$message.error("手机号不符合规范");
                        return
                    }
                };

                this.$refs['dialog'].validate((valid) => {
                    if (valid) {
                        let a = JSON.stringify(vm.dialog.placeIds);
                        let pids = a.substring(1, a.length - 1);
                        vm.dialog.placeIds=pids;
                        let b = JSON.stringify(vm.dialog.userRoleIds);
                        let rids = b.substring(1, b.length - 1);
                        vm.dialog.userRoleIds=rids;
                        console.log(rids)

                        vm.updateSureOK(vm.dialog).then(function (val) {
                            if (val.data.returnCode === "0") {
                                vm.dialogVisible = false;
                                vm.getTableByOther();
                                vm.$message.success("成功")
                            }else{
                                if(vm.dialog.placeIds != null) {
                                    vm.dialog.placeIds = base.toNum(vm.dialog.placeIds);
                                }
                                if(vm.dialog.userRoleIds != "") {
                                    vm.dialog.userRoleIds = base.toNum(vm.dialog.userRoleIds);
                                }
                                vm.$message.error(val.data.returnMsg)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            closeDialog: function () {
                this.resetForm('dialog');
                this.dialog.userRealname=''
                this.dialog.userNo=''
                this.dialog.userName=''
                this.dialog.userRoleIds= []
                this.dialog.placeIds= []
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
                let vm = this
                this.getTableData(this.page).then(function(){
                    vm.loading = false
                });
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
    .el-input__inner{
        width: 200px;
    }
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
