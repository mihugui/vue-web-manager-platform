<template>
   <div class="content-operate">
       <el-row>
           <el-button type="primary" size="small" @click="resourceadd">增加</el-button>
           <el-button type="primary" size="small" @click="update">修改</el-button>
           <el-button type="primary" size="small" @click="changeDR">数据资源</el-button>
           <el-button type="danger" size="small" @click="deletesure(removeone)">删除</el-button>
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
           @close="handleClose">
            <span>
                <el-form :model="form" :rules="rules" ref="form" label-width="120px"  class="demo-ruleForm">
                    <el-form-item label="上级资源" prop="name">
                        <el-col :span="20">
                        <el-input v-model="form.name" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="资源名称" prop="resourceName">
                        <el-col :span="20">
                        <el-input v-model="form.resourceName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="组件名称" prop="component">
                        <el-select v-model="form.component" clearable placeholder="具体页面需要选择对应组件">
                            <el-option
                                v-for="item in dicts.component"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源标识符" prop="resourceCode">
                        <el-col :span="20">
                        <el-input placeholder="应用级资源需要填写" v-model="form.resourceCode"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="排序号" prop="resourceIndex">
                        <el-col :span="20">
                        <el-input v-model="form.resourceIndex"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="图标" prop="resourceIcon">
                        <el-select v-model="form.resourceIcon" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.icon"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px"><i :class="item.name"></i></span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="访问地址" prop="resourceUrl">
                        <el-col :span="20">
                        <el-input placeholder="页面资源需要填写(唯一)" v-model="form.resourceUrl"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="应用级资源" prop="isOne">
                        <el-switch v-model="form.isOne"></el-switch>
                    </el-form-item>
                    <el-form-item label="按钮" prop="isButton">
                        <el-switch v-model="form.isButton"></el-switch>
                    </el-form-item>
                    <el-form-item label="显示" prop="isShow">
                        <el-switch v-model="form.isShow"></el-switch>
                    </el-form-item>
                    <el-form-item label="园区" prop="placeId">
                        <el-select v-model="form.placeId" clearable placeholder="请选择">
                            <el-option
                                v-for="item in allPlace"
                                :key="item.id"
                                :label="item.placeName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>



                <!--<el-form ref="form"  label-width="80px">-->
                      <!--<el-input placeholder="请点击要操作的资源" v-model="form.name" style="margin-bottom: 10px" disabled>-->
                         <!--<template slot="prepend">上级资源</template>-->
                      <!--</el-input>-->
                       <!--<el-input placeholder="请输入资源名称" v-model="form.resourceName" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">资源名称</template>-->
                      <!--</el-input>-->
                      <!--<el-input placeholder="请输入组件名称" v-model="form.component" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">组件名称</template>-->
                      <!--</el-input>-->
                     <!--<el-input placeholder="请输入资源标识符" v-model="form.resourceCode" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">资源标识符</template>-->
                      <!--</el-input>-->
                     <!--<el-input placeholder="请输入排序号" v-model="form.resourceIndex" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">排序号</template>-->
                      <!--</el-input>-->
                     <!--<el-input placeholder="请输入图标" v-model="form.resourceIcon" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">图标</template>-->
                      <!--</el-input>-->
                    <!--<el-input placeholder="请输入访问地址" v-model="form.resourceUrl" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">访问地址</template>-->
                      <!--</el-input>-->
                <!--</el-form>-->
                <!--<el-checkbox-group v-model="checkList">-->
                    <!--<el-row style="margin-top: 10px">-->
                             <!--<el-switch-->
                                 <!--style="margin-right: 10px"-->
                                 <!--v-model="form.value3"-->
                                 <!--active-text="应用级资源"-->
                                 <!--inactive-text="按钮">-->
                        <!--</el-switch>-->
                            <!--<el-switch-->
                                <!--v-model="form.isShow"-->
                                <!--active-text="显示"-->
                                <!--inactive-text="不显示">-->
                        <!--</el-switch>-->
                    <!--</el-row>-->
                <!--</el-checkbox-group>-->
                <!--<el-checkbox label="应用级资源" v-model="form.isOne"></el-checkbox>-->
                <!--<el-checkbox label="按钮" v-model="form.isButton"></el-checkbox>-->
                <!--<el-checkbox label="显示" v-model="form.isShow"></el-checkbox>-->

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
           @close="handleClose_1">
            <span>
                <el-form :model="form1" :rules="rules" ref="form1" label-width="120px"  class="demo-ruleForm">
                    <el-form-item label="上级资源" prop="name" v-show="false">
                        <el-col :span="20">
                        <el-input v-model="form1.name" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="资源名称" prop="resourceName">
                        <el-col :span="20">
                        <el-input v-model="form1.resourceName"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="组件名称" prop="component">
                        <el-select v-model="form1.component" clearable placeholder="具体页面需要选择对应组件">
                            <el-option
                                v-for="item in dicts.component"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="资源标识符" prop="resourceCode">
                        <el-col :span="20">
                        <el-input placeholder="应用级资源需要填写" v-model="form1.resourceCode"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="排序号" prop="resourceIndex">
                        <el-col :span="20">
                        <el-input v-model="form1.resourceIndex"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="图标" prop="resourceIcon">
                        <el-select v-model="form1.resourceIcon" clearable placeholder="请选择">
                            <el-option
                                v-for="item in dicts.icon"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px"><i :class="item.name"></i></span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="访问地址" prop="resourceUrl">
                        <el-col :span="20">
                        <el-input v-model="form1.resourceUrl"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="应用级资源" prop="isOne">
                        <el-switch v-model="form1.isOne"></el-switch>
                    </el-form-item>
                    <el-form-item label="按钮" prop="isButton">
                        <el-switch v-model="form1.isButton"></el-switch>
                    </el-form-item>
                    <el-form-item label="显示" prop="isShow">
                        <el-switch v-model="form1.isShow"></el-switch>
                    </el-form-item>
                    <el-form-item label="园区" prop="placeId">
                        <el-select v-model="form1.placeId" clearable placeholder="请选择">
                            <el-option
                                v-for="item in allPlace"
                                :key="item.id"
                                :label="item.placeName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!--<el-form ref="form"  label-width="80px">-->
                       <!--<el-input placeholder="请输入资源名称" v-model="form1.resourceName" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">资源名称</template>-->
                      <!--</el-input>-->
                      <!--<el-input placeholder="请输入组件名称" v-model="form1.component" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">组件名称</template>-->
                      <!--</el-input>-->
                     <!--<el-input placeholder="请输入资源标识符" v-model="form1.resourceCode" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">资源标识符</template>-->
                      <!--</el-input>-->
                     <!--<el-input placeholder="请输入排序号" v-model="form1.resourceIndex" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">排序号</template>-->
                      <!--</el-input>-->
                     <!--<el-input placeholder="请输入图标" v-model="form1.resourceIcon" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">图标</template>-->
                      <!--</el-input>-->
                    <!--<el-input placeholder="请输入访问地址" v-model="form1.resourceUrl" style="margin-bottom: 10px">-->
                         <!--<template slot="prepend">访问地址</template>-->
                      <!--</el-input>-->
                <!--</el-form>-->
                <!--<el-checkbox-group v-model="checkList">-->
                    <!--<el-row style="margin-top: 10px">-->
                             <!--<el-switch-->
                                 <!--style="margin-right: 10px"-->
                                 <!--v-model="form1.value3"-->
                                 <!--active-text="应用级资源"-->
                                 <!--inactive-text="按钮">-->
                        <!--</el-switch>-->
                            <!--<el-switch-->
                                <!--v-model="form1.isShow"-->
                                <!--active-text="显示"-->
                                <!--inactive-text="不显示">-->
                        <!--</el-switch>-->
                    <!--</el-row>-->
                <!--</el-checkbox-group>-->
                <!--<el-checkbox label="应用级资源" v-model="form1.isOne"></el-checkbox>-->
                <!--<el-checkbox label="按钮" v-model="form1.isButton"></el-checkbox>-->
                <!--<el-checkbox label="显示" v-model="form1.isShow"></el-checkbox>-->
            </span>
           <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="makesure_1">确 定</el-button>
            </span>
       </el-dialog>
       <el-dialog
           title="增加"
           :modal-append-to-body="false"
           :visible.sync="dialogVisible_data"
           :close-on-click-modal="false"
           width="60%"
           @close="handleClose_data">
           <span>
               <table-info-option  ref="tableInfo" :resource="selectInfo" :dataInfo="dataInfo" ></table-info-option>
           </span>
           <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="makesure_data">确 定</el-button>
            </span>
       </el-dialog>
   </div>

