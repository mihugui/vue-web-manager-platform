<template>
    <div class="content-operate">
        <el-row>
            <el-button type="primary" size="small" @click="deviceTypeAdd">增加</el-button>
            <el-button type="primary" size="small" @click="update">修改</el-button>
            <el-button type="danger" size="small" @click="removeone">删除</el-button>
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
            width="60%"
            @close="handleClose"
            >
            <span>
                <el-form :model="form" :rules="rules" ref="form" label-width="150px" >
                      <el-form-item  label="父类型" prop="name" >
                        <el-input v-model="form.name"  disabled></el-input>
                      </el-form-item>
                     <el-form-item label="类型名称" prop="typename" >
                        <el-input v-model="form.typename" placeholder="请输入类型名称"></el-input>
                      </el-form-item>
                    <el-form-item label="类型编码（明码）" prop="tclasscode" >
                        <el-input v-model="form.tclasscode" ></el-input>
                      </el-form-item>
                     <el-form-item label="类型编码（暗码）" prop="tcode" >
                        <el-input v-model="form.tcode"></el-input>
                      </el-form-item>
                     <el-form-item label="类型等级" prop="tclassstate">
                       <el-select v-model="form.tclassstate" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in dicts.devicetypegrade"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
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
            width="60%"
            >
            <span>
               <el-form :model="form1" :rules="rules" ref="form1" label-width="150px" >
                     <el-form-item label="类型名称" prop="typename" >
                        <el-input v-model="form1.typename" placeholder="请输入类型名称"></el-input>
                      </el-form-item>
                    <el-form-item label="类型编码（明码）" prop="tclasscode" >
                        <el-input v-model="form1.tclasscode" ></el-input>
                      </el-form-item>
                     <el-form-item label="类型编码（暗码）" prop="tcode" >
                        <el-input v-model="form1.tcode"></el-input>
                      </el-form-item>
                     <el-form-item label="类型等级" prop="tclassstate">
                       <el-select v-model="form1.tclassstate" clearable placeholder="请选择">
                                <el-option
                                    v-for="item in dicts.devicetypegrade"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
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
            return {
                deviceTypeData:[],
                form: {
                    parentId: '',
                    typename: '',
                    tclasscode:'',
                    tcode:'',
                    tclassstate: ''
                },
                form1: {
                    parentId: '',
                    typename: '',
                    tclasscode:'',
                    tcode:'',
                    tclassstate: ''
                },
                dialogVisible: false,
                dialogVisible_1: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                i:0,
                checkList: ['选中且禁用','复选框 A'],
                rules: {
                    typename: [
                        { required: true, message: '请输入类型名称', trigger: 'blur' },
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
            //点击树触发
            getCheckedKeys(data) {
                this.form1.id = data.id;
                this.form.parentId = data.id;
                this.form.name = data.name;
            },
            //dialog 关闭触发
            close(){
                this.dialogVisible = false;
                this.dialogVisible_1 = false;
                this.$refs["form"].resetFields();
            },
            //增加
            deviceTypeAdd(){
                this.dialogVisible = true;
            },
            //增加弹框关闭
            handleClose() {
                if (this.$refs["form"]!==undefined) {
                    this.$refs["form"].resetFields();
                }
            },
            //编辑
            update() {
                if(this.$refs.treeForm.getCheckedKeys().length == 0){
                    this.$message({
                        message: '请选择一个设备类型',
                        type: 'info'
                    });
                    return;
                }
                this.dialogVisible_1 = true
                axios({
                    method: 'post',
                    url:url.allurl+'/assetType/view',
                    params: {
                        id:this.form1.id,
                    }
                }).then((res)=>{
                    if (res.data.retcode === 200) {
                        this.form1 = {...res.data.data}
                    }

                })
            },
            //增加确定
            makesure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url:url.allurl+'/assetType/add',
                            params: {
                                parentId: this.form.parentId,
                                typename: this.form.typename,
                                tclasscode: this.form.tclasscode,
                                tclassstate:this.form.tclassstate,
                                tcode:this.form.tcode
                            }
                        }).then((res)=>{
                            this.form=[]
                            if (res.data.retcode === 200) {
                                this.dialogVisible = false
                                this.$message({
                                    message: res.data.retmsg,
                                    type: 'success'
                                });
                                this.getAllDeviceType();
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
                            url:url.allurl+'/assetType/update',
                            params: {
                                id:this.form1.id,
                                typename: this.form1.typename,
                                tclasscode: this.form1.tclasscode,
                                tclassstate:this.form1.tclassstate,
                                tcode:this.form1.tcode
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
                                this.getAllDeviceType();
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
                        message: '请选择一个设备类型',
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
                        url:url.allurl+'/assetType/delete',
                        params: {
                            id:a
                        }
                    }).then((res)=>{
                        if (res.data.retcode === 200) {
                            this.$message({
                                message: res.data.retmsg,
                                type: 'success'
                            });
                            this.getAllDeviceType();
                        }
                    })
                })
                    .catch(()=> {});
            },
            //获得所有设备类型
            getAllDeviceType:function(){
                let vm =this
                Permission.getAllDeviceType().then(function(val){
                    vm.deviceTypeData = val;
                })
            }
        },
        created() {
           this.getAllDeviceType();
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
