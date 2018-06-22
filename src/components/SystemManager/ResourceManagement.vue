<template>
   <div id="ResourceManagement">
       <el-row>
           <el-button type="primary" size="small" @click="resourceadd">增加</el-button>
           <el-button type="primary" size="small" @click="update">修改</el-button>
           <el-button type="danger" size="small" @click="removeone">删除</el-button>
       </el-row>
       <el-row style="margin-top: 20px">
           <el-tree
               @check-change="handleClick"
               ref="treeForm"
               :data="permission"
               @check="getCheckedKeys"
               show-checkbox
               node-key="id"
               check-strictly
               highlight-current
               :default-expanded-keys="[]"
               :default-checked-keys="[]"
               :props="defaultProps">
           </el-tree>
       </el-row>
       <el-dialog
           title="增加"
           :modal-append-to-body="false"
           :visible.sync="dialogVisible"
           width="60%"
           :before-close="handleClose">
            <span>
                <el-form ref="form"  label-width="80px">
                      <el-input placeholder="请点击要操作的资源" v-model="form.name" style="margin-bottom: 10px" disabled>
                         <template slot="prepend">上级资源</template>
                      </el-input>
                       <el-input placeholder="请输入资源名称" v-model="form.resourceName" style="margin-bottom: 10px">
                         <template slot="prepend">资源名称</template>
                      </el-input>
                      <el-input placeholder="请输入组件名称" v-model="form.component" style="margin-bottom: 10px">
                         <template slot="prepend">组件名称</template>
                      </el-input>
                     <el-input placeholder="请输入资源标识符" v-model="form.resourceCode" style="margin-bottom: 10px">
                         <template slot="prepend">资源标识符</template>
                      </el-input>
                     <el-input placeholder="请输入排序号" v-model="form.resourceIndex" style="margin-bottom: 10px">
                         <template slot="prepend">排序号</template>
                      </el-input>
                     <el-input placeholder="请输入图标" v-model="form.resourceIcon" style="margin-bottom: 10px">
                         <template slot="prepend">图标</template>
                      </el-input>
                    <el-input placeholder="请输入访问地址" v-model="form.resourceUrl" style="margin-bottom: 10px">
                         <template slot="prepend">访问地址</template>
                      </el-input>
                </el-form>
                <el-checkbox-group v-model="checkList">
                    <el-row style="margin-top: 10px">
                             <el-switch
                                 style="margin-right: 10px"
                                 v-model="form.value3"
                                 active-text="应用级资源"
                                 inactive-text="按钮">
                        </el-switch>
                            <el-switch
                                v-model="form.isShow"
                                active-text="显示"
                                inactive-text="不显示">
                        </el-switch>
                    </el-row>
                </el-checkbox-group>
            </span>
           <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="makesure">确 定</el-button>
            </span>
       </el-dialog>
       <el-dialog
           title="修改"
           :modal-append-to-body="false"
           :visible.sync="dialogVisible_1"
           width="60%"
           :before-close="handleClose_1">
            <span>
                <el-form ref="form"  label-width="80px">
                       <el-input placeholder="请输入资源名称" v-model="form1.resourceName" style="margin-bottom: 10px">
                         <template slot="prepend">资源名称</template>
                      </el-input>
                      <el-input placeholder="请输入组件名称" v-model="form1.component" style="margin-bottom: 10px">
                         <template slot="prepend">组件名称</template>
                      </el-input>
                     <el-input placeholder="请输入资源标识符" v-model="form1.resourceCode" style="margin-bottom: 10px">
                         <template slot="prepend">资源标识符</template>
                      </el-input>
                     <el-input placeholder="请输入排序号" v-model="form1.resourceIndex" style="margin-bottom: 10px">
                         <template slot="prepend">排序号</template>
                      </el-input>
                     <el-input placeholder="请输入图标" v-model="form1.resourceIcon" style="margin-bottom: 10px">
                         <template slot="prepend">图标</template>
                      </el-input>
                    <el-input placeholder="请输入访问地址" v-model="form1.resourceUrl" style="margin-bottom: 10px">
                         <template slot="prepend">访问地址</template>
                      </el-input>
                </el-form>
                <el-checkbox-group v-model="checkList">
                    <el-row style="margin-top: 10px">
                             <el-switch
                                 style="margin-right: 10px"
                                 v-model="form1.value3"
                                 active-text="应用级资源"
                                 inactive-text="按钮">
                        </el-switch>
                            <el-switch
                                v-model="form1.isShow"
                                active-text="显示"
                                inactive-text="不显示">
                        </el-switch>
                    </el-row>
                </el-checkbox-group>
            </span>
           <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="makesure_1">确 定</el-button>
            </span>
       </el-dialog>
   </div>

