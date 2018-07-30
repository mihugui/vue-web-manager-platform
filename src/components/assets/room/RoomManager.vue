<template>
    <el-container style="height: 100%;  ">
        <el-aside width="220px" style="padding: 10px">
            <el-tree
                @node-click="getClickedNode"
                ref="treeForm"
                :data="roomSiteData"
                node-key="id"
                :highlight-current="true"
                :default-expanded-keys="[2]"
                :default-checked-keys="[]"
                :props="defaultProps">
            </el-tree>
        </el-aside>
        <el-main style="padding: 0px">
            <div>
                <section class="content-search">
                    <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                        <el-form-item
                            label="空间名称" label-width="80px">
                            <el-input
                                placeholder="请输入空间名称"
                                v-model="roomName"
                                clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            label="空间类型" label-width="80px">
                            <el-select v-model="roomType" clearable placeholder="请选择" style="width: 120px">
                                <el-option
                                    v-for="item in dicts.roomtype"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="状态" label-width="80px">
                            <el-select v-model="roomStatus" clearable placeholder="请选择" style="width: 120px">
                                <el-option
                                    v-for="item in dicts.roomstatus"
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
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">新增</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">编辑</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-upload2" @click="importfile">导入</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele" @click="handleClose(deleteList)">删除</el-button>
                </section>
                <section class="content-table">
                <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"
                            :sizeChange="sizeChange" :currentChange="currentChange"></mini-table>
                </section>
                <div>
                    <el-dialog
                        :title="title"
                        :visible.sync="dialogVisible"
                        width="50%"
                        heigth="80%"
                        :modal-append-to-body="false"
                        @close='closeDialog'
                        >
                         <span>
                            <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
                                  <el-form-item  label="空间名称" prop="roomName" >
                                    <el-input v-model="form.roomName" placeholder="请输入空间名称"></el-input>
                                  </el-form-item>
                                 <el-form-item label="空间编码" prop="roomCode" >
                                    <el-input v-model="form.roomCode" placeholder="请输入空间编码"></el-input>
                                  </el-form-item>
                                 <el-form-item label="空间类型" prop="roomType">
                                    <el-select v-model="form.roomType" placeholder="请选择空间类型">
                                      <el-option
                                          v-for="item in dicts.roomtype"
                                          :key="item.id"
                                          :label="item.name"
                                          :value="item.code">
                                            </el-option>
                                    </el-select>
                                  </el-form-item>
                                 <el-form-item label="空间状态" prop="roomStatus">
                                     <el-select v-model="form.roomStatus"  placeholder="请选择空间类型">
                                      <el-option
                                          v-for="item in dicts.roomstatus"
                                          :key="item.id"
                                          :label="item.name"
                                          :value="item.code">
                                            </el-option>
                                    </el-select>
                                  </el-form-item>
                                <el-form-item label="空间位置"  prop="siteName" >
                                    <el-input placeholder="请选择空间位置"
                                              v-model="form.siteName"
                                              readonly="readonly"
                                              @focus="isShowSelect">
                                  </el-input>
                                </el-form-item>
                            </el-form>
                        </span>
                       <span slot="footer" class="dialog-footer">
                        <el-button @click="closeDialog">取 消</el-button>
                        <el-button type="primary" @click="sureok">确 定</el-button>
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
                                        <el-upload
                                            class="upload-demo"
                                            drag
                                            action="/"
                                            :before-upload="getFile">
                                            <i class="el-icon-upload"></i>
                                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                            <div class="el-upload__tip" slot="tip" v-if="upFileName !=null"><h1 style="color: #303133">上传文件名称:{{ upFileName }}</h1></div>
                                            <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过5M</div>
                                            <div class="el-upload__tip" slot="tip"><a :href="downurl"  target="_blank" style="color: #303133;" download="w3logo">下载模板</a></div>
                                        </el-upload>
                                </div>
                            </span>
                                    <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible_file = false;upFileName =null">取 消</el-button>
                                <el-button type="primary" @click="upfile">确 定</el-button>
                            </span>
                    </el-dialog>
                    <el-dialog
                        title="空间位置选择"
                        :modal-append-to-body="false"
                        :visible.sync="dialogVisible_site"
                        width="300px"
                        @close="closeSiteDialog">
                    <span>
                        <el-tree
                            @check-change="handleClick"
                            ref="treeFormDialog"
                            :data="roomSiteData"
                            show-checkbox
                            @check="getCheckedKeys"
                            node-key="id"
                            check-strictly
                            highlight-current
                            :default-expanded-keys="[1]"
                            :default-checked-keys="[]"
                            :props="defaultDialogProps">
                    </el-tree>
                    </span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="closeSiteDialog">取 消</el-button>
                            <el-button type="primary" @click="sureSiteDialog">确 定</el-button>
                         </span>
                    </el-dialog>
                </div>
            </div>
        </el-main>
    </el-container>
