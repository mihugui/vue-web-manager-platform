<template>
    <div class="content-operate">
        <el-row>
            <el-button type="primary" size="small" @click="deviceTypeAdd">增加</el-button>
            <el-button type="primary" size="small" @click="update">修改</el-button>
            <el-button type="danger" size="small" @click="removeone">删除</el-button>
            <el-button type="primary" size="small" @click="userManager">人员管理</el-button>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-tree
                @check-change="handleClick"
                ref="treeForm"
                :data="deviceTypeData"
                show-checkbox
                @check="getCheckedKeys"
                node-key="id"
                check-strictly
                highlight-current
                :default-expanded-keys="[1]"
                :default-checked-keys="[]"
                :props="defaultProps">
            </el-tree>
        </el-row>
        <el-dialog
            title="增加"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible"
            width="40%"
            @close="handleClose">
            <span>
                <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
                      <el-form-item  label="父节点" prop="name" >
                          <el-input v-model="form.name" disabled></el-input>
                      </el-form-item>
                     <el-form-item label="企业名称" prop="groupName" v-if="form.name == null" >
                         <el-select v-model="form.groupName" filterable clearable  placeholder="请选择" style="width:100%" @change="changeLocationValue">
                         <el-option
                             v-for="item in allEnt"
                             :key="item.id"
                             :label="item.entName"
                             :value="item.id">
                            </el-option>
                             </el-select>
                      </el-form-item>
                    <el-form-item label="节点名称" prop="groupName" v-if="form.name != null">
                         <el-input v-model="form.groupName" ></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="makesure('form')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible_1"
            width="40%"
        >
            <span>
               <el-form :model="form1" :rules="rules" ref="form1" label-width="80px" >
                    <el-form-item label="节点名称" prop="groupName" v-if="form.name != null">
                         <el-input v-model="form1.groupName" ></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="makesure_1('form1')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="人员管理"
            :modal-append-to-body="false"
            :visible.sync="dialogVisible_2"
            width="40%"
            @close="closeUserDialog"
        >
            <span>
               <el-form :model="form2" :rules="rules" ref="form2" label-width="80px" >
                    <el-form-item label="节点名称">
                         <el-input v-model="form2.groupName" ></el-input>
                    </el-form-item>
                    <el-form-item label="人员" prop="userId" >
                   <el-select v-model="form2.userId" multiple placeholder="请选择人员" style="width: 100%">
                            <el-option
                                v-for="item in allGroup"
                                :key="item.id"
                                :label="item.userRealname"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeUserDialog">取 消</el-button>
            <el-button type="primary" @click="makesure_2('form2')">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script type="text/ecmascript-6">
    import TreeMenu from '@/components/TreeMenu'
    import {mapGetters,mapMutations, mapActions} from 'vuex'
    import axios from 'axios'
    import url from "../../../globbal/url";
    import {Permission} from "../../../axios/Permission";
    import { Message, MessageBox } from 'element-ui';
    export default {
        components: {
            'tree-menu': TreeMenu
        },
        name: 'RoomSiteManager',
        data() {
            var checkGroupName = (rule, value, callback) => {
                if(this.form.name != null){
                    callback();
                    return;
                }
                let obj1 = {};
                obj1 = this.allEnt.find((item)=>{
                    return item.entName === value;
                });
                axios({
                    method: 'post',
                    url:url.allurl+'/operation/checkGroupName',
                    params: {
                        enterpriceId:obj1.entCode
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        callback();
                    }else{
                        callback(new Error('此企业的运维团队已存在,请重新选择'));
                    }
                })
            };

            return {
                placeId:sessionStorage.getItem("placeId"),
                params:{'placeId': sessionStorage.getItem("placeId")},
                deviceTypeData:[],
                form: {
                    name:'',
                    parentId: '',
                    groupName: '',
                    enterpriceId:'',
                },
                form1: {
                    parentId: '',
                    groupName: '',
                    enterpriceId:'',
                },
                form2: {
                    id:'',
                    groupName: '',
                    enterpriceId:'',
                    userId:[]
                },
                dialogVisible: false,
                dialogVisible_1: false,
                dialogVisible_2:false,
                allEnt:[],
                allGroup:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                i:0,
                checkList: ['选中且禁用','复选框 A'],
                rules: {
                    groupName: [
                        { required: true, message: '请输入节点名称', trigger: 'blur' },
                        { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' },
                        { validator: checkGroupName, trigger: 'blur' }
                    ],
                }
            };

        },
        computed:{
            ...mapGetters({
                dicts: 'dicts',
            }),
        },
        methods: {
            ...mapActions({
                axioPostNoData: 'AXIO_POST_NODATA',
            }),
            closeUserDialog(){
                this.dialogVisible_2 = false;
            },

            handleClick(data,checked, node) {
                this.i++;
                if(this.i%2 === 0){
                    if(checked){
                        this.$refs.treeForm.setCheckedNodes([]);
                        this.$refs.treeForm.setCheckedNodes([data]);
                        //交叉点击节点
                    }else{
                        this.$refs.treeForm.setCheckedNodes([]);
                        //点击已经选中的节点，置空
                    }
                }
            },
            //增加弹框关闭
            handleClose() {
                if (this.$refs["form"]!==undefined) {
                    this.$refs["form"].resetFields();
                }
            },
            //点击树触发
            getCheckedKeys(data) {
                this.form1.id = data.id;
                this.form.name = data.name;
                this.form.parentId = data.id;
                this.form.enterpriceId = data.enterpriceId
            },
            //dialog 关闭触发
            close(){
                this.dialogVisible = false;
                this.dialogVisible_1 = false;
                this.dialogVisible_2 = false;
                if (this.$refs["form"]!==undefined) {
                    this.$refs["form"].resetFields();
                };
            },
            //增加
            deviceTypeAdd(){
                this.dialogVisible = true;
            },
            //编辑
            update() {
                if(this.$refs.treeForm.getCheckedKeys().length == 0){
                    this.$message({
                        message: '请选择一个节点',
                        type: 'info'
                    });
                    return;
                }
                this.dialogVisible_1 = true;
                let vm = this;
                axios({
                    method: 'post',
                    url:url.allurl+'/operation/view',
                    params: {
                        "id":vm.form1.id,
                        state:'2'
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        this.form1 = {...res.data.data}
                    }
                })
            },
            changeLocationValue(val){
                let obj = {};
                obj = this.allEnt.find((item)=>{
                    return item.id === val;
                });
                this.form.groupName = obj.entName;
                this.form.enterpriceId = val;
            },

            //增加确定
            makesure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url:url.allurl+'/operation/add',
                            params: {
                                parentId: this.form.parentId,
                                groupName: this.form.groupName,
                                enterpriceId: this.form.enterpriceId,
                                placeId:this.placeId
                            }
                        }).then((res)=>{
                            if (res.data.retcode === 200) {
                                this.dialogVisible = false;
                                this.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                                this.getAllOperation();
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //编辑确定
            makesure_1(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url:url.allurl+'/operation/update',
                            params: {
                                "id":this.form1.id,
                                "groupName": this.form1.groupName,
                                "state":2
                            }
                        }).then((res)=>{
                            if (res.data.retcode === 200) {
                                console.log(res)
                                this.form1 = [];
                                this.dialogVisible_1 = false
                                this.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                                this.getAllOperation();
                            }
                        })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            userManager(){
                if(this.$refs.treeForm.getCheckedKeys().length == 0){
                    this.$message({
                        message: '请选择一个节点',
                        type: 'info'
                    });
                    return;
                }
                let obj = this.$refs.treeForm.getCheckedNodes();
                console.log(obj);
                this.form2.enterpriceId = obj[0].enterpriceId;
                this.form2.groupName= obj[0].name;
                this.form2.id = obj[0].id;
                axios({
                    method: 'post',
                    url:url.allurl+'/operation/getGroupUser',
                    params: {
                        groupId: this.form2.id,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        let arr = res.data.data;
                        this.form2.userId = [];
                        for(var j = 0,len=arr.length; j < len; j++) {
                            this.form2.userId[j] = arr[j].userId;
                        }
                        console.log(this.form2.userId);
                    }
                })
                this.getAllEntGroup(obj[0].enterpriceId);
                this.dialogVisible_2 = true;
            },

            //人员管理确定
            makesure_2(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url:url.allurl+'/operation/addUser',
                            params: {
                                groupId: this.form2.id,
                                userId: this.form2.userId,
                            }
                        }).then((res)=>{
                            if (res.data.retcode === 200) {
                                console.log(res)
                                this.form1 = [];
                                this.dialogVisible_1 = false
                                this.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                            }
                        })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //删除
            removeone() {
                if(this.$refs.treeForm.getCheckedKeys().length == 0){
                    this.$message({
                        message: '请选择一个节点',
                        type: 'info'
                    });
                    return;
                }
                MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
                let a= this.form1.id;
                console.log(a);
                axios({
                    method: 'post',
                    url:url.allurl+'/operation/delete',
                    params: {
                        "state":2,
                        "id":a
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        console.log(res)
                        this.$message({
                            message: res.data.retmsg,
                            type: 'success'
                        });
                        this.getAllOperation();
                    }
                })
                }).catch(_ => {
                    });
            },
            //获得所有运维团队
            getAllOperation:function(){
                let vm =this;
                var parms = require('qs').stringify(vm.params);
                Permission.getAllOperation(parms).then(function(val){
                    vm.deviceTypeData = val;
                })
            },
            //获得所有园区企业
            getAllEnt: function () {
                let vm = this;
                console.log(vm.placeId);
                axios({
                    method: 'post',
                    url:url.allurl+'/enterprise/getAllEnterpriseByPlaceId',
                    params: {
                        placeId:vm.placeId
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.allEnt = res.data.data
                    }
                })
            },
            //获得所有企业员工
            getAllEntGroup: function (value) {
                let vm = this;
                console.log(vm.placeId);
                axios({
                    method: 'post',
                    url:url.allurl+'/enterprise//findUserByManageEntId',
                    params: {
                        manageEntId:value
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        vm.allGroup = res.data.data
                    }
                })
            }
        },
        created() {
            this.getAllOperation();
        },
        mounted() {
            this.getAllEnt();
        },
    }
</script>

<style scoped>
    .content-operate {
        margin:10px 0 10px 30px;
        flex: 1;
        overflow-y: auto;
    }
</style>
