<template>
    <div>
        <section class="content-search">
            <el-form :inline="true" class="demo-form-inline" size="mini" label-width="80px">
                <el-form-item label="空间名称" label-width="80px">
                    <el-input
                        placeholder="请输入空间名称"
                        v-model="seatName"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="位置" label-width="80px">
                    <el-input
                        placeholder="请输入位置"
                        v-model="seatDescribe"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="状态" label-width="80px">
                    <el-select v-model="seatStatus" clearable placeholder="请选择" style="width: 100px">
                        <el-option
                            v-for="item in dicts.seatstatus"
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
            <el-button type="primary" size="mini" icon="el-icon-download" @click="importfile">导入</el-button>
            <el-button type="primary" size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele"
                       @click="deleteList">删除
            </el-button>
        </section>
        <section class="content-table">
            <div class="content-wrap">
                <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                    ref="tableTypeALL"
                    :data="tableData"
                    :key="0"
                    align="left"
                    tooltip-effect="dark"
                    style="width: 100%"
                    height="500"
                    @selection-change="selectedChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="55" label="序号"></el-table-column>
                    <el-table-column prop="seatName" label="坐席区名称">
                        <template slot-scope="scope">
                            <el-button @click="showViewModal(scope.row.id)" type="text" >{{scope.row.seatName}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="seatCode" label="坐席区编码"></el-table-column>
                    <el-table-column prop="seatCount" label="席位数"></el-table-column>
                    <el-table-column prop="seatDescribe" label="位置"></el-table-column>
                    <el-table-column prop="state" label="状态" :formatter="formatState"></el-table-column>
                </el-table>
                <el-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    :page-sizes="[10, 20, 30]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </section>
        <el-dialog
            title="增加"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible"
            width="60%"
            @close="closeAdd"
        >
                <span>
                    <el-form :model="dialog" :rules="rules" ref="dialog" label-width="80px">
                        <el-row>
                        <el-col :span="12">
                          <el-form-item label="空间名称" prop="seatName">
                              <el-input placeholder="请选择空间名称"
                                        v-model="dialog.seatName"
                                        readonly="readonly"
                                        @focus="isShowSelect">
                              </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="空间编码" prop="seatCode" :rules="[ { required: true, message: '请输入坐席区编码', trigger: 'blur' },
                            { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }]">
                              <el-input v-model="dialog.seatCode"></el-input>
                          </el-form-item>
                        </el-col>
                            </el-row>
                        <el-row>
                        <el-col :span="12">
                          <el-form-item label="位置描述" prop="seatDescribe">
                              <el-input v-model="dialog.seatDescribe"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="席位数" prop="seatCount">
                              <el-input v-model.number="dialog.seatCount"></el-input>
                          </el-form-item>
                        </el-col>
                        </el-row>
                        <el-row>
                        <el-col :span="12" v-for="(domain, index) in dialog.domains" :key="index">
                             <el-form-item
                                 :label="domain.key"
                                 :key="domain.key"
                                 :prop="'domains.' + index + '.value'"
                                 :rules="[{required: domain.require, message: domain.key+'信息不能为空', trigger: 'blur'},
                                  { min: 0, max: 255, message: '长度不要超过255个字符', trigger: 'blur' }]"
                             >
                                <el-input v-model="domain.value"></el-input>
                            </el-form-item>
                        </el-col>
                            </el-row>
                         <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="placeName">
                                <el-input v-model="dialog.remark" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                         </el-row>
                    </el-form>
                </span>
            <span slot="footer" class="dialog-footer">
                    <el-row>
                     <el-col :span="24">
                     <el-button @click="closeAdd">取 消</el-button>
                     <el-button type="primary" @click="makesure('dialog')">确 定</el-button>
                     </el-col>
                    </el-row>
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
                <section class="content-table">
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


        <el-dialog
            title="编辑"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible1"
            width="60%"
            @close="closeUpdate"
        >
            <div>
                <el-form :model="dialog1" :rules="rules" ref="dialog1" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="空间名称" prop="seatName">
                                <el-input v-model="dialog1.seatName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="空间编码" prop="seatCode" :rules="[ { required: true, message: '请输入坐席区编码', trigger: 'blur' },
                        { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }]">
                                <el-input v-model="dialog1.seatCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="位置描述" prop="seatDescribe">
                                <el-input v-model="dialog1.seatDescribe"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="席位数" prop="seatCount">
                                <el-input v-model.number="dialog1.seatCount"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12" v-for="(domain, index) in dialog1.domains" :key="index">
                            <el-form-item
                                :label="domain.key"
                                :key="domain.key"
                                :prop="'domains.' + index + '.value'"
                                :rules="[{required: domain.require, message: domain.key+'信息不能为空', trigger: 'blur'},
                              { min: 0, max: 255, message: '长度不要超过255个字符', trigger: 'blur' }]"
                            >
                                <el-input v-model="domain.value"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="placeName">
                                <el-input v-model="dialog1.remark"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-select v-model="dialog1.seatStatus" clearable placeholder="请选择" @change="currentSel"
                                           style="width: 100%">
                                    <el-option
                                        v-for="item in dicts.seatstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="rowVisible || dialog1.seatStatus != '0' ">
                        <el-col :span="12" v-if="rowVisible">
                            <el-form-item label="使用方" prop="placeName">
                                <el-input v-model="useRecordDO.useSide"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="rowVisible">
                            <el-form-item label="使用时间" prop="placeName">
                                <el-date-picker
                                    class="input-class"
                                    v-model="dialog1.time"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" v-if="rowVisible">
                            <el-form-item label="合同附件" prop="placeName">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    :action="action"
                                    :headers="importHeaders"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-upload="beforeUpload"
                                    :limit="1"
                                    :file-list="fileList"
                                >
                                    <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                                    <el-button style="margin-left: 10px;" size="small" type="success">文件下载</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="closeUpdate">取 消</el-button>
                    <el-button type="primary" @click="makesureUpdate('dialog1')">确 定</el-button>
                </span>
        </el-dialog>

        <el-dialog
            title="详情"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible2"
            width="60%"
        >
            <div>
                <el-form :model="dialog1" :rules="rules" ref="dialog1" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="空间名称">
                                <el-input v-model="dialog1.seatName" readonly="readonly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="空间编码" :rules="[ { required: true, message: '请输入坐席区编码', trigger: 'blur' },
                        { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }]">
                                <el-input v-model="dialog1.seatCode" readonly="readonly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="位置描述">
                                <el-input v-model="dialog1.seatDescribe" readonly="readonly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="席位数">
                                <el-input v-model.number="dialog1.seatCount" readonly="readonly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12" v-for="(domain, index) in dialog1.domains" :key="index">
                            <el-form-item
                                :label="domain.key"
                                :key="domain.key"
                                :prop="'domains.' + index + '.value'"
                            >
                                <el-input v-model="domain.value" readonly="readonly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="备注">
                                <el-input v-model="dialog1.remark" readonly="readonly" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-select v-model="dialog1.seatStatus" placeholder="请选择" @change="currentSel"
                                           style="width: 100%">
                                    <el-option
                                        v-for="item in dicts.seatstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    使用记录：
                    <el-table
                        :data="seatRecordData"
                        border
                        style="width: 100%;padding: 10px">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="useSide" label="使用方"></el-table-column>
                        <el-table-column prop="useStarttime" label="开始时间"></el-table-column>
                        <el-table-column prop="useEndtime" label="结束时间"></el-table-column>
                        <el-table-column prop="fileName" label="附件"></el-table-column>
                    </el-table>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="close">关 闭</el-button>
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
    </div>