</template>
<script type="text/ecmascript-6">
   import ElRow from "element-ui/packages/row/src/row";
   import {mapGetters,mapMutations, mapActions} from 'vuex'
   import axios from 'axios'
   import url from "../../globbal/url";
   import * as types from '../../stores/mutation-types';
   export default {
       components: {ElRow},
       name: 'ResourceManagement',
       data() {
           return {
               form: {
                   parentResourceId: '',
                   resourceName: '',
                   resourceCode: '',
                   resourceIndex: '',
                   resourceUrl: '',
                   isShow: true,
                   isOne: '',
                   value3: true,
                   isButton: '',
                   resourceIcon: '',
                   component: ''
               },
               form1: {
                   parentResourceId: '',
                   resourceName: '',
                   resourceCode: '',
                   resourceIndex: '',
                   resourceUrl: '',
                   isShow: '',
                   isOne: '',
                   value3: '',
                   isButton: '',
                   resourceIcon: '',
                   component: ''
               },
               i:0,
               dialogVisible: false,
               dialogVisible_1: false,
               defaultProps: {
                   children: 'children',
                   label: 'name'
               },
               checkList: ['选中且禁用','复选框 A']
           };
       },
       computed: {
           ...mapGetters({
               permission: 'permission'
           })
       },
       methods: {
           ...mapActions({
              setAllPermission:"GET_ALL_PERMISSION"
           }),
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
               console.log(data)
               this.form1.parentResourceId = data.id
               this.form.parentResourceId = data.id
               this.form.name = data.name
           },
           close(){
               this.dialogVisible = false
               this.dialogVisible_1 = false
               this.form=[]
               this.form1=[]
               this.setAllPermission()
           },
           resourceadd(){

               this.dialogVisible = true
           },
           update() {
               this.dialogVisible_1 = true
               console.log(this.form1)
               axios({
                   method: 'post',
                   url:url.allurl+'/resource/findResourceById',
                   params: {
                       id:this.form1.parentResourceId,
                   }
               }).then((res)=>{
                   this.form=[]
                   if (res.data.retcode === 200) {
                       console.log(res.data.data)

                       this.form1.parentResourceId = res.data.data.id
                       this.form1.name = res.data.data.name
                       this.form1.resourceName = res.data.data.resourceName
                       this.form1.resourceIcon = res.data.data.resourceIcon
                       this.form1.resourceUrl = res.data.data.resourceUrl
                       this.form1.component = res.data.data.component
                       this.form1.resourceCode = res.data.data.resourceCode
                       if(res.data.data.isShow === '1'){
                           this.form1.isShow = true
                       } else {
                           this.form1.isShow = false
                       }
                       if(res.data.data.isOne === '1'){
                           this.form1.value3 = false
                       } else {
                           this.form1.value3 = true
                       }
                   }
                   console.log(this.form1)
               })
           },
           handleClose(done) {
              done();
              this.form.resourceCode = '';
              this.form.resourceIndex = '';
              this.form.resourceUrl = '';
              this.form.isShow = '';
              this.form.isOne = '';
              this.form.isButton = '';
              this.form.resourceIcon = '';
              this.form.component = '';
//              this.form=[]
               this.setAllPermission()
               console.log(this.form)
           },
           handleClose_1(done) {
               done();
               console.log(this.form)
               this.form1=[]
               this.setAllPermission()
           },
           makesure() {
               if(this.form.value3 === true) {
                   this.form.isOne = 0
                   this.form.isButton = 1
               } else {
                   this.form.isOne = 1
                   this.form.isButton = 0
               }
               if(this.form.isShow === true){
                   this.form.isShow =1
               } else {
                   this.form.isShow =0
               }
               axios({
                   method: 'post',
                   url:url.allurl+'/resource/add',
                   params: {
                       resourceCode:this.form.resourceCode,
                       parentResourceId:this.form.parentResourceId,
                       isOne:this.form.isOne,
                       isButton:this.form.isButton,
                       resourceUrl:this.form.resourceUrl,
                       resourceIcon:this.form.resourceIcon,
                       isShow:this.form.isShow,
                       resourceName:this.form.resourceName,
                       component:this.form.component
                   }
               }).then((res)=>{
                   this.form=[]
                   if (res.data.retcode === 200) {
                       console.log(res)
                       this.dialogVisible = false
                       this.$message({
                           message: res.data.retmsg,
                           type: 'success'
                       });
                       this.setAllPermission()
                   }
               })
           },
           makesure_1() {
               console.log(this.form1)
               if(this.form1.value3 === true) {
                   this.form1.isOne = 1
                   this.form1.isButton = 0
               } else {
                   this.form1.isOne = 0
                   this.form1.isButton = 1
               }
               if(this.form1.isShow === true){
                   this.form1.isShow =1
               } else {
                   this.form1.isShow =0
               }
               axios({
                   method: 'post',
                   url:url.allurl+'/resource/update',
                   params: {
                       resourceCode:this.form1.resourceCode,
                       id: this.form1.parentResourceId,
                       isOne:this.form1.isOne,
                       isButton:this.form1.isButton,
                       resourceUrl:this.form1.resourceUrl,
                       resourceIcon:this.form1.resourceIcon,
                       isShow:this.form1.isShow,
                       resourceName:this.form1.resourceName,
                       component:this.form1.component
                   }
               }).then((res)=>{
                   this.form=[]
                   if (res.data.retcode === 200) {
                       console.log(res)
                       this.form1 = [];
                       this.dialogVisible_1 = false
                       this.$message({
                           message: res.data.retmsg,
                           type: 'success'
                       });
                       this.setAllPermission()
                   }
               })
           },
           removeone() {
               console.log(this.form.parentResourceId)
               axios({
                   method: 'post',
                   url:url.allurl+'/resource/delete',
                   params: {
                       ids:JSON.stringify(this.form.parentResourceId)
                   }
               }).then((res)=>{
                   if (res.data.retcode === 200) {
                       console.log(res)
                       this.$message({
                           message: res.data.retmsg,
                           type: 'success'
                       });
                       this.setAllPermission()
                   }
               })
           }
       },
       created() {
           this.setAllPermission()
       }
   }
</script>

<style  rel="stylesheet/stylus" scoped>
</style>
