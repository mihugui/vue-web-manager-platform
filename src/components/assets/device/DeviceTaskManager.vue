<template>
    <div>
        <section style="padding-top: 10px;padding-left: 20px">
            <el-radio-group v-model="radioOperation" @change="changeRadio">
                <el-radio v-model="radio" label="1">人工报修</el-radio>
                <el-radio v-model="radio" label="2">告警报修</el-radio>
                <el-radio v-model="radio" label="3">保养计划</el-radio>
            </el-radio-group>
        </section>
        <section class="content-search">
            <div style="padding-left: 20px" v-if="showRadio1">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                    <el-form-item label="报修时间" label-width="80px">
                        <el-date-picker
                            v-model="repairsTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态" prop="siteDescribe">
                        <el-select v-model="state"  placeholder="请选择">
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

            <div style="padding-left: 20px" v-if="showRadio2">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="80px">
                    <el-form-item
                        label="告警时间" label-width="80px">
                        <el-date-picker
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
                        <el-select v-model="gjjb"  placeholder="请选择">
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

            <div style="padding-left: 20px" v-if="showRadio3">
                <el-form :inline="true" class="demo-form-inline" size="mini" label-width="80px">
                    <el-form-item
                        label="设备名称" label-width="80px">
                        <el-input v-model="deviceName3"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="siteDescribe">
                        <el-select v-model="status" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.malfunctionstate"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="searchTable3">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </section>
        <section class="content-operate" v-if="showRadio1">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showEditModal1" >编辑</el-button>
        </section>

        <section class="content-operate" v-if="showRadio2">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showEditModal2" >编辑</el-button>
        </section>

        <section class="content-operate" v-if="showRadio3">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showEditModal3" >编辑</el-button>
        </section>

        <section class="content-table">
            <div class="content-wrap" v-if="showRadio1">
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
                    @selection-change="selectedChange1"
                    :row-class-name="tableRowClassName">
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
            <div v-if="showRadio2">
                <mini-table :tableData="tableData1" :tableKey="tableKey" :total="total1"  :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
            </div>
            <div class="content-wrap" v-if="showRadio3">
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
                    @selection-change="selectedChange3"
                    :row-class-name="tableRowClassName">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" width="55" label="序号"></el-table-column>
                    <el-table-column prop="deviceDO.deviceName" label="设备名称">
                        <template slot-scope="scope">
                            <el-button @click="detailInspection(scope.row.id)" type="text">
                                {{scope.row.deviceDO.deviceName}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deviceDO[deviceType]" label="设备类型"></el-table-column>
                    <el-table-column prop="deviceDO[deviceCode]" label="设备编号"></el-table-column>
                    <el-table-column prop="inspectionContent" label="维保内容"></el-table-column>
                    <el-table-column prop="userRealName" label="维保人员"></el-table-column>
                    <el-table-column prop="inspectionTime" label="维保时间"></el-table-column>
                    <el-table-column prop="state" label="状态" :formatter="formatStatus"></el-table-column>
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
                title="设备名称选择"
                :modal-append-to-body="false"
                :visible.sync="dialogDeviceVisible"
                width="50%">
                <div>
                    <section>
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
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="searchDeviceTable">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </section>
                    <section>
                        <el-table
                            v-loading="loading"
                            element-loading-text="拼命加载中"
                            element-loading-background="rgba(255, 255, 255, 0.8)"
                            :data="deviceData"
                            highlight-current-row
                        >
                            <el-table-column width="80" label="选中">
                                <template slot-scope="scope">
                                    <el-radio  v-model="radio" :label="scope.row.id" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="deviceName" label="设备名称"></el-table-column>
                            <el-table-column prop="deviceCode" label="设备编号"></el-table-column>
                            <el-table-column prop="deviceTypeCode" label="设备类型" ></el-table-column>
                            <el-table-column prop="deviceLocation" label="设备位置" ></el-table-column>
                        </el-table>
                    </section>
                    <section class="table-content-bottom">
                        <el-pagination
                            @size-change="deviceSizeChange"
                            @current-change="deviceCurrentChange"
                            :page-size="5"
                            layout="prev, pager, next, jumper"
                            :total="totalDevice"
                        >
                        </el-pagination>
                    </section>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDevice">取 消</el-button>
                    <el-button type="primary" @click="makesureDevice">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="编辑"
                :visible.sync="dialogVisible3"
                width="60%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
                <div>
                    <el-form :model="dialog3"  ref="dialog3" label-width="80px"  class="demo-ruleForm">
                        <el-col :span="12">
                            <el-form-item label="设备名称" >
                                <el-input v-model="deviceDO.deviceName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类型" >
                                <el-input v-model="deviceDO.deviceType" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备编号" >
                                <el-input v-model="deviceDO.deviceCode" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="维保人员" >
                                <el-input v-model="dialog3.userRealName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="维保时间" >
                                <el-input v-model="dialog3.inspectionTime" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="完成时间" prop="time">
                                <el-date-picker
                                    style="width:100%"
                                    type="date"
                                    v-model="dialog3.completeTime"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="维保内容" prop="inspectionContent">
                                <el-input v-model="dialog3.inspectionContent" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="完成备注" prop="inspectionContent">
                                <el-input v-model="dialog3.remark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="sureok3">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                title="详情"
                :visible.sync="dialogViewVisible3"
                width="60%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeViewDialog3'
                style="z-index: 99999;">
                <div>
                    <el-form :model="dialog3"  ref="dialog3" label-width="80px"  class="demo-ruleForm">
                        <el-col :span="12">
                            <el-form-item label="设备名称" >
                                <el-input v-model="deviceDO.deviceName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类型" >
                                <el-input v-model="deviceDO.deviceType" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备编号" >
                                <el-input v-model="deviceDO.deviceCode" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="维保人员" >
                                <el-input v-model="dialog3.userRealName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="维保时间" >
                                <el-input v-model="dialog3.inspectionTime" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="完成时间" prop="time">
                                <el-date-picker
                                    style="width:100%"
                                    type="date"
                                    v-model="dialog3.completeTime"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="维保内容" prop="inspectionContent">
                                <el-input v-model="dialog3.inspectionContent" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="完成备注" prop="inspectionContent">
                                <el-input v-model="dialog3.remark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeViewDialog3">取 消</el-button>
            </span>
            </el-dialog>

            <el-dialog
                title="编辑"
                :visible.sync="dialogVisible1"
                width="60%"
                heigth = "80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" :rules="rules" ref="dialog" label-width="100px"  class="demo-ruleForm">
                  <el-row>
                        <el-col :span="12">
                    <el-form-item label="工单编号" prop="wordOrderCode">
                        <el-input v-model="dialog.wordOrderCode" disabled></el-input>
                    </el-form-item>
                       </el-col>
                       <el-col :span="12">
                    <el-form-item label="报修人" prop="repairsName">
                        <el-input v-model="dialog.repairsName" disabled></el-input>
                    </el-form-item>
                            </el-col>
                      </el-row>
                    <el-row>
                        <el-col :span="12">
                    <el-form-item label="报修人电话" prop="repairsUserPhone">
                        <el-input v-model="dialog.repairsUserPhone" disabled></el-input>
                    </el-form-item>
                        </el-col>
                        <el-col :span="12">
                    <el-form-item label="报修时间" prop="repairsTime ">
                        <el-input v-model="dialog.repairsTimeString" disabled></el-input>
                    </el-form-item>
                        </el-col>
                        </el-row>
                    <el-row>
                          <el-col :span="24">
                    <el-form-item label="故障描述" prop="description">
                        <el-input v-model="dialog.description" disabled></el-input>
                    </el-form-item>
                        </el-col>
                        </el-row>
                    <el-row>
                        <el-col :span="24">
                     <el-form-item label="报修地址" prop="repairsAddress">
                        <el-input v-model="dialog.repairsAddress" disabled></el-input>
                    </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row>
                        <el-col :span="24">
                     <el-form-item label="完成时间" prop="maintainEndTime">
                          <el-date-picker
                              v-model="dialog.maintainEndTime"
                              type="date"
                              value-format="yyyy/MM/dd"
                              format="yyyy/MM/dd"
                              placeholder="选择日期">
                            </el-date-picker>
                          <span style="color:red">提示：若任务尚未完成，请勿选择完成时间；</span>
                    </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row  v-for="(domain, index) in domains" :key="index">
                        <el-col :span="7">
                         <el-form-item
                             :label="'设备名称' + index"
                             :key="domain.key"
                         >
                        <el-input v-model="domain.deviceName" @focus="showDeviceDialog(index)"></el-input>
                         </el-form-item>
                        </el-col>
                        <el-col :span="7">
                         <el-form-item
                             :label="'设备编号' + index"
                             :key="domain.key"
                         >
                        <el-input v-model="domain.deviceCode"></el-input>
                         </el-form-item>
                        </el-col>
                        <el-col :span="7">
                         <el-form-item
                             :label="'维修记录' + index"
                             :key="domain.key"
                             :rules="[
      { required: true, message: '请输入维修记录', trigger: 'blur' }]"
                         >
                        <el-input v-model="domain.deviceRecord"></el-input>
                         </el-form-item>
                        </el-col>
                        <el-col :span="2" :offset="1">
                    <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                       <el-button @click="addDomain">新增设备</el-button>
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
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    import store from '../../../stores'
    import axios from 'axios'
    import url from "../../../globbal/url";
    export default {
        name: "DeviceTaskManager",
        data(){

            var checkPlaceCode = (rule, value, callback) => {
                if(this.userStatue === false){
                    this.setCheckUrl('/places/checkPlaceCode')
                    this.getCheakNO({placeCode:value}).then(function(val){
                        if(val.data.retcode === 200){
                            callback();
                        }else{
                            callback(new Error('园区编号已经存在'));
                        }
                    })}else{
                    callback()
                }
            };
            return {
                //输入框规则
                rules:{
                    description:[
                        { required: true, message: '请输入故障描述', trigger: 'blur' },
                        { min: 0, max: 50, message: '长度在 0 到 255 个字符', trigger: 'blur' }
                    ],
                    repairsAddress:[
                        { required: true, message: '请输入报修地址', trigger: 'blur' },
                        { min: 0, max: 50, message: '长度在 0 到 255 个字符', trigger: 'blur' }
                    ],
                },
                placeId:sessionStorage.getItem("placeId"),
                domains: [{
                    recordId:'',
                    deviceId:'',
                    deviceName:'',
                    deviceCode:'',
                    deviceRecord:'',
                }],
                radio: '1',
                title:'',
                url:'/malfunction/listByUser',
                //弹出框
                dialog:{
                    wordOrderCode:'',
                    repairsTimeString:'',
                    repairsUserId:'',
                    description:'',
                    repairsAddress:'',
                    repairsUserPhone:'',
                    repairsName:'',
                    maintainEndTime:'',
                    photo:'',
                },
                dialog3:{
                    completeTime:'',
                    remark:'',
                    deviceName:'',
                    deviceType:'',
                    deviceCode:'',
                    deviceId:'',
                    groupUserName:'',
                    userId:'',
                    time:[],
                    inspectionContent:''
                },
                deviceDO:{
                    deviceName:'',
                    deviceCode:'',
                    deviceType:'',
                },
                dialogVisible:false,
                dialogVisible1:false,
                dialogVisible3:false,
                showEdit:false,
                showDetele:false,
                soururl:'',
                userStatue:false,
                tableData1:null,
                total1:0,
                //设备表格
                totalDevice:0,
                deviceData: [],
                deviceName:'',
                deviceCode:'',
                deviceLocation:'',
                deviceType:'',
                dialogDeviceVisible:false,
                dialogViewVisible:false,
                recordTableData:[],
                pageDevice: {
                    pageNum: 1,
                    pageSize: 5,
                },
                currentIndex:0, //当前索引
                selallDevice:'',
                //表格
                loading:false,
                dialogViewVisible3:false,
                page:{
                    pageNum:1,
                    pageSize:10,
                },
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                },{
                    name: '工单编号',
                    value: 'wordOrderCode',
                    operate: true
                },{
                    name: '报修时间',
                    value: 'repairsTime',
                    operate: true
                },{
                    name: '报修地址',
                    value: 'repairsAddress',
                    operate: true
                },{
                    name: '故障描述',
                    value: 'description',
                    operate: true
                },{
                    name: '状态',
                    value: 'state',
                    operate: true,
                    formatter: function (row) {
                        for (let type  of store.getters.dicts.malfunctionstate) {
                            if (type.code === row.state) {
                                return type.name
                            }
                        }
                        return row.roomType
                    }
                }],
                //查询2
                gjTime:'',
                gjjb:'',
                state1:'',
                //查询3
                deviceName3:'',
                status:'',
                //查询1
                state: '',
                startdate: '',
                enddate: '',
                repairsTime:'',
                //图片列表
                fileList:[],
                param:null,
                placename:'',
                seltable:'',
                selall:[],
                selall1:[],
                selall2:[],
                selall3:[],
                radioOperation: '1',
                //显示
                showRadio1:true,
                showRadio2:false,
                showRadio3:false,
            }
        },
        components:{
            'mini-table':Table
        },
        computed:{
            ...mapGetters({
                tableData:'tableData',
                total:'total',
                dicts: 'dicts',
                button:'buttonpermission'
            }),
        },
        methods:{

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL',
                setCheckUrl:'SET_CHECK_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK : 'UPDATE_TABLE_DATA',
                getCheakNO : 'GET_CHECK_NO'
            }),

            closeViewDialog3(){
                this.dialogViewVisible3 = false;
            },

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

            //device列表查询
            searchDeviceTable() {
                let vm = this;
                this.pageDevice.pageNum = 1;
                this.pageDevice.pageSize = 5;
                axios({
                    method: 'post',
                    url: url.allurl + '/device/list',
                    params: {
                        ...vm.pageDevice,
                        "placeId": vm.placeId,
                        "deviceName": this.deviceName,
                        "deviceLocation": this.deviceLocation,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.deviceData = res.data.data.list;
                        vm.totalDevice = res.data.data.total;
                    }
                });
            },

            closeDevice(){
                this.dialogDeviceVisible = false;
            },

            //确认
            makesureDevice() {
                this.domains[this.currentIndex].deviceId = this.selallDevice.id;
                this.domains[this.currentIndex].deviceName = this.selallDevice.deviceName;
                this.domains[this.currentIndex].deviceCode = this.selallDevice.deviceCode;
                this.dialogDeviceVisible = false;
            },

            deviceSizeChange(val) {
                let vm = this
                this.loading = true;
                axios({
                    method: 'post',
                    url: url.allurl + '/device/list',
                    params: {
                        ...vm.pageDevice,
                        "placeId": vm.placeId,
                        "deviceName": this.deviceName,
                        "deviceLocation": this.deviceLocation,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.deviceData = res.data.data.list;
                        vm.totalDevice = res.data.data.total;
                    }
                });
                vm.loading = false;
            },

            deviceCurrentChange(val) {
                let vm = this
                this.pageDevice.pageNum = val;
                this.loading = true;
                axios({
                    method: 'post',
                    url: url.allurl + '/device/list',
                    params: {
                        ...vm.pageDevice,
                        "placeId": vm.placeId,
                        "deviceName": this.deviceName,
                        "deviceLocation": this.deviceLocation,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.deviceData = res.data.data.list;
                        vm.totalDevice = res.data.data.total;
                    }
                });
                vm.loading = false;
            },


            //列表勾选
            getTemplateRow(index, row) {
                this.selallDevice = row;
            },


            showDeviceDialog(index){
                this.currentIndex = index;
                let vm = this;
                axios({
                    method: 'post',
                    url: url.allurl + '/device/list',
                    params: {
                        ...vm.pageDevice,
                        placeId: vm.placeId,
                    }
                }).then((res) => {
                    if (res.data.retcode === 200) {
                        vm.deviceData = res.data.data.list;
                        vm.totalDevice = res.data.data.total;
                    }
                });
                this.dialogVisible_room = true;

                this.dialogDeviceVisible = true;
            },

            tableRowClassName({row, rowIndex}) {
                // if (rowIndex%2 != 1) {
                //     return 'warning-row';
                // }
                // return '';
            },

            searchTable1(){
                let vm = this;
                this.loading = true;
                if (vm.repairsTime === null) {
                    vm.startdate = '';
                    vm.enddate = '';
                } else {
                    vm.startdate = vm.repairsTime[0];
                    vm.enddate = vm.repairsTime[1];
                }
                this.getTableData({
                    ...this.page,
                    "placeId": this.placeId,
                    "wordOrderCode":this.wordOrderCode,
                    "state":this.state,
                    "startdate": vm.startdate,
                    "enddate": vm.enddate
                }).then(function () {
                    vm.loading = false
                })
            },

            searchTable3(){
                let vm = this;
                this.loading = true;
                this.getTableData({
                    ...this.page,
                    "placeId": this.placeId,
                    "deviceName":this.deviceName3,
                    "inspectionStatus":this.status,
                }).then(function () {
                    vm.loading = false
                })
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

            removeDomain(item) {
                var index = this.domains.indexOf(item)
                if (index !== -1) {
                    this.domains.splice(index, 1)
                }
            },
            addDomain() {
                this.domains.push({
                    recordId:'',
                    deviceId:'',
                    deviceName:'',
                    deviceCode:'',
                    deviceRecord:'',
                    key: Date.now()
                });
            },


            showEditModal1(){
                let vm = this;
                if(this.selall1[0].state === 3 ){
                    this.$message({
                        message: '此报修已完成，无法编辑',
                        type: 'info'
                    });
                    return;
                }

                if (this.selall1.length === 1) {
                    axios({
                        method: 'post',
                        url: url.allurl + '/processCenter/appointView',
                        params: {
                            id: this.selall1[0].id
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
                            var arr = res.data.data.recordDOList;
                            this.domains = [];
                            this.domains.push({
                                recordId:'',
                                deviceId:'',
                                deviceName:'',
                                deviceCode:'',
                                deviceRecord:'',
                                key: Date.now()
                            });
                            if(arr.length >0){
                                this.domains = [];
                            }
                            for(var j = 0,len=arr.length; j < len; j++) {
                                if(arr[j].tBDeviceDO == null){
                                    this.domains.push({
                                        recordId:arr[j].id,
                                        deviceId:arr[j].deviceId,
                                        deviceName:"",
                                        deviceCode:"",
                                        deviceRecord:arr[j].maintainRecord,
                                        key: Date.now()
                                    });
                                }else{
                                    this.domains.push({
                                        recordId:arr[j].id,
                                        deviceId:arr[j].deviceId,
                                        deviceName:arr[j].tBDeviceDO.deviceName,
                                        deviceCode:arr[j].tBDeviceDO.deviceCode,
                                        deviceRecord:arr[j].maintainRecord,
                                        key: Date.now()
                                    });
                                }

                            }
                        } else {
                            vm.$message.success("服务器错误,稍后重试");
                            return;
                        }
                        this.dialogVisible1=true;
                    })
                }else{
                    this.$message({
                        message: '请勾选一行数据',
                        type: 'info'
                    });
                }
            },

            showEditModal2(){

            },

            showEditModal3(){
                if(this.selall3[0].inspectionStatus==="3" ){
                    this.$message({
                        message: '此报修已完成，无法编辑',
                        type: 'info'
                    });
                    return;
                }
                if (this.selall3.length != 1) {
                    this.$message({
                        message: '请勾选一行数据',
                        type: 'info'
                    });
                    return;
                }
                this.dialog3 = this.selall3[0];
                this.deviceDO = this.dialog3.deviceDO;
                this.dialogVisible3=true;
            },

            detailInspection(id){
                let vm = this;
                axios({
                    method: 'post',
                    url:url.allurl+'/inspection/query',
                    params:{
                        id:id
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.dialog3 = res.data.data;
                        vm.deviceDO = vm.dialog3.deviceDO;
                        vm.dialogViewVisible3=true;
                    }else{
                        vm.$message.error("服务器错误,稍后重试");
                        return;
                    }
                })

            },

            formatStatus(row){
                for (let type  of store.getters.dicts.malfunctionstate) {
                    if (type.code === row.inspectionStatus) {
                        return type.name
                    }
                }
                return row.inspectionStatus
            },

            changeRadio(value){
                if(value == 1){
                    this.showRadio1=true;
                    this.showRadio2=false;
                    this.showRadio3=false;
                    this.setTableUrl('/malfunction/listByUser');
                    this.getTableData({
                        ...this.page,
                        "placeId":this.placeId,
                    });
                }else if(value == 2){
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
                    this.showRadio1=false;
                    this.showRadio2=true;
                    this.showRadio3=false;
                }else if(value ==3){
                    this.showRadio1=false;
                    this.showRadio2=false;
                    this.showRadio3=true;
                    this.setTableUrl('/inspection/listByUser');
                    this.getTableData({
                        ...this.page,
                        "placeId":this.placeId,
                    });
                }
            },

            selectedChange(val){

            },

            selectedChange1(val){
                var vm = this;
                this.selall1 = val;
                if(val.length>0){
                    this.seltable ={
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

            selectedChange3(val){
                var vm = this;
                this.selall3 = val;
                if(val.length>0){
                    this.seltable ={
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

            sizeChange(val){
                let vm = this
                this.page.pageSize = val;
                this.loading=true
                this.getTableData({...this.page,...this.placename}).then(function() {
                    vm.loading = false
                })
            },
            currentChange(val){
                let vm = this
                this.page.pageNum = val;
                this.loading=true
                this.getTableData(this.page).then(function() {
                    vm.loading = false
                })
            },

            searchTable(){
                let vm = this
                this.loading=true
                this.getTableData({...this.page,"placeName":this.placename}).then(function() {
                    vm.loading = false
                })
            },

            showAddModal(){
                this.title="新增";
                axios({
                    method: 'post',
                    url:url.allurl+'/malfunction/getAddMessage',
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        this.dialog.wordOrderCode=res.data.data.number;
                        this.dialog.repairsName=res.data.data.userName;
                        this.dialog.repairsUserPhone=res.data.data.userPhone;
                        this.dialog.repairsUserId=res.data.data.userId;
                        this.dialog.repairsTimeString=res.data.data.time;
                    }else{
                        vm.$message.success("服务器错误,稍后重试");
                        return;
                    }
                });
                this.setSureUrl('/malfunction/add');
                this.dialogVisible=true;
            },

            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.setSureUrl('/places/update');
                this.userStatue = true;
                this.dialogVisible=true;
            },


            deleteList(){
                let vm = this;
                this.setSureUrl('/places/delete');
                var ids = new Array();
                for (var item of vm.selall) {
                    ids.push(item.id)
                }
                let result = {'ids':ids}
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
                this.$confirm('确认删除？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },

            resetForm(formName) {
                let vm =this
                vm.dialogVisible = false;
                vm.$refs[formName].resetFields();
            },

            sureok:function(){
                let vm =this;
                var arr = this.domains;
                for(var j = 0,len=arr.length; j < len; j++) {
                    if(this.domains[j].deviceRecord.length===0){
                        vm.$message.warning("维修记录必须填写");
                        return;
                    }
                }
                this.$refs['dialog'].validate((valid) => {
                        if (valid) {
                            axios({
                                method: 'post',
                                url:url.allurl+'/malfunction/addRecord',
                                params:{
                                    "maintainEndTime":this.dialog.maintainEndTime,
                                    "domain":JSON.stringify(this.domains),
                                    "id":this.selall1[0].id
                                }
                            }).then((res)=>{
                                if (res.data.retcode === 200) {
                                    this.dialog.wordOrderCode=res.data.data.number;
                                    this.dialog.repairsName=res.data.data.userName;
                                    this.dialog.repairsUserPhone=res.data.data.userPhone;
                                    this.dialog.repairsUserId=res.data.data.userId;
                                    this.dialog.repairsTimeString=res.data.data.time;
                                    vm.$message.success("操作成功");
                                    this.dialogVisible1 = false;
                                    this.getTableByOther();
                                }else{
                                    vm.$message.error("服务器错误,稍后重试");
                                    return;
                                }
                            });


                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                })
            },

            sureok3:function(){
                let vm =this;
                axios({
                    method: 'post',
                    url:url.allurl+'/inspection/update',
                    params:{
                        "completeTime":this.dialog3.completeTime,
                        "remark":this.dialog3.remark,
                        "id":this.selall3[0].id
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.$message.success("编辑成功");
                        this.dialogVisible3 = false;
                        this.getTableData({
                            ...this.page,
                            "placeId":this.placeId,
                        });
                    }else{
                        vm.$message.error("服务器错误,稍后重试");
                        return;
                    }
                });

            },

            closeDialog:function(){
                this.dialogVisible1 = false;
                this.dialogVisible2 = false;
                this.dialogVisible3 = false;
            },

            getTableByOther:function(){
                let vm =this
                this.getTableData({
                    ...this.page,
                    "placeId":this.placeId,
                }).then(function() {
                    vm.loading = false
                })
            }
        },
        mounted (){
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
        height: calc(100vh - 350px);
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