</template>
<script>
    import Table from '@/components/Table';
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import geturl from '../../../globbal/url'
    import axios from 'axios'
    import store from '../../../stores'
    import {Permission} from "../../../axios/Permission";
    import { Message, MessageBox } from 'element-ui';

    export default {
        name: "PlaceManager",
        data() {
            return {
                //输入框规则
                rules: {
                    seatName: [
                        {required: true, message: '请选择坐席区名称', trigger: 'focus'},
                        {min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'focus'},
                    ],
                    //     [
                    //     { required: true, message: '请输入坐席区编码', trigger: 'blur' },
                    //     { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' },
                    //     //{ validator: checkPlaceCode, trigger: 'blur' }
                    // ],
                    seatCount: [
                        {required: true, message: '请输入席位数', trigger: 'blur'},
                        {type: 'number', message: '席位数必须为数字值'}
                    ],
                    remark: [
                        {min: 0, max: 500, message: '长度不要超过500字符', trigger: 'blur'},
                    ],
                    seatCode: [
                        {min: 0, max: 500, message: '长度不要超过500字符', trigger: 'blur'},
                    ],
                },
                placeId: sessionStorage.getItem("placeId"),
                url: '/seat/list',
                downurl: geturl.allurl + '/device/export?token=' + sessionStorage.getItem("token"),
                action: geturl.allurl + "/seat/upload?token=" + sessionStorage.getItem('token'),
                importHeaders: {
                    enctype: 'multipart/form-data',
                },
                //文件上传
                title_file:'导入',
                downurl:'',
                upFileName:null,
                files:'',
                uploadurl:'',
                dialogVisible_file:false,
                //查询数据
                seatName: '',
                seatDescribe: '',
                seatStatus: '',
                rowVisible: false,
                //空间数据
                roomData: [],
                radio: '',
                //弹出框
                dialog: {
                    seatCount: '',
                    roomId: '',
                    seatName: '',
                    seatCode: '',
                    seatDescribe: '',
                    remark: '',
                    domains: [],
                    seatStatus: '0',
                },
                dialog1: {
                    time: {},
                    seatCount: '',
                    seatName: '',
                    seatCode: '',
                    seatDescribe: '',
                    remark: '',
                    domains: [],
                    useRecordDO: null,
                    seatStatus: '',
                },
                useRecordDO: {
                    id:'',
                    useSide: '',
                    useStartTime: '',
                    useEndTime: '',
                },
                gridData: [],
                dialogVisible: false,
                dialogVisible1: false,
                dialogVisible2: false,
                dialogVisible_room: false,
                showEdit: false,
                showDetele: false,
                soururl: '',
                userStatue: false,
                conditions: '',
                roomSiteData: '',
                //room
                roomStatus: '',
                roomName: '',
                roomType: '',
                siteId: '',
                siteName: '',
                totalRoom: '',
                pageRoom: {
                    pageNum: 1,
                    pageSize: 5,
                },
                selallRoom: '',
                //record
                seatRecordData: [],
                //fileupload
                fileList: [],
                //表格
                selall: '',
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
                    name: '空间名称',
                    value: 'seatName',
                    operate: true
                }, {
                    name: '空间编码',
                    value: 'seatCode',
                    operate: true
                }, {
                    name: '席位数',
                    value: 'seatCount',
                    operate: true
                }, {
                    name: '位置',
                    value: 'seatDescribe',
                    operate: true
                }, {
                    name: '状态',
                    value: 'seatStatus',
                    operate: true,
                    formatter: function (row) {
                        for (let type  of store.getters.dicts.seatstatus) {
                            if (type.code === row.seatStatus) {
                                return type.name
                            }
                        }
                        return row.seatStatus
                    }
                }],
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

            //导入准备
            importfile:function(){
                this.setSureUrl('');
                this.downurl = geturl.allurl + '/seat/importTemplate?token='+sessionStorage.getItem("token");
                this.uploadurl = geturl.allurl + '/seat/importSeat?token='+sessionStorage.getItem("token")+'&placeId='+Number(sessionStorage.getItem("placeId"));
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


            formatState(row){
                for (let type  of store.getters.dicts.seatstatus) {
                    if (type.code === row.seatStatus) {
                        return type.name
                    }
                }
                return row.seatStatus
            },

            //文件上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            beforeUpload(file) {
                //上传前配置
                // this.importHeaders.cityCode='上海'//可以配置请求头
                // let excelfileExtend = ".xls,.xlsx"//设置文件格式
                // let fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                // if (excelfileExtend.indexOf(fileExtend) <= -1) {
                //     this.$message.error('文件格式错误')
                //     return false
                // }
                // this.uploadTip = '正在处理中...'
                // this.processing = true
            },

            closeAdd() {
                if (this.$refs["dialog"] !== undefined) {
                    this.$refs["dialog"].resetFields();
                }
                ;
                this.dialogVisible = false;
            },

            //列表勾选
            selectedChange(val) {
                var vm = this;
                this.selall = val;
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

            //查询
            searchTable() {
                let vm = this
                this.loading = true
                this.getTableData({
                    ...this.page,
                    "placeId": this.placeId,
                    "seatName": this.seatName,
                    "seatStatus": this.seatStatus,
                    "seatDescribe": this.seatDescribe
                }).then(function () {
                    vm.loading = false
                })
            },
            //导出excel
            exportExcel() {
                //this.setSureUrl('/device/export');
                window.location.href = geturl.allurl+"/seat/export?token="+sessionStorage.getItem("token")+'&placeId='+Number(sessionStorage.getItem("placeId"));
            },
            //增加
            showAddModal() {
                this.dialogVisible = true;
            },
            //编辑
            showEditModal() {
                this.dialogVisible = false;
                axios({
                    method: 'post',
                    url: geturl.allurl + '/seat/query',
                    params: {
                        "seatId": this.selall[0].id,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        this.dialog1 = res.data.data.searDO;
                        this.dialog1.domains = res.data.data.propertyValue;
                        this.useRecordDO.useSide = '';
                        if(this.dialog1.seatStatus != 0){
                            this.dialog1.time = [];
                            this.rowVisible = true;
                            this.dialog1.time[0] = res.data.data.useRecordDO.useStarttime;
                            this.dialog1.time[1]=res.data.data.useRecordDO.useEndtime;
                            this.useRecordDO.useSide = res.data.data.useRecordDO.useSide;
                            this.useRecordDO.id = res.data.data.useRecordDO.id;
                        }else{
                            this.rowVisible = false;
                        }
                    }
                });
                this.dialogVisible1 = true;
            },

            closeUpdate(){
                this.dialogVisible1 = false;
            },

            //查看
            showViewModal(id) {
                axios({
                    method: 'post',
                    url: geturl.allurl + '/seat/view',
                    params: {
                        "seatId": id,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        this.dialog1 = res.data.data.searDO;
                        this.seatRecordData = res.data.data.useRecordDO;
                        console.log(this.seatRecordData);
                        this.dialog1.domains = res.data.data.propertyValue;
                    }
                });
                this.dialogVisible2 = true;
            },

            //增加确定
            makesure(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url: geturl.allurl + '/seat/add',
                            params: {
                                ...this.dialog,
                                domains: JSON.stringify(this.dialog.domains),
                                "placeId": this.placeId
                            }
                        }).then((res) => {
                            if (res.data.retcode === 200) {
                                vm.closeAdd();
                                vm.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                                vm.getTableByOther();
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },

            //修改确定
            makesureUpdate(formName) {
                let vm = this;
                vm.dialog1.useRecordDO=null;
                if (typeof(vm.dialog1.time) == "undefined")
                {
                    vm.dialog1.time=[];
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //vm.dialog1.useRecordDO = JSON.stringify(vm.useRecordDO);
                        axios({
                            method: 'post',
                            url: geturl.allurl + '/seat/update',
                            params: {
                                ...vm.dialog1,
                                domains: JSON.stringify(vm.dialog1.domains),
                                "useRecordDO.id":vm.useRecordDO.id,
                                "useRecordDO.useSide": vm.useRecordDO.useSide,
                                "useRecordDO.useStarttime": vm.dialog1.time[0],
                                "useRecordDO.useEndtime": vm.dialog1.time[1],
                            }
                        }).then((res) => {
                            if (res.data.retcode === 200) {
                                vm.closeAdd();
                                vm.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                                vm.dialogVisible1 = false;
                                vm.getTableByOther();
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },

            //dialog 关闭触发
            close() {
                this.dialogVisible = false;
                this.dialogVisible_1 = false;
                this.dialogVisible2=false;
                this.form = ''
                this.form1 = ''
            },
            //状态选择改变
            currentSel(selVal) {
                if (selVal != 0) {
                    this.rowVisible = true;
                } else {
                    this.rowVisible = false;
                }
            },

            deleteList() {
                let vm = this;
                MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
                    var ids = new Array();
                    for (var item of vm.selall) {
                        ids.push(item.id);
                    }
                    let result = {'ids':ids};
                    this.setSureUrl('/seat/batchDelete');
                    vm.updateSureOK(result).then(function (val) {
                        if (val.data.retcode === 200) {
                            vm.$message.success("删除成功");
                            vm.getTableByOther();
                        } else {
                            vm.$message.error("删除失败");
                        }
                    });

                }).catch(()=> {});
            },

            resetForm(formName) {
                let vm = this
                vm.dialogVisible = false;
                vm.$refs[formName].resetFields();
            },

            getTableByOther: function () {
                let vm = this
                this.getTableData({
                    ...this.page,
                    "placeId":this.placeId,
                }).then(function () {
                    vm.loading = false
                })
            },

            //取坐席区动态字段
            addDomain() {
                axios({
                    method: 'post',
                    url: geturl.allurl + '/seat/property/getAllProperty?token=' + sessionStorage.getItem('token'),
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        this.dialog.domains = res.data.data;
                    }
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
                console.log(this.selallRoom);
                this.dialog.seatName = this.selallRoom.roomName;
                this.dialog.roomId = this.selallRoom.id;
                this.dialog.seatCode = this.selallRoom.roomCode;
                this.dialog.seatDescribe = this.selallRoom.roomName;
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

        },

        created() {
            this.addDomain();
        },

        mounted() {
            this.setTableUrl(this.url);
            this.getTableByOther();
            // this.getAllDeviceType();
        },
    }
</script>
<style scoped>
    .content-search {
        background-color: #fff;
        border-bottom: 2px solid hsla(0, 0%, 92%, .9);
        margin: 20px 0 0 0;
        width: 100%;
    }

    .content-operate {
        margin: 10px 0 10px 30px;
        flex: 1;
        overflow-y: auto;
    }

    .content-table {
        background-color: #f0f4f7;
        padding: 10px 20px 40px;
    }

    .content-wrap {
        height:calc(100vh - 200px);
        background-color:#f0f4f7;
        display: flex;
        flex-direction:column;
    }

    .el-pagination{
        position: relative;
        margin-top: 0px;
    }

    .el-table .warning-row {
        background: hsla(0,0%,92%,.9);
        margin-bottom: 30px;
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

    .input-class {
        width: 100%;
    }
</style>