</template>
<script type="text/ecmascript-6">
   import ElRow from "element-ui/packages/row/src/row";
   import {mapGetters,mapMutations, mapActions} from 'vuex'
   import axios from 'axios'
   import url from "../../globbal/url";
   import OptionPage from '@/components/ImportSystem/OptionPage'
   import * as types from '../../stores/mutation-types';
   export default {
       components: {ElRow},
       name: 'ResourceManagement',
       data() {
           return {
               rules:{
                   resourceName:[
                       { required: true, message: '请输入资源名称', trigger: 'blur' },
                       { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                   ],
                   resourceCode:[
                       { required: false, message: '请输入资源名称', trigger: 'blur' },
                       { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                   ]
               },

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
                   component: '',
                   placeId:''
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
                   component: '',
                   placeId:''
               },
               i:0,
               dialogVisible: false,
               dialogVisible_1: false,
               dialogVisible_data:false,
               dataInfo:[],
               selectInfo:'',
               allPlace:[],
               defaultProps: {
                   children: 'children',
                   label: 'name'
               },
               checkList: ['选中且禁用','复选框 A']
           };
       },
       computed: {
           ...mapGetters({
               permission: 'permission',
               dicts: 'dicts',
           })
       },
       methods: {
           ...mapActions({
                setAllPermission:"GET_ALL_PERMISSION",
                axioPostNoData: 'AXIO_POST_NODATA',
                getTableInfo:'GET_TABLE_INFO'
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
               this.selectInfo = data
               this.getResourceDataInfo()
               this.form1.id = data.id
               this.form.parentResourceId = data.id
               this.form.name = data.name
           },
           close(){
               this.dialogVisible = false
               this.dialogVisible_1 = false
               this.dialogVisible_data = false
               this.selectInfo = ''
               this.form=[]
               this.form1=[]
               this.setAllPermission()
           },
           resourceadd(){

               this.dialogVisible = true
           },

           changeDR(){
               let vm = this
               if(this.selectInfo === ''){
                   this.$message.warning("请先选择")
                   return
               }
               vm.dialogVisible_data = true;
           },

           update() {

               if(this.selectInfo === ''){
                   this.$message.warning("请先选择")
                   return
               }

               this.dialogVisible_1 = true
               axios({
                   method: 'post',
                   url:url.allurl+'/resource/findResourceById',
                   params: {
                       id:this.form1.id,
                   }
               }).then((res)=>{
                   if (res.data.retcode === 200) {
                       // this.form1.parentResourceId = res.data.data.id
                       // this.form1.name = res.data.data.name
                       // this.form1.resourceName = res.data.data.resourceName
                       // this.form1.resourceIcon = res.data.data.resourceIcon
                       // this.form1.resourceUrl = res.data.data.resourceUrl
                       // this.form1.component = res.data.data.component
                       // this.form1.resourceCode = res.data.data.resourceCode
                       this.form1 = {...res.data.data}
                       if(res.data.data.isShow === '1'){
                           this.form1.isShow = true
                       } else {
                           this.form1.isShow = false
                       }
                       if(res.data.data.isOne === 1){
                           this.form1.isOne = true
                       } else {
                           this.form1.isOne = false
                       }

                       if(res.data.data.isButton === 1){
                           this.form1.isButton = true
                       } else {
                           this.form1.isButton = false
                       }
                   }
               })
           },
           handleClose() {
               console.log('新增关闭')
              this.form.resourceCode = '';
              this.form.resourceIndex = '';
              this.form.resourceUrl = '';
              this.form.isShow = false;
              this.form.isOne = false;
              this.form.isButton = false;
              this.form.resourceIcon = '';
              this.form.component = '';
              this.form.placeId = '';
//              this.form=[]
               this.setAllPermission()
               console.log(this.form)
           },

           handleClose_1() {
               console.log('修改关闭')
               console.log(this.form)
               this.form1.resourceCode = '';
               this.form1.resourceIndex = '';
               this.form1.resourceUrl = '';
               this.form1.isShow = '';
               this.form1.isOne = '';
               this.form1.isButton = '';
               this.form1.resourceIcon = '';
               this.form1.component = '';
               this.form1.placeId = '';
               this.setAllPermission()
           },

           handleClose_data(){

               this.selectInfo = '';
               this.setAllPermission()
           },
           deletesure(done) {
               this.$confirm('系统关键资源，确认删除？')
                   .then(_ => {
                       done();
                   })
                   .catch(_ => {});
           },

           makesure() {
               // if(this.form.value3 === true) {
               //     this.form.isOne = 0
               //     this.form.isButton = 1
               // } else {
               //     this.form.isOne = 1
               //     this.form.isButton = 0
               // }
               // if(this.form.isShow === true){
               //     this.form.isShow =1
               // } else {
               //     this.form.isShow =0
               // }

               if(this.form.isOne=== true){
                   this.form.isOne = 1
               }else{
                   this.form.isOne = 0
               }

               if(this.form.isButton=== true){
                   this.form.isButton = 1
               }else{
                   this.form.isButton = 0
               }

               if(this.form.isShow=== true){
                   this.form.isShow = 1
               }else{
                   this.form.isShow = 0
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
                       component:this.form.component,
                       resourceIndex:this.form.resourceIndex,
                       placeId:this.form.placeId
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
               // if(this.form1.value3 === true) {
               //     this.form1.isOne = 1
               //     this.form1.isButton = 0
               // } else {
               //     this.form1.isOne = 0
               //     this.form1.isButton = 1
               // }
               // if(this.form1.isShow === true){
               //     this.form1.isShow =1
               // } else {
               //     this.form1.isShow =0
               // }

               if(this.form1.isOne=== true){
                   this.form1.isOne = "1"
               }else{
                   this.form1.isOne = "0"
               }

               if(this.form1.isButton=== true){
                   this.form1.isButton = "1"
               }else{
                   this.form1.isButton = "0"
               }

               if(this.form1.isShow=== true){
                   this.form1.isShow = "1"
               }else{
                   this.form1.isShow = "0"
               }
               console.log("testst",this.form1)

               axios({
                   method: 'post',
                   url:url.allurl+'/resource/update',
                   params: {
                       resourceCode:this.form1.resourceCode,
                       id: this.form1.id,
                       isOne:this.form1.isOne,
                       isButton:this.form1.isButton,
                       resourceUrl:this.form1.resourceUrl,
                       resourceIcon:this.form1.resourceIcon,
                       isShow:this.form1.isShow,
                       resourceName:this.form1.resourceName,
                       component:this.form1.component,
                       resourceIndex:this.form1.resourceIndex,
                       placeId:this.form1.placeId
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

           makesure_data(){
                let vm = this
                this.$refs.tableInfo.sureok().then(function(val){
                 if(val.data.retcode === 200){
                     vm.$message.success(val.data.data)
                     vm.dialogVisible_data = false
                 }else{
                     vm.$message.warning(val.data.data)
                 }
                 console.log(val);
             })
           },

           getResourceDataInfo(){
               let vm = this
               let id = {'rId':vm.selectInfo.id}
               this.getTableInfo(id).then(function(val){
                   vm.dataInfo = val.data.data
                   console.log(vm.dataInfo)
               })
           },

           removeone() {
               console.log(this.form1.id)
               let a= new Array();
               a.push(this.form1.id);
               axios({
                   method: 'post',
                   url:url.allurl+'/resource/delete',
                   params: {
                       ids:a
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
           },

           getAllPlace: function () {
               let vm = this;
               this.axioPostNoData("/places/getAllPlaces").then(function (val) {
                   vm.allPlace = val.data.data
               })
           },



       },

       components:{
           'table-info-option':OptionPage
       },

       created() {
           this.setAllPermission();
           this.getAllPlace();
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
