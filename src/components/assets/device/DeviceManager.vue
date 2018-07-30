<template>
    <div>
        <section class="content-search">
            <div style="padding-left: 20px">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="80px">
                    <el-form-item
                        label="设备名称" label-width="80px">
                        <el-input
                            placeholder="请输入设备名称"
                            v-model="deviceName"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="设备位置" label-width="80px">
                        <el-input
                            placeholder="请输入设备位置"
                            v-model="deviceLocation"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        label="状态" label-width="80px">
                        <el-select v-model="deviceState" clearable placeholder="请选择" style="width: 100px">
                            <el-option
                                v-for="item in dicts.devicestatus"
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
            </div>
        </section>
        <section class="content-operate">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">新增</el-button>
            <el-button type="primary" size="mini" icon="el-icon-upload2" @click="importfile">导入</el-button>
            <el-button type="primary" size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele"
                       @click="handleClose(deleteList)">删除
            </el-button>
        </section>
        <section class="content-table">
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"
                    :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
        </section>
            <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="60%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
                <div>
                    <el-form :model="dialog" :rules="rules" ref="dialog" label-width="80px" class="demo-ruleForm">
                        <el-col :span="12">
                            <el-form-item label="设备名称" prop="deviceName">
                                <el-input v-model="dialog.deviceName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备品牌" prop="deviceBrand">
                                <el-input v-model="dialog.deviceBrand"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备编号" prop="deviceCode">
                                <el-input v-model="dialog.deviceCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备型号" prop="deviceModel">
                                <el-input v-model="dialog.deviceModel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类型" prop="deviceType">
                                <el-input v-model="dialog.deviceType" @focus="showDeviceTypeModel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="启用日期" prop="startDate">
                                <el-date-picker
                                    style="width:100%"
                                    v-model="dialog.startDate"
                                    type="date"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型暗码" prop="deviceTypeCode">
                                <el-input v-model="dialog.deviceTypeCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="使用年限" prop="userYear">
                                <el-input v-model="dialog.userYear">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备位置" prop="deviceLocation" >
                                <!--<el-autocomplete-->
                                    <!--style="width: 100%"-->
                                    <!--v-model="dialog.deviceLocation"-->
                                    <!--:fetch-suggestions="querySearchAsync"-->
                                    <!--placeholder="请输入内容"-->
                                    <!--@select="handleSelect"-->
                                <!--&gt;-->
                                    <!--<template slot-scope="{ item }">-->
                                        <!--<span style="float: left">{{ item.value }}</span>-->
                                        <!--<span-->
                                            <!--style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>-->
                                    <!--</template>-->
                                <!--</el-autocomplete>-->
                                <el-input v-model="dialog.deviceLocation" @focus="isShowSelect"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="供应商" prop="deviceSupplier">
                                <el-input v-model="dialog.deviceSupplier"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="主要程度" prop="mainDegree">
                                <el-select v-model="dialog.mainDegree" clearable placeholder="请选择" style="width: 100%">
                                    <el-option
                                        v-for="item in dicts.maindegree"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="月折旧率" prop="monthDepreciationrate">
                                <el-input v-model.number="dialog.monthDepreciationrate">
                                    <el-button slot="append">%</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务区域" prop="serviceArea">
                                <el-input v-model="dialog.serviceArea" @focus="isShowSiteSelect"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备价值" prop="deviceValue">
                                <el-input v-model.number="dialog.deviceValue">
                                    <el-button slot="append">万</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="deviceState">
                                <el-select v-model="dialog.deviceState" clearable placeholder="请选择" style="width: 100%">
                                    <el-option
                                        v-for="item in dicts.devicestatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="Number(item.code)">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备现值" prop="deviceMoney">
                                <el-input v-model.number="dialog.deviceMoney">
                                    <el-button slot="append">万</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('dialog')">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                title="设备类型"
                :modal-append-to-body="false"
                :visible.sync="dialogDeviceTypeVisible"
                width="400px"
                @close="closeDeviceTypeDialog">
                    <span>
                        <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterText">
                        </el-input>

                        <el-tree
                            @check-change="handleClick"
                            @check="getCheckedKeys"
                            ref="treeFormDialog"
                            :data="deviceTypeData"
                            show-checkbox
                            node-key="id"
                            check-strictly
                            highlight-current
                            :filter-node-method="filterNode"
                            :default-expanded-keys="[]"
                            :default-checked-keys="[]"
                            :props="defaultProps">
                        </el-tree>
                    </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDeviceTypeDialog">取 消</el-button>
                <el-button type="primary" @click="surDeviceTypeDialog">确 定</el-button>
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
                            @check-change="handleClickSite"
                            ref="treeSiteTypeDialog"
                            :data="roomSiteData"
                            show-checkbox
                            @check="getSiteTypeCheckedKeys"
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
                    title="空间名称选择"
                    :modal-append-to-body="false"
                    :visible.sync="dialogVisible_room"
                    width="50%">
                    <div>
                        <section>
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
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search" @click="searchRoomTable">查询</el-button>
                                </el-form-item>
                            </el-form>
                        </section>
                        <section class="content-table-room">
                            <el-table
                                v-loading="loading"
                                element-loading-text="拼命加载中"
                                element-loading-background="rgba(255, 255, 255, 0.8)"
                                :data="gridData"
                                ref="multipleTable"
                                width="600px"
                                highlight-current-row
                            >
                                <el-table-column width="80" label="选中">
                                    <template slot-scope="scope">
                                        <el-radio v-model="radio" :label="scope.row.id"
                                                  @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp
                                        </el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="roomName" label="空间名称"></el-table-column>
                                <el-table-column prop="roomCode" label="空间编码"></el-table-column>
                                <el-table-column prop="roomType" label="类型" :formatter="formatter">
                                </el-table-column>
                            </el-table>
                        </section>
                        <section class="table-content-bottom">
                            <el-pagination
                                @size-change="roomSizeChange"
                                @current-change="roomCurrentChange"
                                :page-size="5"
                                layout="prev, pager, next, jumper"
                                :total="totalRoom"
                            >
                            </el-pagination>
                        </section>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="closeRoom">取 消</el-button>
                    <el-button type="primary" @click="makesureRoom">确 定</el-button>
                </span>
                </el-dialog>
        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import {Permission} from "../../../axios/Permission"
    import geturl from '../../../globbal/url'
    import store from '../../../stores'
    import axios from 'axios'
    import { Message, MessageBox } from 'element-ui';

    export default {
        watch: {
            filterText(val) {
                this.$refs.treeFormDialog.filter(val);
            }
        },

        name: "DeviceManager",
        data() {
            return {
                //输入框规则
                rules: {
                    deviceName: [
                        {required: true, message: '请输入设备名称', trigger: 'blur'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    deviceBrand: [
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    deviceCode: [
                        {required: true, message: '请输入设备编号', trigger: 'blur'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    deviceModel: [
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    deviceType: [
                        {required: true, message: '请选择设备类型', trigger: 'focus'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    deviceTypeCode: [
                        {required: true, message: '请输入类型暗码', trigger: 'blur'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    userYear: [
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    deviceLocation: [
                        {required: true, message: '请选择设备位置', trigger: 'focus'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    deviceSupplier: [
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    mainDegree: [
                        {required: true, message: '请选择主要程度', trigger: 'blur'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur'}
                    ],
                    monthDepreciationrate: [
                        {type: 'number', message: '必须为数字值'}
                    ],
                    serviceArea: [
                        {required: true, message: '请输入服务区域', trigger: 'focus'},
                    ],
                    deviceValue: [
                        {pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '输入数字格式不正确'}
                    ],
                    deviceState: [
                        {required: true, message: '请选择设备状态', trigger: 'change'},
                    ],
                    deviceMoney: [
                        {pattern: /^[0-9]+([.]{1}[0-9]+){0,1}$/, message: '输入数字格式不正确'}
                    ]
                },
                placeId:sessionStorage.getItem("placeId"),
                params:{'placeId': sessionStorage.getItem("placeId")},
                url: '/device/list',
                downurl: geturl.allurl + '/device/export?token=' + sessionStorage.getItem("token"),
                //级联数据
                deviceTypeData: [],
                selectedOptions: [],
                //查询数据
                deviceName: '',
                deviceType: '',
                deviceLocation: '',
                deviceState: '',
                title: '',
                //弹出框
                dialog: {
                    deviceName: '',
                    deviceBrand: '',
                    deviceCode: '',
                    deviceModel: '',
                    deviceType: '',
                    deviceSupplier: '',
                    deviceLocation: '',
                    mainDegree: '',
                    monthDepreciationrate: '',
                    serviceArea: '',
                    deviceValue: '',
                    deviceState: '',
                    deviceMoney: '',
                    deviceTypeId: '',
                    deviceTypeCode: '',
                },
                dialogVisible: false,
                dialogDeviceTypeVisible: false,
                showEdit: false,
                showDetele: false,
                soururl: '',
                userStatue: false,
                //devicetype
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                //远程搜素
                restaurants: [],
                timeout: null,
                //表格
                loading: true,
                page: {
                    pageNum: 1,
                    pageSize: 20,
                },
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                }, {
                    name: '设备名称',
                    value: 'deviceName',
                    operate: true
                }, {
                    name: '设备编号',
                    value: 'deviceCode',
                    operate: true
                }, {
                    name: '设备类型',
                    value: 'deviceType',
                    operate: true
                }, {
                    name: '设备位置',
                    value: 'deviceLocation',
                    operate: true
                }, {
                    name: '服务区域',
                    value: 'serviceArea',
                    operate: true
                }, {
                    name: '状态',
                    value: 'deviceState',
                    operate: true,
                    formatter: function (row) {
                        for (let type  of store.getters.dicts.devicestatus) {
                            if (type.code === row.deviceState + '') {
                                return type.name
                            }
                        }
                        return row.deviceState
                    }
                }],

                param: null,
                placename: '',
                seltable: '',
                selall: [],
                //树
                i: 0,
                filterText: '',
                deviceTypeId: '',
                deviceTypeName: '',
                deviceTypeCode: '',

                //上传文件
                title_file:'导入',
                dialogVisible_file:false,
                downurl:'',
                upFileName:null,
                files:'',
                uploadurl:'',
                //room
                gridData:[],
                totalRoom: '',
                pageRoom: {
                    pageNum: 1,
                    pageSize: 5,
                },
                selallRoom: '',
                dialogVisible_room: false,
                roomName: '',
                roomType: '',
                roomData: [],
                radio: '',
                //空间位置
                dialogVisible_site:false,
                roomSiteData:[],
                defaultDialogProps: {
                    children: 'children',
                    label: 'name'
                },
                siteId:'',
                siteName:'',

            }
        },
        components: {
            'mini-table': Table
        },
        computed: {
            ...mapGetters({
                tableData: 'tableData',
                total: 'total',
                button: 'buttonpermission',
                dicts: 'dicts',
            }),
        },
        methods: {
            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl: 'SET_SURE_URL',
                setCheckUrl: 'SET_CHECK_URL'
            }),
            ...mapActions({
                getTableData: 'GET_TABLE_DATA',
                updateSureOK: 'UPDATE_TABLE_DATA',
                getCheakNO: 'GET_CHECK_NO'
            }),
            //空间位置
            closeSiteDialog() {
                this.dialogVisible_site = false;
            },

            isShowSiteSelect(){
                this.dialogVisible_site = true;
                //this.setCheckedKeys();
            },

            handleClickSite(data,checked, node) {
                this.i++;
                if(this.i%2 === 0){
                    if(checked){
                        this.$refs.treeSiteTypeDialog.setCheckedNodes([]);
                        this.$refs.treeSiteTypeDialog.setCheckedNodes([data]);
                        //交叉点击节点
                    }else{
                        this.$refs.treeSiteTypeDialog.setCheckedNodes([]);
                        //点击已经选中的节点，置空
                    }
                }
            },

            setCheckedKeys(){
                let ids = new Array();
                ids.push(this.form.siteId);
                var that = this;
                if (that.$refs.treeSiteTypeDialog) {
                    that.$refs.treeSiteTypeDialog.setCheckedKeys(ids);
                } else {
                    setTimeout(function() {
                            that.setCheckedKeys()
                        },
                        500)
                }
            },

            getSiteTypeCheckedKeys(data) {
                if(this.$refs.treeSiteTypeDialog.getCheckedKeys().length == 0){
                    this.siteName = '';
                    this.siteId = '';
                }else{
                    this.siteName = data.name;
                    this.siteId = data.id;
                }
            },

            sureSiteDialog:function(){
                let vm = this;
                if(this.siteName.length >0){
                    vm.dialog.serviceArea = this.siteName;
                }
                vm.dialogVisible_site = false;
            },

            //导入准备
            importfile:function(){
                this.setSureUrl('');
                this.downurl = geturl.allurl + '/device/importTemplate?token='+sessionStorage.getItem("token")+'&placeId='+Number(sessionStorage.getItem("placeId"));
                this.uploadurl = geturl.allurl + '/device/importExcel?token='+sessionStorage.getItem("token")+'&placeId='+Number(sessionStorage.getItem("placeId"));
                this.dialogVisible_file = true;
            },

            //获取文件
            getFile:function(file){
                if((file.name.indexOf(".xls") == -1) && (file.name.indexOf(".xlsx") == -1) ) {
                    this.$message.warning("只能上传xls/xlsx文件")
                    return false
                } else if(file.size > 1024*1024*5){
                    this.$message.warning("文件大小不能超过5M")
                    return false
                } else {
                    this.upFileName = file.name
                    this.files = file;
                    console.log(this.files);
                }
                return false
            },

            //上传文件
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
                        // 'Accept':'*/*',
                        // 'Accept-Encoding': 'gzip, deflate',
                        // 'Connection': 'keep-alive',
                        // 'Content-Length': '36352',
                        'Content-Type': 'multipart/form-data'
                    }
                }
                axios.post(this.uploadurl, formData, config).then(function(val){
                    if (val.data.retcode === 200) {
                        vm.dialogVisible_file = false;
                        vm.upFileName = null
                        vm.$message.success("上传成功")
                    }else  if(val.data.retcode === 400) {
                        vm.dialogVisible_file = false;
                        vm.upFileName = null
                        vm.$message.error(val.data.retmsg)
                    }else{
                        vm.dialogVisible_file = false;
                        vm.upFileName = null
                        vm.$message.error("上传失败")
                    }
                }).catch(function(error){
                    console.log(error)
                });
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },

            getCheckedKeys(data) {
                console.log(data);
                if (this.$refs.treeFormDialog.getCheckedKeys().length == 0) {
                    this.deviceTypeId = '';
                    this.deviceTypeName = '';
                    this.deviceTypeCode = '';
                } else {
                    this.deviceTypeId = data.id;
                    this.deviceTypeName = data.name;
                    this.deviceTypeCode = data.value;
                }
            },

            handleClick(data, checked, node) {
                this.i++;
                if (this.i % 2 === 0) {
                    if (checked) {
                        this.$refs.treeFormDialog.setCheckedNodes([]);
                        this.$refs.treeFormDialog.setCheckedNodes([data]);
                        //交叉点击节点
                    } else {
                        this.$refs.treeFormDialog.setCheckedNodes([]);
                        //点击已经选中的节点，置空
                    }
                }
            },

            showDeviceTypeModel() {
                this.dialogDeviceTypeVisible = true;
            },

            closeDeviceTypeDialog() {
                this.dialogDeviceTypeVisible = false;
            },

            surDeviceTypeDialog() {
                this.dialog.deviceTypeId = this.deviceTypeId;
                this.dialog.deviceType = this.deviceTypeName;
                this.dialog.deviceTypeCode = this.deviceTypeCode;
                this.dialogDeviceTypeVisible = false;
            },

            querySearchAsync(queryString, cb) {
                var result = [];
                console.log(queryString);
                if (queryString.length > 0 && queryString.length <= 20) {
                    axios({
                        method: 'post',
                        url: geturl.allurl + '/room/findRoom',
                        params: {
                            roomCode: queryString
                        }
                    }).then((res) => {
                        if (res.data.retcode === 200) {
                            if (res.data.data) {
                                for (let i = 0, l = res.data.data.length; i < l; i++) {
                                    let a = res.data.data[i].roomCode;
                                    let b = res.data.data[i].roomName;
                                    let c = res.data.data[i].id;
                                    result.push({"value": a, "address": b, "roomId": c})
                                }
                            }
                        } else {
                            result.push({
                                uuid: '-1',
                                value: '未搜索到结果！'
                            });
                        }
                    })
                }
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(result);
                }, 3000 * Math.random());
            },
            handleSelect(item) {
                console.log(item);
            },

            selectedChange(val) {
                console.log(val);
                var vm = this;
                this.selall = val;
                if (val.length > 0) {
                    this.seltable = {
                        deviceBrand: val[0].deviceBrand,
                        deviceCode: val[0].deviceCode,
                        deviceLocation: val[0].deviceLocation,
                        deviceModel: val[0].deviceModel,
                        deviceMoney: val[0].deviceMoney,
                        deviceName: val[0].deviceName,
                        deviceRatedpower: val[0].deviceRatedpower,
                        deviceRatedvoltage: val[0].deviceRatedvoltage,
                        deviceState: val[0].deviceState,
                        deviceSupplier: val[0].deviceSupplier,
                        deviceType: val[0].deviceType,
                        deviceTypeCode: val[0].deviceTypeCode,
                        deviceTypeId: val[0].deviceTypeId,
                        deviceValue: val[0].deviceValue,
                        id: val[0].id,
                        mainDegree: val[0].mainDegree,
                        monthDepreciationrate: val[0].monthDepreciationrate,
                        serviceArea: val[0].serviceArea,
                        startDate: val[0].startDate,
                        userYear: val[0].userYear,
                    };
                }
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
                this.getTableData({...this.page, ...this.placename}).then(function () {
                    vm.loading = false
                })
            },
            currentChange(val) {
                let vm = this
                this.page.pageNum = val;
                this.loading = true
                this.getTableData(this.page).then(function () {
                    vm.loading = false
                })
            },

            searchTable() {
                let vm = this
                this.loading = true
                this.getTableData({
                    ...this.page,
                    "deviceName": this.deviceName,
                    "deviceLocation": this.deviceLocation,
                    "deviceState": this.deviceState,
                    "placeId": this.placeId
                }).then(function () {
                    vm.loading = false
                })
            },

            showAddModal() {
                this.title = "新增";
                this.setSureUrl('/device/add');
                this.userStatue = false;
                this.dialogVisible = true;
            },

            exportExcel() {
                //this.setSureUrl('/device/export');
                window.location.href = geturl.allurl+"/device/export?token="+sessionStorage.getItem("token");
            },

            showEditModal() {
                this.dialog = {...this.seltable};
                this.title = "编辑";
                this.setSureUrl('/device/update');
                this.userStatue = true;
                this.dialogVisible = true;
            },
            deleteList() {
                let vm = this;
                this.setSureUrl('/device/delete');
                var ids = new Array();
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
                }).catch(_ => {
                    });
            },

            resetForm(formName) {
                let vm = this
                vm.dialogVisible = false;
                vm.$refs[formName].resetFields();
            },

            sureok: function () {
                let vm = this;
                vm.dialog.placeId = this.placeId;
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

            closeDialog: function () {
                this.resetForm('dialog');
                this.dialog.placeArea = '';
                this.dialog.placeAddress = '';
                this.dialog.placeCode = '';
                this.dialog.placeDescription = '';
                this.dialog.placeName = '';
                if (this.dialog.Id) {
                    delete this.dialog.Id;
                }
            },

            getTableByOther: function () {
                let vm = this
                this.getTableData({
                    ...this.page,
                    "placeId":vm.placeId
                }).then(function () {
                    vm.loading = false
                })
            },

            //删除空的children字段
            getMenuName(menus) {
                for (var value of menus) {
                    if (value.children) {
                        this.getMenuName(value.children)
                        if (value.children.length === 0) {
                            delete value.children
                        }
                    }
                }

                return menus
            },

            getAllDeviceType: function () {
                let vm = this
                Permission.getAllDeviceType().then(function (val) {
                    console.log(val);
                    vm.deviceTypeData = vm.getMenuName(val);
                })
            },

            //取空间台账数据
            isShowSelect() {
                let vm = this;
                axios({
                    method: 'post',
                    url: geturl.allurl + '/room/list',
                    params: {
                        ...vm.pageRoom,
                        placeId: vm.placeId,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
                this.dialogVisible_room = true;
            },
            //room列表查询
            searchRoomTable() {
                let vm = this;
                this.pageRoom.pageNum = 1;
                this.pageRoom.pageSize = 5;
                axios({
                    method: 'post',
                    url: geturl.allurl + '/room/list',
                    params: {
                        ...vm.pageRoom,
                        "placeId": vm.placeId,
                        "roomName": this.roomName,
                        "roomType": this.roomType,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
            },

            roomSizeChange(val) {
                let vm = this
                this.page.pageSize = val;
                this.loading = true;
                axios({
                    method: 'post',
                    url: geturl.allurl + '/room/list',
                    params: {
                        ...vm.pageRoom,
                        "placeId": vm.placeId,
                        "roomName": this.roomName,
                        "roomType": this.roomType,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
                vm.loading = false;
            },

            roomCurrentChange(val) {
                let vm = this
                this.pageRoom.pageNum = val;
                this.loading = true;
                axios({
                    method: 'post',
                    url: geturl.allurl + '/room/list',
                    params: {
                        ...vm.pageRoom,
                        "placeId": vm.placeId,
                        "roomName": this.roomName,
                        "roomType": this.roomType,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
                vm.loading = false;
            },

            //关闭
            closeRoom() {
                this.dialogVisible_room = false;
            },

            //确认
            makesureRoom() {
                this.dialog.deviceLocation = this.selallRoom.roomCode;
                this.dialog.roomId = this.selallRoom.id;
                this.dialogVisible_room = false;
            },

            formatter(row) {
                for (let type  of store.getters.dicts.roomtype) {
                    if (type.code === row.roomType) {
                        return type.name
                    }
                }
                return row.roomType
            },

            //列表勾选
            getTemplateRow(index, row) {
                this.selallRoom = row;
                console.log(row);
            },

            //取空间位置数据
            getRoomSiteData() {
                let vm =this
                var parms = require('qs').stringify(vm.params);
                Permission.getAllRoomSite(parms).then(function(val){
                    vm.roomSiteData = vm.getMenuName(val);
                })
            },

        },
        mounted() {
            this.setTableUrl(this.url);
            this.getTableByOther();
            this.getRoomSiteData();
            this.getAllDeviceType();
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

    .content-table{
        background-color: #f0f4f7;
        padding: 10px 20px 60px;
    }

    .content-table-room{
        background-color: #f0f4f7;
        padding: 10px;
    }
</style>
