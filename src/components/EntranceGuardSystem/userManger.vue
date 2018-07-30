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
                            v-for="item in dicts.userstatus"
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
            <el-button type="primary" size="mini" icon="el-icon-setting" v-if="showEdit &&(button.filter(btn =>{return btn.path === '/user/per'}).length!=0)" @click="showPerMission">权限分配</el-button>
            <!--<el-button type="primary" size="mini" icon="el-icon-setting" @click="showPerMission">权限分配</el-button>-->
        </section>
        <section class="content-table">
            <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"
                        :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
        </section>
        <div>

            <el-dialog
                :title="title_permission"
                :visible.sync="dialogVisible_permission"
                width="800px"
                heigth="80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog_permission'
                style="z-index: 99998;">
                 <span v-for="item,index in dataInfo.beans"
                       :class="['selectItem', item.state ? 'selected' : '']"
                       :key="index"
                       v-on:click="toggleSelect(item, index)"
                 >
                        宇宙无敌领导元首
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
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {base} from '../../axios/base'
    import { loginpage} from '../../axios/Login'
    import store from '../../stores'
    import geturl from '../../globbal/url'
    import axios from 'axios'
    import Vue from 'vue'
    import dataInfo from './data'

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
                        for(let type  of store.getters.dicts.userStatus){
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
                statue:"0",
                seltable: '',
                selall:[],
                files:'',
                dataInfo: {
                    beans: [{}]
                }
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
                    if (val[0].placeIds != null) {
                        presult = base.toNum(val[0].placeIds);
                    }
                    if (val[0].userRoleIds != null) {
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
                    };
                    // vm.showEdit = true
                }
                switch (val.length) {
                    case 0:
                        vm.showEdit = false;
                        break;
                    case 1:
                        vm.showEdit = true
                        break;
                    default:
                        vm.showEdit = false;
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
                    // vm.$refs.tree.setCheckedKeys(ids);
                });
            },


            importfile:function(){
                this.setSureUrl('');
                this.downurl = geturl.allurl + '/templateFile/userTemplate.xlsx';
                this.uploadurl = geturl.allurl + '/user/import?token='+sessionStorage.getItem("token");
                this.dialogVisible_file = true;
            },

            surePermission (){
                this.$message.success('okay')
                let arr = []
                this.dataInfo.beans.forEach(v => {
                    if(v.state) {
                        arr.push(v)
                    }
                })
                console.info(arr)
                // this.fetch('', {})
                //     .then(res => {
                //
                //     })
                this.dialogVisible_permission = false
                console.info(this.dialogVisible_permission)
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
                this.getTableData({...this.page,"userStatus":this.statue}).then(function(){
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
            },
            toggleSelect (item, index) {
                item.state = !item.state
                this.dataInfo.beans.splice(index, 1, item)
            }

        },
        mounted() {
            this.getAllPermission();
            this.getAllEnt();
            this.getAllRole();
            this.getAllPlace();
            this.setTableUrl(this.url);
            this.getTableByOther();
            this.dataInfo = {...{}, ...dataInfo}
        },
    }
</script>
<style scoped lang="scss">
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
        height: calc(100vh - 240px);
    }

    .content-radio{
        margin:10px 0 10px 30px;
        border-bottom: 2px solid hsla(0,0%,92%,.9);
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
    .selectItem {
        display: inline-block;
        justify-content: center;
        align-items: center;
        padding: 5px;
        font-size: 14px;
        color: #888;
        border: 1px solid #409EFF;
        border-radius: 5px;
        margin: 0 15px 15px 0;
        cursor: pointer;
    }
    .selected {
        background: #409EFF;
        color: #fff;
    }

</style>
