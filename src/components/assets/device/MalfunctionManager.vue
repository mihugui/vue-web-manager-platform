<template>
    <div>
        <section class="content-search">
            <div style="padding-left: 20px">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                    <el-form-item
                        label="工单编号" label-width="80px">
                        <el-input
                            placeholder="请输入工单编号"
                            v-model="wordOrderCode"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="siteDescribe">
                        <el-select v-model="state" placeholder="请选择">
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
        </section>
        <section class="content-operate">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal"
                       v-if="button.filter(btn =>{return btn.path === '/places/add'}).length!=0">新增
            </el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus"
                       v-if="showEdit "
                       @click="showEditModal">编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"
                       v-if="showDetele"
                       @click="handleClose(deleteList)">删除
            </el-button>
        </section>
        <section class="content-table">
            <div  class="content-wrap">
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
                            <el-button @click="detailMalfunction(scope.row.id)" type="text">
                                {{scope.row.wordOrderCode}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="repairsTime" label="报修时间"></el-table-column>
                    <el-table-column prop="repairsAddress" label="报修地址"></el-table-column>
                    <el-table-column prop="description" label="故障描述"></el-table-column>
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
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="60%"
                heigth="80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" :rules="rules" ref="dialog" label-width="120px" class="demo-ruleForm">
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
                        <el-input v-model="dialog.description"></el-input>
                        </el-col>
                    </el-form-item>
                     <el-form-item label="报修地址" prop="repairsAddress">
                        <el-col :span="20">
                        <el-input v-model="dialog.repairsAddress"></el-input>
                        </el-col>
                    </el-form-item>
                    <!--<el-form-item label="图片">-->
                    <!--<el-upload-->
                        <!--class="upload-demo"-->
                        <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                        <!--list-type="picture-card"-->
                        <!--:on-preview="handlePreview"-->
                        <!--:on-remove="handleRemove"-->
                        <!--:before-remove="beforeRemove"-->
                        <!--multiple-->
                        <!--:limit="3"-->
                        <!--:on-exceed="handleExceed"-->
                        <!--:file-list="fileList">-->
                         <!--<i class="el-icon-plus"></i>-->
                          <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                        <!--</el-upload>-->
                    <!--</el-form-item>-->
                </el-form>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('dialog')">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
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
                                <el-input v-model="dialog.groupUserName" readonly="readonly"></el-input>
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

        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import store from '../../../stores'
    import axios from 'axios'
    import url from "../../../globbal/url";
    import { Message, MessageBox } from 'element-ui';

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
                },
                placeId:sessionStorage.getItem("placeId"),
                title: '',
                url: '/processCenter/listByUser',
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
                    placeId:'',
                },
                dialogVisible: false,

                dialogViewVisible: false,
                dialogImageUrl: 'data:image/jpeg;base64,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',

                showEdit: false,
                showDetele: false,
                soururl: '',
                wordOrderCode:'',
                recordTableData:[],
                state:'',
                //表格
                loading: true,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                },
                state: '',
                //图片列表
                fileList: [],
                param: null,
                placename: '',
                seltable: '',
                selall: [],
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


            formatState: function (row) {
                if (row.state === 1) {
                    return "未处理"
                } else if (row.state === 2) {
                    return "处理中"
                } else if (row.state === 3) {
                    return "已完成"
                } else {
                    return row.state
                }
                // for (let type  of store.getters.dicts.malfunctionstate) {
                //     if (type.code === row.state) {
                //         return type.name
                //     }
                // }
                // return row.state
            },

            selectedChange(val) {
                var vm = this;
                this.selall = val;
                if (val.length > 0) {
                    this.seltable = {
                        "Id": val[0].id,
                        "state":val[0].state,
                        "repairsTimeString":val[0].repairsTime,
                        "repairsName":val[0].repairsUserDO.userRealname,
                        "repairsUserPhone":val[0].repairsUserDO.userMobile,
                        "repairsAddress":val[0].repairsAddress,
                        "description":val[0].description,
                        "wordOrderCode":val[0].wordOrderCode,
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

            //图片上传
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
                    "placeId": this.placeId,
                    "wordOrderCode":this.wordOrderCode,
                    "state":this.state
                    }).then(function () {
                    vm.loading = false
                })
            },

            showAddModal() {
                this.title = "新增";
                axios({
                    method: 'post',
                    url: url.allurl + '/malfunction/getAddMessage',
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        this.dialog.wordOrderCode = res.data.data.number;
                        this.dialog.repairsName = res.data.data.userName;
                        this.dialog.repairsUserPhone = res.data.data.userPhone;
                        this.dialog.repairsUserId = res.data.data.userId;
                        this.dialog.repairsTimeString = res.data.data.time;
                    } else {
                        vm.$message.success("服务器错误,稍后重试");
                        return;
                    }
                })
                this.setSureUrl('/malfunction/add');
                this.dialogVisible = true;
            },

            showEditModal() {
                if(this.seltable.state != 1){
                    this.$message.info("此报修记录已在处理,无法修改");
                    return;
                }
                this.dialog = {...this.seltable};
                this.title = "编辑";
                this.setSureUrl('/malfunction/update');
                this.userStatue = true;
                this.dialogVisible = true;
            },
            deleteList() {
                let vm = this;
                this.setSureUrl('/places/delete');
                var ids = new Array();
                for (var item of vm.selall) {
                    if(item.state != 1){
                        this.$message.info("报修记录已在处理,无法修改");
                        return;
                    }
                    ids.push(item.id);
                }
                MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
                    let result = {'ids': ids}
                    vm.updateSureOK(result).then(function (val) {
                        if (val.data.retcode === 200) {
                            vm.$message.success("删除成功");
                            vm.getTableByOther();
                        } else {
                            vm.$message.error("删除失败");
                        }
                    })
                }).catch(()=> {});
            },

            handleClose(done) {
               done();
            },

            resetForm(formName) {
                let vm = this
                vm.dialogVisible = false;
                vm.$refs[formName].resetFields();
            },

            sureok: function () {
                let vm = this;
                this.dialog.placeId = this.placeId;
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
                if (this.dialog.Id) {
                    delete this.dialog.Id;
                }
            },

            getTableByOther: function () {
                let vm = this
                this.page.placeId = this.placeId;
                this.getTableData(this.page).then(function () {
                    vm.loading = false
                })
            }

        },
        mounted() {
            this.setTableUrl(this.url);
            this.getTableByOther();
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
        height: auto;
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
        height: calc(100vh - 200px);
        background-color: #f0f4f7;
        display: flex;
        flex-direction: column;
    }

    .el-table .warning-row {
        background: hsla(0, 0%, 92%, .9);
        margin-bottom: 30px;
    }
</style>
