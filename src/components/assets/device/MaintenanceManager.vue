<template>
    <div id="calendar">
        <!-- 年份 月份 -->
        <div class="month">
            <ul>
                <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
                <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
                <li class="year-month" @click="pickYear(currentYear,currentMonth)">
                    <span class="choose-year">{{ currentYear }}年{{ currentMonth }}月</span>
                </li>
                <li>
                    <el-button type="warning" icon="el-icon-search" @click="showPlanModel">计划</el-button>
                    <el-button type="warning" icon="el-icon-search" @click="showViewModel">查看</el-button>
                </li>
                <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
            </ul>
        </div>
        <!-- 星期 -->
        <ul class="weekdays">
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li style="color:red">六</li>
            <li style="color:red">日</li>
        </ul>
        <!-- 日期 -->
        <ul class="days">
            <!-- v-for循环 每一次循环用<li>标签创建一天 -->
            <li  v-for="dayobject in days" style="height: 120px;" @click="changeColor(dayobject.day,$event)">
                <!--本月-->
                <!--如果不是本月  改变类名加灰色-->

                <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>

                <!--如果是本月  还需要判断是不是这一天-->
                <span v-else>
          <!--今天  同年同月同日-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>
            </span>
                <!--显示每日任务数-->
                <span v-for="dayTaskCount in leftobj">
                       <p v-if="formatDate(dayobject.day.getFullYear(),dayobject.day.getMonth()+1,dayobject.day.getDate())==dayTaskCount.inspectionTime">任务数：<span style="color: red" >{{dayTaskCount.count}}</span></p>
                <!---->
                    </span>
            </li>
        </ul>

        <div>
            <el-dialog
                title="计划"
                :visible.sync="dialogPlanVisible"
                width="60%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
                <div>
                    <el-form :model="dialog" :rules="rules" ref="dialog" label-width="80px"  class="demo-ruleForm">
                        <el-col :span="12">
                            <el-form-item label="设备名称" prop="deviceName">
                                <el-input v-model="dialog.deviceName" @focus="isShowSelect"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类型" prop="deviceType">
                                <el-input v-model="dialog.deviceType" readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备编号" prop="deviceCode">
                                <el-input v-model="dialog.deviceCode" readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="维保人员" prop="groupUserName">
                                <el-input v-model="dialog.groupUserName" @focus="showUserModel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="维保时间" prop="time">
                                <el-date-picker
                                    type="dates"
                                    v-model="dialog.time"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                    placeholder="选择一个或多个日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="维保内容" prop="inspectionContent">
                                <el-input v-model="dialog.inspectionContent"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
                title="维保人员"
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
                title="设备名称选择"
                :modal-append-to-body="false"
                :visible.sync="dialogVisible_room"
                width="50%">
                <div>
                    <section>
                        <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
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
                                <el-button type="primary" icon="el-icon-search" @click="searchRoomTable">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </section>
                    <section  class="content-table">
                        <el-table
                            v-loading="loading"
                            element-loading-text="拼命加载中"
                            element-loading-background="rgba(255, 255, 255, 0.8)"
                            :data="gridData"
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

            <el-dialog title="查看"
                       :visible.sync="dialogViewVisible"
                       :page-size="5"
                       :modal-append-to-body="false"
                       width="60%">
                <section  class="content-table">
                <el-table :data="inspectionData" border>
                    <el-table-column property="deviceDO.deviceType" label="设备类型" ></el-table-column>
                    <el-table-column property="deviceDO.deviceName" label="设备名称" ></el-table-column>
                    <el-table-column property="deviceDO.deviceCode" label="设备编号"></el-table-column>
                    <el-table-column property="inspectionContent" label="维保内容"></el-table-column>
                    <el-table-column property="userRealName" label="维保人员"></el-table-column>
                    <el-table-column property="inspectionTime" label="维保时间"></el-table-column>
                </el-table>
                </section>
                <section class="table-content-bottom">
                    <el-pagination
                        @size-change="inspectionSizeChange"
                        @current-change="inspectionCurrentChange"
                        :page-size="5"
                        layout="prev, pager, next, jumper"
                        :total="totalInspection"
                    >
                    </el-pagination>
                </section>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeInspection">取 消</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>
