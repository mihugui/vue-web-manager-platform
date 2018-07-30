<template>
    <div class="content-operate">
        <el-row>
            <el-button type="primary" size="small" @click="resourceadd">增加</el-button>
            <el-button type="primary" size="small" @click="update">修改</el-button>
            <el-button type="danger" size="small" @click="removeone">删除</el-button>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-tree
                @check-change="handleClick"
                ref="treeForm"
                :data="roomSiteData"
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
                      <el-form-item  label="父级位置" prop="name" >
                        <el-input v-model="form.name" placeholder="请选择父级位置" disabled></el-input>
                      </el-form-item>
                     <el-form-item label="位置名称" prop="siteName" >
                        <el-input v-model="form.siteName" placeholder="请输入位置名称"></el-input>
                      </el-form-item>
                     <el-form-item label="位置描述" prop="siteDescribe" placeholder="请输入位置描述">
                        <el-input v-model="form.siteDescribe"></el-input>
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
            width="40%">
            <span>
               <el-form :model="form1" :rules="rules" ref="form1" label-width="80px" >
                     <el-form-item label="位置名称" prop="siteName" >
                        <el-input v-model="form1.siteName" placeholder="请输入位置名称"></el-input>
                      </el-form-item>
                     <el-form-item label="位置描述" prop="siteDescribe" placeholder="请输入位置描述">
                        <el-input v-model="form1.siteDescribe"></el-input>
                      </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="makesure_1('form1')">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script type="text/ecmascript-6">
    import TreeMenu from '@/components/TreeMenu'
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
            return {
                placeId:sessionStorage.getItem("placeId"),
                params:{'placeId': sessionStorage.getItem("placeId")},
                form: {
                    parentId: '',
                    siteName: '',
                    siteDescribe: ''
                },
                form1: {
                    parentId: '',
                    siteName: '',
                    siteDescribe: ''
                },
                roomSiteData:[],
                i:0,
                dialogVisible: false,
                dialogVisible_1: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                checkList: ['选中且禁用','复选框 A'],
                rules: {
                    name: [
                        { required: true, message: '请选择父级位置', trigger: 'blur' },
                    ],
                    siteName: [
                        { required: true, message: '请输入位置名称', trigger: 'blur' },
                    ],
                }
            };

        },
        methods: {
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
            getCheckedKeys(data) {
                this.form1.id = data.id
                this.form.parentId = data.id
                this.form.name = data.name
            },
            close(){
                this.dialogVisible = false
                this.dialogVisible_1 = false
                this.$refs["form"].resetFields();
                this.$refs["form1"].resetFields();
            },
            resourceadd(){
                this.dialogVisible = true
            },
            update() {
                if(this.$refs.treeForm.getCheckedKeys().length == 0){
                    this.$message({
                        message: '请选择一个位置',
                        type: 'info'
                    });
                    return;
                }
                this.dialogVisible_1 = true
                axios({
                    method: 'post',
                    url:url.allurl+'/room/site/findRoomSiteById',
                    params: {
                        siteId:this.form1.id,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        this.form1 = {...res.data.data}
                    }
                })
            },
            //增加弹框关闭
            handleClose() {
                if (this.$refs["form"]!==undefined) {
                    this.$refs["form"].resetFields();
                }
            },
            makesure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url:url.allurl+'/room/site/add',
                            params: {
                                parentId: this.form.parentId,
                                siteName: this.form.siteName,
                                siteDescribe: this.form.siteDescribe,
                                placeId:this.placeId
                            }
                        }).then((res)=>{
                            this.form=[]
                            if (res.data.retcode === 200) {
                                this.dialogVisible = false
                                this.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                                this.getRoomSiteData();
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            makesure_1(formName) {
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            axios({
                                method: 'post',
                                url:url.allurl+'/room/site/update',
                                params: {
                                    id:this.form1.id,
                                    siteName: this.form1.siteName,
                                    siteDescribe: this.form1.siteDescribe
                                }
                            }).then((res)=>{
                                this.form=[]
                                if (res.data.retcode === 200) {
                                    this.form1 = [];
                                    this.dialogVisible_1 = false
                                    this.$message({
                                        message: res.data.retmsg,
                                        type: 'success'
                                    });
                                    this.getRoomSiteData();
                                }
                            })
                        }else {
                            console.log('error submit!!');
                            return false;
                        }
                });
            },
            removeone() {
                if(this.$refs.treeForm.getCheckedKeys().length == 0){
                    this.$message({
                        message: '请选择一个位置',
                        type: 'info'
                    });
                    return;
                }
                let vm = this;
                MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=> {
                        let a= vm.form1.id;
                        axios({
                            method: 'post',
                            url:url.allurl+'/room/site/delete',
                            params: {
                                id:a
                            }
                        }).then((res)=>{
                            if (res.data.retcode === 200) {
                                this.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                                vm.getRoomSiteData();
                            }else{
                                Message({
                                    message: res.data.retmsg,
                                    type: 'error'
                                });
                            }
                        })

                    })
                    .catch(()=> {});
            },
            //取空间位置数据
            getRoomSiteData() {
                let vm =this
                var parms = require('qs').stringify(vm.params);
                Permission.getAllRoomSite(parms).then(function(val){
                    vm.roomSiteData = val;
                    console.log(val);
                })
            }
        },
        created() {
            this.getRoomSiteData();
        }
    }
</script>

<style scoped>
    .content-operate {
        margin:10px 0 10px 30px;
        flex: 1;
        overflow-y: auto;
    }
</style>