</template>
<script>
    import Table from '@/components/Table'
    import TreeMenu from '@/components/TreeMenu'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {base} from '../../../axios/base'
    import store from '../../../stores'
    import geturl from '../../../globbal/url'
    import axios from 'axios'
    import Vue from 'vue'
    import {Permission} from "../../../axios/Permission";
    import { Message, MessageBox } from 'element-ui';

    export default {
        name: "RoomManager",
        data() {
            return {
                //园区设定
                placeId:sessionStorage.getItem("placeId"),
                params:{'placeId': sessionStorage.getItem("placeId")},
                //弹出框
                title: '',
                title_places: '',
                title_file: "导入文件",
                form: {
                    roomName: '',
                    roomCode: '',
                    roomType: '',
                    roomStatus: '',
                    siteId:'',
                    siteName:'',
                    placeId:sessionStorage.getItem("placeId"),
                },
                rules: {
                    roomName: [
                        { required: true, message: '请输入空间名称', trigger: 'blur' },
                        { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
                    ],
                    roomCode: [
                        { required: true, message: '请输入位置名称', trigger: 'blur' },
                        { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
                    ],
                    roomType: [
                        { required: true, message: '请选择空间类型', trigger: 'blur' },
                    ],
                    roomStatus: [
                        { required: true, message: '请选择空间状态', trigger: 'blur' },
                    ],
                    siteName: [
                        { required: true, message: '请选择空间位置',trigger:'focus' },
                    ],
                },
                defaultSelect:[3],
                dialogVisible: false,
                dialogVisible_file:false,
                dialogVisible_site:false,
                //文件上传
                title_file:'导入',
                downurl:'',
                upFileName:null,
                files:'',
                uploadurl:'',
                //权限弹出框
                title_permission: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                defaultDialogProps: {
                    children: 'children',
                    label: 'name'
                },
                entIds: '',
                //表格
                page: {
                    pageNum: 1,
                    pageSize: 10,
                },
                showEdit: false,
                showDetele: false,
                url: '/room/list',
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                }, {
                    name: '空间名称',
                    value: 'roomName',
                    operate: true
                }, {
                    name: '空间编码',
                    value: 'roomCode',
                    operate: true
                }, {
                    name: '空间类型',
                    value: 'roomType',
                    operate: true,
                    formatter: function (row) {
                        for (let type  of store.getters.dicts.roomtype) {
                            if (type.code === row.roomType) {
                                return type.name
                            }
                        }
                        return row.roomType
                    }
                }, {
                    name: '状态',
                    value: 'roomStatus',
                    operate: true,
                    formatter: function (row) {
                        for (let status  of store.getters.dicts.roomstatus) {
                            if (status.code === row.roomStatus) {
                                return status.name
                            }
                        }
                        return row.roomStatus
                    }
                }],
                param: null,
                i:0,
                enttype: '',
                placeid: '',
                roomStatus: '',
                roomName: '',
                roomType: '',
                siteId:'',
                siteName:'',
                seltable: '',
                selall: [],
                files: '',
                roomSiteData:[],
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
                button: 'buttonpermission',
            }),
        },
        methods: {
            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL',
                settreeids: 'SET_TREE_IDS',
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK: 'UPDATE_TABLE_DATA',
                axioPostNoData: 'AXIO_POST_NODATA'
            }),

            exportExcel() {
                //this.setSureUrl('/device/export');
                window.location.href = geturl.allurl+"/room/export?token="+sessionStorage.getItem("token")+'&placeId='+Number(sessionStorage.getItem("placeId"));
            },

            handleClick(data,checked, node) {
                this.i++;
                if(this.i%2 === 0){
                    if(checked){
                        this.$refs.treeFormDialog.setCheckedNodes([]);
                        this.$refs.treeFormDialog.setCheckedNodes([data]);
                        //交叉点击节点
                    }else{
                        this.$refs.treeFormDialog.setCheckedNodes([]);
                        //点击已经选中的节点，置空
                    }
                }
            },

            getCheckedKeys(data) {
                if(this.$refs.treeFormDialog.getCheckedKeys().length == 0){
                    this.siteName = '';
                    this.siteId = '';
                }else{
                  this.siteName = data.name;
                  this.siteId = data.id;
                }
            },

            handleNodeClick(data, Node) {
                // 如果是顶级父节点
                if (Node.parent.level === 0) {
                    // 不会触发事件
                }
                else {
                    this.formData.inspectObjectName = data.departName;
                    this.formData.inspectObject = data.id;
                    // 关闭选择器
                    this.isShowSelect = false;
                }
            },
            getClickedNode(data){
                this.page.pageNum = 1;
                this.siteId = data.id;
                this.getTableData({
                    ...this.page,
                    "siteId": data.id,
                    "placeId":this.placeId
                });
            },

            selectedChange(val) {
                var vm = this;
                this.selall = val;
                if (val.length > 0) {
                    let result = [];
                    let result2 = [];
                    if (val[0].placeIds != null) {
                        result = base.toNum(val[0].placeIds);
                        console.log(result);
                    }
                    if (val[0].userRoleIds != null) {
                        result2 = base.toNum(val[0].userRoleIds);
                    }
                    this.seltable = {
                        "roomName": val[0].roomName,
                        "roomStatus": val[0].roomStatus,
                        "roomType": val[0].roomType,
                        "roomCode": val[0].roomCode,
                        "siteId": val[0].siteId,
                        "siteName": val[0].siteName,
                        "placeId": val[0].placeId,
                        "Id": val[0].id,
                    };
                }
                switch (val.length) {
                    case 0:
                        vm.showEdit = false;
                        vm.showDetele = false;
                        break;
                    case 1:
                        vm.showEdit = true;
                        vm.showDetele = true;
                        break;
                    default:
                        vm.showEdit = false;
                        vm.showDetele = true;
                }
            },

            sizeChange(val) {
                let vm = this;
                this.loading = true;
                this.page.pageSize = val;
                this.getTableData({
                    ...this.page,
                    "siteId": this.siteId,
                    "placeId":this.placeId,
                    "roomName": this.roomName,
                    "roomType": this.roomType,
                    "roomStatus": this.roomStatus
                }).then(function(){
                    vm.loading = false
                });
            },

            isShowSelect(){
                this.dialogVisible_site = true;
                this.setCheckedKeys();
            },

            setCheckedKeys(){
                let ids = new Array();
                ids.push(this.form.siteId);
                var that = this;
                if (that.$refs.treeFormDialog) {
                    that.$refs.treeFormDialog.setCheckedKeys(ids);
                } else {
                    setTimeout(function() {
                            that.setCheckedKeys()
                        },
                        500)
                }
            },


            currentChange(val) {
                let vm = this;
                this.loading = true;
                this.page.pageNum = val;
                this.getTableData({
                    ...this.page,
                    "siteId": this.siteId,
                    "placeId":this.placeId,
                    "roomName": this.roomName,
                    "roomType": this.roomType,
                    "roomStatus": this.roomStatus
                }).then(function(){
                    vm.loading = false
                });
            },

            searchTable() {
                this.page.pageNum = 1;
                this.page.pageSize = 10;
                this.getTableData({
                    ...this.page,
                    "placeId":this.placeId,
                    "siteId":this.siteId,
                    "roomName": this.roomName,
                    "roomType": this.roomType,
                    "roomStatus": this.roomStatus
                });
            },

            showAddModal() {
                this.title = "新增";
                this.setSureUrl('/room/add');
                this.dialogVisible = true;
                this.form.placeId = this.placeId;
            },
            showEditModal() {
                let vm = this;
                this.form = {...this.seltable};
                this.title = "编辑";
                this.setSureUrl('/room/update');
                this.dialogVisible = true;
            },

            deleteList() {
                let vm = this;
                this.setSureUrl('/room/batchDelete');
                let ids = new Array();
                for (var item of vm.selall) {
                    ids.push(item.id)
                }
                let result = {'ids': ids}
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
                MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
                        done();
                    })
                    .catch(_ => {
                    });
            },

            mportfile:function(){
                this.setSureUrl('');
                this.downurl = geturl.allurl + '/templateFile/userTemplate.xlsx';
                this.uploadurl = geturl.allurl + '/user/import?token='+sessionStorage.getItem("token");
                this.dialogVisible_file = true;
            },

            getFile:function(file){
                this.files = file;
                this.upFileName = file.name
                console.log(this.files);
                return false
            },

            importfile:function(){
                this.setSureUrl('');
                this.downurl = geturl.allurl + '/room/importTemplate?token='+sessionStorage.getItem("token");
                this.uploadurl = geturl.allurl + '/room/importRoom?token='+sessionStorage.getItem("token")+'&placeId='+Number(sessionStorage.getItem("placeId"))+'&siteId='+this.siteId;
                this.dialogVisible_file = true;
            },

            upfile: function () {
                let vm = this;
                let formData = new FormData();
                formData.append('file', vm.files);

                let config = {
                    headers: {
                        // 'Accept': '*/*',
                        // 'Accept-Encoding': 'gzip, deflate',
                        // 'Connection': 'keep-alive',
                        // 'Content-Length': '36352',
                        'Content-Type': 'multipart/form-data'
                    }
                }

                axios.post(this.uploadurl, formData, config).then(function (val) {
                    if (val.data.retcode === 200) {
                        vm.dialogVisible_file = false;
                        vm.upFileName = null
                        vm.$message.success("上传成功")
                    } else  if(val.data.retcode === 400) {
                        vm.dialogVisible_file = false;
                        vm.upFileName = null
                        vm.$message.error(val.data.retmsg)
                    }else{
                            vm.dialogVisible_file = false;
                            vm.upFileName = null
                            vm.$message.error("上传失败")
                    }
                }).catch(function (error) {
                    console.log(error)
                });
            },

            downtemp: function () {

            },

            sureSiteDialog:function(){
                let vm = this;
                if(this.siteName.length >0){
                    vm.form.siteName = this.siteName;
                }
                if(this.siteName.length >0){
                    vm.form.siteId = this.siteId;
                }
                vm.dialogVisible_site = false;
            },

            sureok: function () {
                let vm =this;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        vm.updateSureOK(vm.form).then(function (val) {
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

            closeDialog() {
                this.form={};
                if (this.$refs["form"]!==undefined) {
                    this.$refs["form"].resetFields();
                };
                this.dialogVisible = false;
                //清空树节点
                this.bindSelectedTree();
            },

            //清空树节点
            bindSelectedTree(){
                var that = this;
                if (that.$refs.treeFormDialog) {
                    that.$refs.treeFormDialog.setCheckedKeys([]);
                } else {
                    setTimeout(function() {
                            that.bindSelectedTree()
                        },
                        500)
                }
            },

            closeFileDialog() {
                this.form='';
                this.dialogVisible = false;
            },

            closeSiteDialog() {
                this.dialogVisible_site = false;
            },
            getTableByOther: function () {
                this.getTableData({
                    ...this.page,
                   placeId: this.placeId
                });
            },
            //删除空的children字段
            getMenuName(menus){
                for (var value of menus) {
                    if (value.children) {
                        this.getMenuName(value.children)
                        if(value.children.length === 0){
                            delete value.children
                        }
                    }
                }

                return menus
            },
            //取空间位置数据
            getRoomSiteData() {
                let vm =this
                var parms = require('qs').stringify(vm.params);
                Permission.getAllRoomSite(parms).then(function(val){
                    vm.roomSiteData = vm.getMenuName(val);
                })
            }

        },
        mounted() {
            this.getRoomSiteData();
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
        height: auto;
    }

    .el-dialog__body {
        overflow: auto;
    }

    .dialog-input {
        width: 80%;
        padding-left: 50px;
    }

    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #000 !important ;
    }

</style>