<script>
    import {Permission} from "../../../axios/Permission"
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    import store from '../../../stores'
    import axios from 'axios'
    import geturl from "../../../globbal/url"

    export default {
        name: "calendar",
        data(){
            return {
                params:{'placeId': sessionStorage.getItem("placeId")},
                placeId:sessionStorage.getItem("placeId"),
                radio:'',
                currentDay: 1,
                currentMonth: 1,
                currentYear: 1970,
                currentWeek: 1,
                starttime:'',
                endtime:'',
                days: [],
                leftobj: [],    //存放剩余数量
                dialog:{
                    deviceName:'',
                    deviceType:'',
                    deviceCode:'',
                    deviceId:'',
                    groupUserName:'',
                    userId:'',
                    time:[],
                    inspectionContent:''
                },
                rules:{
                    deviceName:[
                        { required: true, message: '请选择巡检设备', trigger: 'focus' },
                        { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'focus' }
                    ],
                    deviceCode:[
                        { required: true, message: '请输入设备编号', trigger: 'focus' },
                        { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'focus' }
                    ],
                    deviceType:[
                        { required: true, message: '请输入设备类型', trigger: 'focus' },
                    ],
                    groupUserName:[
                        { required: true, message: '请选择维保人员', trigger: 'focus' },
                    ],
                    time:[
                        { required: true, message: '请选择维保时间', trigger: 'blur' },
                    ],
                    inspectionContent:[
                        { required: true, message: '请输入维保内容', trigger: 'blur' },
                        { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
                    ],
                },
                dialogPlanVisible:false,
                dialogUserVisible:false,
                dialogViewVisible:false,
                i:0,
                groupUserData:'',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                //room
                roomStatus: '',
                deviceName: '',
                deviceLocation: '',
                siteId:'',
                siteName:'',
                totalRoom:'',
                pageRoom:{
                    pageNum:1,
                    pageSize:5,
                },
                loading:true,
                gridData:'',
                selallRoom:'',
                dialogVisible_room:false,
                userRealName:'',
                userId:'',
                //inspectionData
                inspectionData:'',
                currentClickTime:'',
                pageInspection: {
                    pageNum: 1,
                    pageSize: 5,
                },
                totalInspection:'',
            }
        },
        created: function() {  //在vue初始化时调用
            this.initData(null);
        },
        methods: {
            getCheckedKeys(data) {
                if(this.$refs.treeFormDialog.getCheckedKeys().length == 0){
                    this.userRealName = '';
                    this.userId = '';
                }else{
                    this.userRealName = data.name;
                    this.userId = data.id;
                }
            },

            changeColor(dayobject,e){
                this.currentClickTime=this.formatDate(dayobject.getFullYear(),dayobject.getMonth()+1,dayobject.getDate());
                if (e.target === e.currentTarget) {
                    //从绑定目标触发
                    e.target.style.backgroundColor  = '#00B8EC';
                    var b = e.target.parentNode.children;
                    for(var i =0;i<b.length;i++) {
                        if(b[i] !== e.target) {
                            b[i].style.backgroundColor  = '#ffffff';
                        };
                    }
                }

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

            //获得所有运维团队员工
            getAllGroupUser:function(){
                let vm =this;
                var parms = require('qs').stringify(vm.params);
                Permission.getAllGroupUser(parms).then(function(val){
                    vm.groupUserData = vm.getMenuName(val);
                })
            },

            closeInspection:function(){
                this.dialogViewVisible=false;
            },

            showViewModel:function(){
                let vm = this;
                if(vm.currentClickTime.length > 0){
                    axios({
                        method: 'post',
                        url:geturl.allurl+'/inspection/list',
                        params: {
                            ...vm.pageInspection,
                            "placeId":vm.placeId,
                            "inspectionTime": vm.currentClickTime,
                        }
                    }).then((res)=>{
                        if (res.data.retcode === 200) {
                            vm.inspectionData = res.data.data.list;
                            vm.totalInspection = res.data.data.total;
                            this.dialogViewVisible=true;
                        }else{
                            vm.$message({
                                message: '服务器错误,请稍后再试',
                                type: 'info'
                            });
                        }
                    });
                }else{
                    vm.$message({
                        message: '请选择一天',
                        type: 'info'
                    });
                }
            },

            showUserModel:function(){
                console.log(this.groupUserData);
                this.dialogUserVisible=true;
            },

            closeUserDialog(){
                this.dialogUserVisible=false;
            },

            sureUserDialog(){
                this.dialog.groupUserName = this.userRealName;
                this.dialog.userId = this.userId;
                this.dialogUserVisible=false;
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

            showPlanModel:function(){
                this.dialogPlanVisible=true;
            },

            closeDialog:function(){
                if (this.$refs["dialog"]!==undefined) {
                    this.$refs["dialog"].resetFields();
                };
                this.bindSelectedTree();
                this.dialogPlanVisible=false;
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

            sureok:function(){
                    let vm =this;
                    this.$refs['dialog'].validate((valid) => {
                        if (valid) {
                            axios({
                                method: 'post',
                                url:geturl.allurl+'/inspection/add',
                                params: {
                                    ...vm.dialog,
                                    "placeId":vm.placeId,
                                }
                            }).then((res)=>{
                                if (res.data.retcode === 200) {
                                    vm.dialogPlanVisible = false;
                                    vm.$message.success("新增成功");
                                    vm.initData(null);
                                }
                            });

                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    })
                },


            initData: function(cur) {
                var leftcount=0; //存放剩余数量
                var date;
                var index=0;   //控制显示预定的天数 ，比如下面设置只能预定三天的
                //this.initleftcount(); 每次初始化更新数量
                //有两种方案  一种是每次翻页 ajax获取数据初始化   http请求过多会导致资源浪费
                // 一种是每次请求 ajax获取数据初始化    数据更新过慢会导致缺少实时性
                //还可以setTimeout 定时请求更新数据  实现数据刷新（可能会更好）
                if (cur) {
                    date = new Date(cur);
                } else {
                    var now=new Date();
                    var d = new Date(this.formatDate(now.getFullYear() , now.getMonth() , 1));
                    d.setDate(35);
                    date = new Date(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
                }
                this.currentDay = date.getDate();
                this.currentYear = date.getFullYear();
                this.currentMonth = date.getMonth() + 1;
                this.currentWeek = date.getDay(); // 1...6,0
                if (this.currentWeek == 0) {
                    this.currentWeek = 7;
                }
                var str = this.formatDate(this.currentYear , this.currentMonth, this.currentDay);
                this.days.length = 0;
                // 今天是周日，放在第一行第7个位置，前面6个
                //初始化本周
                for (var i = this.currentWeek - 1; i >= 0; i--) {
                    var d = new Date(str);
                    d.setDate(d.getDate() - i);
                    var dayobject={};
                    dayobject.day=d;
                    var now=new Date();
                    if(d.getDate()===(now.getDate())&&d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear())
                    {
                        dayobject.index=index++;//从今天开始显示供预定的数量
                    }
                    else  if(index!=0&&index<3)
                        dayobject.index=index++;//从今天开始3天内显示供预定的数量
                    this.days.push(dayobject);//将日期放入data 中的days数组 供页面渲染使用
                }
                //其他周
                for (var i = 1; i <= 35 - this.currentWeek; i++) {
                    var d = new Date(str);
                    d.setDate(d.getDate() + i);
                    var dayobject={};
                    dayobject.day=d;
                    var now=new Date();
                    if(d.getDate()===(now.getDate())&&d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear())
                    {
                        dayobject.index=index++;
                    }
                    else if(index!=0&&index<3)
                        dayobject.index=index++;
                    this.days.push(dayobject);
                }
                var d1 = this.days[0].day;
                var d2 = this.days[34].day;
                this.starttime = d1.getFullYear()+"/"+(d1.getMonth()+1)+"/"+d1.getDate();
                this.endtime = d2.getFullYear()+"/"+(d2.getMonth()+1)+"/"+d2.getDate();
                //获得任务数
                this.getDayTaskCount(this.starttime,this.endtime);
            },
            pickPre: function(year, month) {
                // setDate(0); 上月最后一天
                // setDate(-1); 上月倒数第二天
                // setDate(dx) 参数dx为 上月最后一天的前后dx天
                var d = new Date(this.formatDate(year , month , 1));
                d.setDate(0);
                this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
            },
            pickNext: function(year, month) {
                var d = new Date(this.formatDate(year , month , 1));
                d.setDate(35);
                this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
            },
            pickYear: function(year, month) {
                alert(year + "," + month);
            },
            // 返回 类似 2016-01-02 格式的字符串
            formatDate: function(year,month,day){
                var y = year;
                var m = month;
                if(m<10) m = "0" + m;
                var d = day;
                if(d<10) d = "0" + d;
                return y+"-"+m+"-"+d
            },

            //取设备台账数据
            isShowSelect(){
                let vm = this;
                axios({
                    method: 'post',
                    url:geturl.allurl+'/device/list',
                    params: {
                        ...vm.pageRoom,
                        placeId:vm.placeId,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
                this.dialogVisible_room=true;
                this.loading=false;
            },

            //设备列表查询
            searchRoomTable(){
                let vm = this;
                this.pageRoom.pageNum = 1;
                this.pageRoom.pageSize = 5;
                axios({
                    method: 'post',
                    url:geturl.allurl+'/device/list',
                    params: {
                        ...vm.pageRoom,
                        "placeId":vm.placeId,
                        "deviceName": this.deviceName,
                        "deviceLocation": this.deviceLocation,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
            },

            roomSizeChange(val){
                let vm = this
                this.page.pageSize = val;
                this.loading=true;
                axios({
                    method: 'post',
                    url:geturl.allurl+'/device/list',
                    params: {
                        ...vm.pageRoom,
                        "placeId":vm.placeId,
                        "deviceName": this.deviceName,
                        "deviceLocation": this.deviceLocation,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
                vm.loading = false;
            },

            roomCurrentChange(val){
                let vm = this
                this.pageRoom.pageNum = val;
                this.loading=true;
                axios({
                    method: 'post',
                    url:geturl.allurl+'/device/list',
                    params: {
                        ...vm.pageRoom,
                        "placeId":vm.placeId,
                        "deviceName": this.deviceName,
                        "deviceLocation": this.deviceLocation,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.gridData = res.data.data.list;
                        vm.totalRoom = res.data.data.total;
                    }
                });
                vm.loading = false;
            },

            //关闭
            closeRoom(){
                this.dialogVisible_room=false;
            },

            //确认
            makesureRoom(){
                this.dialog.deviceType = this.selallRoom.deviceType;
                this.dialog.deviceCode = this.selallRoom.deviceCode;
                this.dialog.deviceId = this.selallRoom.id;
                this.dialog.deviceName = this.selallRoom.deviceName;
                this.dialogVisible_room=false;
            },

            getTemplateRow(index,row){
                this.selallRoom = row;
                console.log(row);
            },

            //获得每天任务数
            getDayTaskCount(starttime,endtime){
                let vm = this
                axios({
                    method: 'post',
                    url:geturl.allurl+'/inspection/getDayTaskCount',
                    params: {
                        "placeId":vm.placeId,
                        "starttime": starttime,
                        "endtime": endtime,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.leftobj = res.data.data;
                        console.log(vm.leftobj);
                    }
                });
            },

            inspectionSizeChange(val){
                let vm = this
                this.pageInspection.pageSize = val;
                this.loading=true;
                axios({
                    method: 'post',
                    url:geturl.allurl+'/inspection/list',
                    params: {
                        ...vm.pageInspection,
                        "placeId":vm.placeId,
                        "inspectionTime": vm.currentClickTime,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.inspectionData = res.data.data.list;
                        vm.totalInspection = res.data.data.total;
                    }
                });
                vm.loading = false;
            },

            inspectionCurrentChange(val){
                let vm = this;
                this.pageInspection.pageNum = val;
                this.loading=true;
                axios({
                    method: 'post',
                    url:geturl.allurl+'/inspection/list',
                    params: {
                        ...vm.pageInspection,
                        "placeId":vm.placeId,
                        "inspectionTime": vm.currentClickTime,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.inspectionData = res.data.data.list;
                        vm.totalInspection = res.data.data.total;
                    }
                });
                vm.loading = false;
            },
        },
        mounted() {
            this.getAllGroupUser();
        },
    };
</script>
<style scoped>
    * {
        box-sizing: border-box;
    }
    ul {
        list-style-type: none;
    }
    body {
        font-family: Verdana, sans-serif;
        background: #E8F0F3;
    }
    #calendar{
        width:90%;
        height:760px;
        margin: 0 auto;
    }
    .month {
        height: 60px;
        width: 100%;
        background: #42b983;
    }
    .month ul {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: space-between;
    }
    .year-month {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
    .year-month:hover {
        background: rgba(150, 2, 12, 0.1);
    }
    .choose-year {
        padding-left: 20px;
        padding-right: 20px;
    }
    .choose-month {
        text-align: center;
        font-size: 1.5rem;
    }
    .arrow {
        padding: 30px;
    }
    .arrow:hover {
        background: rgba(100, 2, 12, 0.1);
    }
    .month ul li {
        color: white;
        font-size: 20px;
        text-transform: uppercase;
        letter-spacing: 3px;
    }
    .weekdays {
        margin: 0;
        padding: 10px 0;
        background-color: #42b983;
        display: flex;
        flex-wrap: wrap;
        color: #FFFFFF;
        justify-content: space-around;
    }
    .weekdays li {
        display: inline-block;
        width: 13.6%;
        text-align: center;
    }
    .days {
        padding: 0;
        background: #FFFFFF;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.1), 0 1px 5px 0 rgba(0,0,0,0.12);

    }
    .days li {
        list-style-type: none;
        display: inline-block;
        width: 14.2%;
        text-align: center;
        padding-bottom: 15px;
        padding-top: 15px;
        font-size: 1rem;
        color: #000;
        border-bottom: 1px solid #CCC;
        border-right: 1px solid #CCC;
    }
    .days li .active {
        padding: 6px 10px;
        border-radius: 50%;
        background: #00B8EC;
        color: #fff;
    }
    .days li .other-month {
        padding: 5px;
        color: gainsboro;
    }
    .days li:hover {
        background: #e1e1e1;
    }

    .myClass {
        background:#2f435e;
        color:#f2f2f2;

        padding: 10px 30px 10px 30px;
        font-size:12px;
        font-family: 微软雅黑,宋体,Arial,Helvetica,Verdana,sans-serif;
        font-weight:bold;
        border-radius:3px;

        -webkit-transition:all linear 0.30s;
        -moz-transition:all linear 0.30s;
    }
</style>
