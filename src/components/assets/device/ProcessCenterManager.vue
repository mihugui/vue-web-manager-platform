<template>
    <div>
        <section style="padding-top: 10px;padding-left: 20px">
            <el-radio-group v-model="radioOperation" @change="changeRadio">
                <el-radio v-model="radio" label="1">人工报修</el-radio>
                <el-radio v-model="radio" label="2">告警报修</el-radio>
            </el-radio-group>
        </section>
        <section class="content-search">
            <div style="padding-left: 20px" v-if="!showTable">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="80px">
                    <el-form-item
                        label="报修时间" label-width="80px">
                        <el-date-picker
                            clearable
                            style="width:300px;"
                            v-model="repairsTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item
                        label="报修人" label-width="80px">
                        <el-input
                            placeholder="请输入报修人名称"
                            v-model="repairsName" clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="siteDescribe">
                        <el-select v-model="state" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.malfunctionstate"
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

            <div style="padding-left: 20px" v-if="!showTable1">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="80px">
                    <el-form-item
                        label="告警时间" label-width="80px">
                        <el-date-picker
                            clearable
                            style="width:300px;"
                            v-model="gjTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item
                        label="告警级别" label-width="80px">
                        <el-select v-model="gjjb" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.gjjb"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="siteDescribe">
                        <el-select v-model="state1" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.malfunctionstate"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchTable1">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

        </section>
        <section class="content-operate" v-if="!showTable">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">派单</el-button>
        </section>
        <section class="content-operate" v-if="!showTable1">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal1">派单</el-button>
        </section>
        <section class="content-table">
            <div v-if="!showTable"  class="content-wrap">
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
                    height="100%"
                    @selection-change="selectedChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="55" label="序号"></el-table-column>
                    <el-table-column prop="wordOrderCode" label="工单编号">
                        <template slot-scope="scope">
                             <el-button @click="detailMalfunction(scope.row.id)" type="text" >{{scope.row.wordOrderCode}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="repairsTime" label="报修时间"></el-table-column>
                    <el-table-column prop="repairsUserDO.userRealname" label="报修人"></el-table-column>
                    <el-table-column prop="repairsUserDO.userMobile" label="报修人电话"></el-table-column>
                    <el-table-column prop="repairsAddress" label="报修地址"></el-table-column>
                    <el-table-column prop="maintainUserName" label="维修人员"></el-table-column>
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
            <div v-if="!showTable1">
                <mini-table :tableData="tableData1" :tableKey="tableKey" :total="total1" :selectedChange="selectedChange"
                            :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
            </div>
        </section>
        <div>
            <el-dialog
                title="派单"
                :modal-append-to-body="false"
                :visible.sync="dialogVisible"
                @close='closeDialog'
                width="60%"
            >
            <span>
                <el-form :model="dialog" :rules="rules" ref="dialog" label-width="120px" class="demo-ruleForm">
                      <el-form-item label="维修人员指派" prop="groupUserName">
                        <el-col :span="20">
                            <el-input v-model="dialog.groupUserName" @focus="showUserModel"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="工单编号" prop="wordOrderCode">
                        <el-col :span="20">
                        <el-input v-model="dialog.wordOrderCode" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="报修人" prop="repairsName">
                        <el-col :span="20">
                        <el-input v-model="dialog.repairsName" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="报修人电话" prop="repairsUserPhone">
                        <el-col :span="20">
                        <el-input v-model="dialog.repairsUserPhone" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="报修时间" prop="repairsTime ">
                        <el-col :span="20">
                        <el-input v-model="dialog.repairsTimeString" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="故障描述" prop="description">
                        <el-col :span="20">
                        <el-input v-model="dialog.description" disabled></el-input>
                        </el-col>
                    </el-form-item>
                     <el-form-item label="报修地址" prop="repairsAddress">
                        <el-col :span="20">
                        <el-input v-model="dialog.repairsAddress" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <!--<el-form-item label="图片">-->
                              <!--<img :src="dialogImageUrl" width="60px" height="60px" alt="">-->
                             <!--<img :src="dialogImageUrl" width="60px" height="60px" alt="">-->
                        <!--<img :src="dialogImageUrl" width="60px" height="60px" alt="">-->

                    <!--</el-form-item>-->
                </el-form>
            </span>
                <span slot="footer" class="dialog-footer">
              <el-button @click="resetForm('dialog')">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                title="维保人员选择"
                :modal-append-to-body="false"
                :visible.sync="dialogUserVisible"
                width="400px"
                @close="closeUserDialog">
                    <span>
                        <el-tree
                            @check-change="handleClick"
                            ref="treeFormDialog"
                            :data="groupUserData"
                            @check="getCheckedKeys"
                            show-checkbox
                            node-key="id"
                            check-strictly
                            highlight-current
                            :default-expanded-keys="[]"
                            :default-checked-keys="[]"
                            :props="defaultProps">
                        </el-tree>
                    </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeUserDialog">取 消</el-button>
                <el-button type="primary" @click="sureUserDialog">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                title="工单详情"
                :visible.sync="dialogViewVisible"
                width="60%"
                heigth="80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeViewDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" ref="dialog" label-width="100px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="12">
                    <el-form-item label="工单编号" prop="wordOrderCode">
                        <el-input v-model="dialog.wordOrderCode" disabled></el-input>
                    </el-form-item>
                            </el-col>
                        <el-col :span="12">
                        <el-form-item label="报修时间" prop="repairsTime ">
                            <el-input v-model="dialog.repairsTimeString" disabled></el-input>
                          </el-form-item>
                        </el-col>
                  </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="报修人" prop="repairsName">
                                <el-input v-model="dialog.repairsName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                                <el-form-item label="报修人电话" prop="repairsUserPhone">
                                    <el-input v-model="dialog.repairsUserPhone" disabled></el-input>
                                </el-form-item>
                         </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                              <el-form-item label="报修地址" prop="repairsAddress">
                              <el-input v-model="dialog.repairsAddress"></el-input>
                              </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row>
                        <el-col :span="24">
                    <el-form-item label="故障描述" prop="description">
                        <el-input v-model="dialog.description"></el-input>
                    </el-form-item>
                        </el-col>
                     </el-row>
                     <!--<el-row>-->
                        <!--<el-col :span="24">-->
                             <!--<el-form-item label="图片">-->
                                      <!--<img :src="dialogImageUrl" width="60px" height="60px" alt="">-->
                                     <!--<img :src="dialogImageUrl" width="60px" height="60px" alt="">-->
                                <!--<img :src="dialogImageUrl" width="60px" height="60px" alt="">-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                     <!--</el-row>-->
                    <el-row>处理信息： </el-row>
                    <el-row>
                         <el-col :span="8">
                            <el-form-item label="维修人" prop="repairsName">
                                <el-input v-model="dialog.groupUserName" readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                                <el-form-item label="维修开始时间" prop="repairsUserPhone">
                                     <el-date-picker
                                         style="width:100%"
                                         v-model="dialog.maintainStartTime"
                                         type="date"
                                         value-format="yyyy/MM/dd"
                                         format="yyyy/MM/dd"
                                     ></el-date-picker>
                                </el-form-item>
                         </el-col>
                         <el-col :span="8">
                                <el-form-item label="维修完成时间" prop="repairsUserPhone">
                                     <el-date-picker
                                         style="width:100%"
                                         v-model="dialog.maintainEndTime"
                                         type="date"
                                         value-format="yyyy/MM/dd"
                                         format="yyyy/MM/dd"
                                        ></el-date-picker>
                                </el-form-item>
                         </el-col>
                    </el-row>
                </el-form>
                 维修清单：
                    <el-table
                        :data="recordTableData"
                        border
                        style="width: 100%;padding: 10px">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="tBDeviceDO.deviceName" label="设备名称"></el-table-column>
                        <el-table-column prop="tBDeviceDO.deviceCode" label="编号"></el-table-column>
                        <el-table-column prop="maintainRecord" label="维修记录"></el-table-column>
                        <el-table-column prop="maintainUserDO.userRealname" label="处理人员"></el-table-column>
                    </el-table>

            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeViewDialog">关 闭</el-button>
            </span>
            </el-dialog>

            <!--<el-dialog-->
            <!--title="派单"-->
            <!--:modal-append-to-body="false"-->
            <!--:visible.sync="dialogVisible1"-->
            <!--@close='closeDialog'-->
            <!--width="60%"-->
            <!--&gt;-->
            <!--<span>-->
            <!--<el-form :model="dialog1" :rules="rules" ref="dialog1" label-width="120px"  class="demo-ruleForm">-->
            <!--<el-form-item label="工单编号" prop="wordOrderCode">-->
            <!--<el-col :span="20">-->
            <!--<el-input v-model="dialog1.wordOrderCode" disabled></el-input>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="报修人" prop="repairsName">-->
            <!--<el-col :span="20">-->
            <!--<el-input v-model="dialog1.repairsName" disabled></el-input>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="报修人电话" prop="repairsUserPhone">-->
            <!--<el-col :span="20">-->
            <!--<el-input v-model="dialog1.repairsUserPhone" disabled></el-input>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="报修时间" prop="repairsTime ">-->
            <!--<el-col :span="20">-->
            <!--<el-input v-model="dialog1.repairsTimeString" disabled></el-input>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="故障描述" prop="description">-->
            <!--<el-col :span="20">-->
            <!--<el-input v-model="dialog1.description"></el-input>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="报修地址" prop="repairsAddress">-->
            <!--<el-col :span="20">-->
            <!--<el-input v-model="dialog1.repairsAddress"></el-input>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="图片">-->
            <!--<el-upload-->
            <!--class="upload-demo"-->
            <!--action="https://jsonplaceholder.typicode.com/posts/"-->
            <!--:on-preview="handlePreview"-->
            <!--:on-remove="handleRemove"-->
            <!--:before-remove="beforeRemove"-->
            <!--multiple-->
            <!--:limit="3"-->
            <!--:on-exceed="handleExceed"-->
            <!--:file-list="fileList">-->
            <!--<el-button size="small" type="primary">点击上传</el-button>-->
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            <!--</el-upload>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="维修人员指派" prop="repairsName">-->
            <!--<el-col :span="20">-->
            <!--<el-cascader-->
            <!--style="width: 100%"-->
            <!--expand-trigger="hover"-->
            <!--:options="groupUserData"-->
            <!--v-model="dialog.maintainUserId"-->
            <!--change-on-select-->
            <!--:show-all-levels="false"-->
            <!--filterable-->
            <!--&gt;</el-cascader>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
            <!--</el-form>-->
            <!--</span>-->
            <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button @click="resetForm('dialog')">取 消</el-button>-->
            <!--</span>-->
            <!--</el-dialog>-->
        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import store from '../../../stores'
    import axios from 'axios'
    import url from "../../../globbal/url";
    import {Permission} from "../../../axios/Permission"

    export default {
        name: "PlaceManager",
        data() {
            return {
                //输入框规则
                rules: {
                    description: [
                        {required: true, message: '请输入故障描述', trigger: 'blur'},
                        {min: 0, max: 50, message: '长度在 0 到 255 个字符', trigger: 'blur'}
                    ],
                    repairsAddress: [
                        {required: true, message: '请输入报修地址', trigger: 'blur'},
                        {min: 0, max: 50, message: '长度在 0 到 255 个字符', trigger: 'blur'}
                    ],
                    groupUserName:[
                        {required: true, message: '请选择维修人员', trigger: 'focus'},
                    ]
                },
                placeId: sessionStorage.getItem("placeId"),
                params: {'placeId': sessionStorage.getItem("placeId")},
                //查询
                gjTime: '',
                gjjb: '',
                state1: '',
                repairsTime: '',
                repairsName: '',
                state: '',
                startdate: '',
                enddate: '',
                groupUserData: [],
                radioOperation: '1',
                radio: '1',
                tableData1: null,
                title: '',
                dialogImageUrl: '',
                url: '/processCenter/list',
                //弹出框
                dialog: {
                    wordOrderCode: '',
                    repairsTimeString: '',
                    repairsUserId: '',
                    description: '',
                    repairsAddress: '',
                    repairsUserPhone: '',
                    repairsName: '',
                    photo: '',
                    maintainUserId: '',
                    groupUserName: '',
                    maintainStartTime:'',
                    maintainEndTime:''
                },
                maintainUserId: '',
                dialogVisible: false,
                dialogVisible1: false,
                dialogUserVisible: false,
                dialogViewVisible:false,
                showModel: false,
                soururl: '',
                userStatue: false,
                showTable: false,
                showTable1: true,
                recordTableData:[],
                //表格
                loading: true,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                },
                total1:0,
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                }, {
                    name: '工单编号',
                    value: 'wordOrderCode',
                    operate: true
                }, {
                    name: '报修时间',
                    value: 'repairsTime',
                    operate: true
                }, {
                    name: '报修人',
                    value: 'repairsUserDO.userRealname',
                    operate: true
                }, {
                    name: '报修人电话',
                    value: 'repairsUserDO.userMobile',
                    operate: true
                }, {
                    name: '报修地址',
                    value: 'repairsAddress',
                    operate: true
                }, {
                    name: '故障描述',
                    value: 'description',
                    operate: true
                }, {
                    name: '维修人员',
                    value: 'user',
                    operate: true
                }, {
                    name: '状态',
                    value: 'state',
                    operate: true,
                    formatter: function (row) {
                        if (row.state === 1) {
                            return "未处理"
                        } else if (row.state === 1) {
                            return "处理中"
                        } else if (row.state === 2) {
                            return "已完成"
                        } else {
                            return row.state
                        }
                        // for(let type  of store.getters.dicts.malfunctionstate){
                        //     if(type.code === row.state){
                        //         return type.name
                        //     }
                        // }
                        // return row.state
                    }
                }],
                state: '',
                //图片列表
                fileList: [],
                param: null,
                placename: '',
                seltable: '',
                selall: [],
                //user
                i: 0,
                userRealName: '',
                userId: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
            }
        },
        components: {
            'mini-table': Table
        },
        computed: {
            ...mapGetters({
                tableData: 'tableData',
                total: 'total',
                dicts: 'dicts',
                button: 'buttonpermission'
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

            closeViewDialog() {
                this.dialogViewVisible = false;
            },

            getCheckedKeys(data) {
                if (this.$refs.treeFormDialog.getCheckedKeys().length == 0) {
                    this.userRealName = '';
                    this.userId = '';
                } else {
                    this.userRealName = data.name;
                    this.userId = data.id;
                }
            },

            formatState:function (row) {
                if( row.state === 1){
                    return "未处理"
                }else if(row.state === 2){
                    return "处理中"
                }else if(row.state === 3){
                    return "已完成"
                }else{
                    return row.state
                }
                // for(let type  of store.getters.dicts.malfunctionstate){
                //     if(type.code === row.state){
                //         return type.name
                //     }
                // }
                // return row.state
            },

            detailMalfunction(id){
                axios({
                    method: 'post',
                    url: url.allurl + '/processCenter/appointView',
                    params: {
                        id: id
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        this.dialog.wordOrderCode = res.data.data.malfunction.wordOrderCode;
                        this.dialog.repairsName = res.data.data.malfunction.repairsUserDO.userRealname;
                        this.dialog.repairsUserPhone = res.data.data.malfunction.repairsUserDO.userMobile;
                        this.dialog.repairsUserId = res.data.data.malfunction.repairsUserDO.id;
                        this.dialog.repairsTimeString = res.data.data.malfunction.repairsTime;
                        this.dialog.repairsAddress = res.data.data.malfunction.repairsAddress;
                        this.dialog.description = res.data.data.malfunction.description;
                        this.dialog.photo = res.data.data.malfunction.photo;
                        this.dialog.maintainEndTime = res.data.data.malfunction.maintainEndTime;
                        this.dialog.maintainStartTime = res.data.data.malfunction.maintainStartTime;
                        this.dialog.groupUserName = res.data.data.maintainUser[0].maintainUserDO.userRealname;
                        this.dialog.maintainUserId = res.data.data.maintainUser[0].maintainUserDO.id;
                        this.recordTableData = res.data.data.recordDOList;
                    } else {
                        vm.$message.success("服务器错误,稍后重试");
                        return;
                    }
                })
              this.dialogViewVisible = true;
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

            showUserModel: function () {
                console.log(this.groupUserData);
                this.dialogUserVisible = true;
            },

            closeUserDialog() {
                this.dialogUserVisible = false;
            },

            sureUserDialog() {
                this.dialog.groupUserName = this.userRealName;
                this.dialog.maintainUserId = this.userId;
                this.dialogUserVisible = false;
            },

            changeRadio(value) {
                if (value == 1) {
                    this.tableKey = [{
                        name: '序号',
                        type: 'index',
                        operate: true
                    }, {
                        name: '工单编号',
                        value: 'wordOrderCode',
                        operate: true
                    }, {
                        name: '报修时间',
                        value: 'repairsTime',
                        operate: true
                    }, {
                        name: '报修人',
                        value: 'repairsUserDO.userRealname',
                        operate: true
                    }, {
                        name: '报修人电话',
                        value: 'repairsUserDO.userMobile',
                        operate: true
                    }, {
                        name: '报修地址',
                        value: 'repairsAddress',
                        operate: true
                    }, {
                        name: '故障描述',
                        value: 'description',
                        operate: true
                    }, {
                        name: '维修人员',
                        value: 'user',
                        operate: true
                    }, {
                        name: '状态',
                        value: 'state',
                        operate: true,
                        formatter: function (row) {
                            if (row.state === 1) {
                                return "未处理"
                            } else if (row.state === 1) {
                                return "处理中"
                            } else if (row.state === 2) {
                                return "已完成"
                            } else {
                                return row.state
                            }
                            // for(let type  of store.getters.dicts.malfunctionstate){
                            //     if(type.code === row.state){
                            //         return type.name
                            //     }
                            // }
                            // return row.state
                        }
                    }];
                    this.showTable = false;
                    this.showTable1 = true;
                } else {
                    this.tableKey = [{
                        name: '序号',
                        type: 'index',
                        operate: true
                    }, {
                        name: '告警编号',
                        value: 'gjbh',
                        operate: true
                    }, {
                        name: '类别',
                        value: 'lb',
                        operate: true
                    }, {
                        name: '位置',
                        value: 'wz',
                        operate: true
                    }, {
                        name: '告警级别',
                        value: 'gjjb',
                        operate: true,
                    }, {
                        name: '时间',
                        value: 'sj',
                        operate: true,
                    }, {
                        name: '故障描述',
                        value: 'gzms',
                        operate: true,
                    }, {
                        name: '状态',
                        value: 'zt',
                        operate: true,
                    }, {
                        name: '处理人员',
                        value: 'clry',
                        operate: true,
                    }];
                    this.showTable = true;
                    this.showTable1 = false;
                }
            },

            selectedChange(val) {
                var vm = this;
                this.selall = val;
                if (val.length > 0) {
                    this.seltable = {
                        "Id": val[0].id,
                        "state":val[0].state,
                    };
                }
                switch (val.length) {
                    case 0:
                        vm.showModel = false;
                        break;
                    case 1:
                        vm.showModel = true
                        break;
                    default:
                        vm.showModel = false;
                }
            },

            //图片上传
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                this.dialogVisible1 = true;
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
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
                if (vm.repairsTime === null) {
                    vm.startdate = '';
                    vm.enddate = '';
                } else {
                    vm.startdate = vm.repairsTime[0];
                    vm.enddate = vm.repairsTime[1];
                }
                this.loading = true
                this.getTableData({
                    ...this.page,
                    "repairsName": vm.repairsName,
                    "state": vm.state,
                    "startdate": vm.startdate,
                    "enddate": vm.enddate
                }).then(function () {
                    vm.loading = false
                })
            },

            searchTable1() {

            },

            showAddModal1(){
                this.$message({
                    message: '请勾选一行数据',
                    type: 'info'
                });
            },

            showAddModal() {
                if(this.seltable.state != 1){
                    this.$message.info("此报修记录已经派单");
                    return;
                }
                if (this.selall.length === 1) {
                    axios({
                        method: 'post',
                        url: url.allurl + '/processCenter/appointView',
                        params: {
                            id: this.selall[0].id
                        }
                    }).then((res) => {
                        if (res.data.retcode === 200) {
                            this.dialog.wordOrderCode = res.data.data.malfunction.wordOrderCode;
                            this.dialog.repairsName = res.data.data.malfunction.repairsUserDO.userRealname;
                            this.dialog.repairsUserPhone = res.data.data.malfunction.repairsUserDO.userMobile;
                            this.dialog.repairsUserId = res.data.data.malfunction.repairsUserDO.id;
                            this.dialog.repairsTimeString = res.data.data.malfunction.repairsTime;
                            this.dialog.repairsAddress = res.data.data.malfunction.repairsAddress;
                            this.dialog.description = res.data.data.malfunction.description;
                            this.dialog.photo = res.data.data.malfunction.photo;
                            this.dialog.groupUserName = res.data.data.maintainUser[0].maintainUserDO.userRealname;
                            this.dialog.maintainUserId = res.data.data.maintainUser[0].maintainUserDO.id;
                        } else {
                            vm.$message.success("服务器错误,稍后重试");
                            return;
                        }
                    })
                    this.dialogVisible = true;
                } else {
                    this.$message({
                        message: '请勾选一行数据',
                        type: 'info'
                    });

                }

            },

            showViewModal() {
                this.dialogVisible = true;
            },

            resetForm(formName) {
                let vm = this
                vm.dialogVisible = false;
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields();
                }
                ;
            },
            sureok: function () {
                let vm = this;
                this.$refs['dialog'].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url: url.allurl + '/processCenter/appoint',
                            params: {
                                userId: vm.dialog.maintainUserId,
                                malfunctionId: vm.selall[0].id
                            }
                        }).then((res) => {
                            if (res.data.retcode === 200) {
                                vm.$message.success("指派成功");
                                vm.dialogVisible = false;
                            } else {
                                vm.$message.error("服务器错误,稍后重试");
                                return;
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
                if (this.dialog.Id) {
                    delete this.dialog.Id;
                }
            },

            getTableByOther: function () {
                let vm = this
                this.getTableData({
                   ...this.page,
                    placeId:this.placeId,
                }).then(function () {
                    vm.loading = false
                })
            },

            handleItemChange(val) {
                let opt = this.groupUserData;
                let vm = this;
                let aa = val.map(function (value, index, array) {
                    for (var itm of opt) {
                        if (itm.value == value) {
                            opt = itm.children;
                            return itm;
                        }
                    }
                    return null;
                });
                console.log(aa[aa.length - 1]);
                this.maintainUserId = aa[aa.length - 1].id;
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
            //获得所有运维团队员工
            getAllGroupUser: function () {
                let vm = this
                var parms = require('qs').stringify(vm.params);
                Permission.getAllGroupUser(parms).then(function (val) {
                    console.log(val);
                    vm.groupUserData = vm.getMenuName(val);
                })
            }

        },
        mounted() {
            this.setTableUrl(this.url);
            this.getTableByOther();
            this.getAllGroupUser();
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
        padding: 10px 20px 60px;
        height: calc(100vh - 250px);
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

    .content-wrap {
        height:calc(100vh - 220px);
        background-color:#f0f4f7;
        display: flex;
        flex-direction:column;
    }

    .el-table .warning-row {
        background: hsla(0,0%,92%,.9);
        margin-bottom: 30px;
    }
</style>
