<template>
   <div id="ResourceManagement">
       <el-row>
           <el-button type="primary" size="small" @click="dialogVisible = true">增加</el-button>
           <el-button type="primary" size="small">删除</el-button>
           <el-button type="primary" size="small">修改</el-button>
       </el-row>
       <el-row style="margin-top: 20px">
           <el-tree
               :data="table"
               @node-click="getCheckedNodes"
               node-key="id"
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
                <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="*上级资源">
                     <el-input v-model="form.name" style="width: 620px;float: right"></el-input>
                 </el-form-item>
                     <el-form-item label="*资源名称" >
                     <el-input v-model="form.name" style="width: 620px;float: right"></el-input>
                 </el-form-item>
                     <el-form-item label="*资源标识符" labelWidth="90px">
                     <el-input v-model="form.name" style="width: 620px;float: right"></el-input>
                 </el-form-item>
                     <el-form-item label="*排序号">
                     <el-input v-model="form.name" style="width: 620px;float: right"></el-input>
                 </el-form-item>
                     <el-form-item label="*访问地址">
                     <el-input v-model="form.name" style="width: 620px;float: right"></el-input>
                 </el-form-item>
                </el-form>
                <el-checkbox-group v-model="checkList">
                     <el-checkbox label="应用级资源"></el-checkbox>
                     <el-checkbox label="按钮"></el-checkbox>
                </el-checkbox-group>
            </span>
           <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
       </el-dialog>
   </div>

</template>
<script type="text/ecmascript-6">
   import ElRow from "element-ui/packages/row/src/row";
   import {mapGetters,mapMutations, mapActions} from 'vuex'
   import * as types from '../../stores/mutation-types';
   export default {
       components: {ElRow},
       name: 'ResourceManagement',
       data() {
           return {
               form: {
                   name: ''
               },
               table: JSON.parse(sessionStorage.getItem('kao')),
               dialogVisible: false,
               defaultProps: {
                   children: 'list',
                   label: 'name'
               },
               checkList: ['选中且禁用','复选框 A']
           };
       },
       computed: {
           ...mapActions({
               permission: 'GET_ALL_PERMISSION'
           }),
       },
       methods: {
           resolve() {
               let msg = [{"id":1,"system":"system","name":"系统管理","icon":"fa fa-bullseye","path":"","component":null,"pId":null,"button":null},{"id":2,"system":null,"name":"资源管理","icon":"fa fa-bullseye","path":"/system/source","component":"source","pId":1,"button":null},{"id":3,"system":null,"name":"园区管理","icon":"fa fa-bullseye","path":"/system/place","component":"place","pId":1,"button":null},{"id":4,"system":null,"name":"添加","icon":null,"path":"/places/add","component":null,"pId":2,"button":1},{"id":5,"system":null,"name":"企业管理","icon":"fa fa-bullseye","path":"/system/enterprise","component":"enterprise","pId":1,"button":null},{"id":6,"system":null,"name":"编辑","icon":null,"path":"/places/edit","component":null,"pId":2,"button":1},{"id":7,"system":null,"name":"删除","icon":null,"path":"/places/del","component":null,"pId":2,"button":1}]
               let tree = [];
               for(let i=0;i<msg.length;i++){
                   if(msg[i].pId === null){
                       let obj = msg[i];
                       obj.list = [];
                       tree.push(obj);
                       msg.splice(i,1);
                       i--
                   }
               }
               console.log(tree);
               menuList(tree);
               console.log(tree);
               sessionStorage.setItem('kao', JSON.stringify(tree));
               function menuList(arr){
                   if(msg.length !=0){
                       for(let i=0; i<arr.length;i++){
                           for(let j=0;j<msg.length;j++){
                               if(msg[j].pId == arr[i].id){
                                   let obj = msg[j]
                                   obj.list = []
                                   arr[i].list.push(obj)
                                   msg.splice(j,1)
                                   j--
                               }
                           }
                           menuList(arr[i].list)
                       }
                   }
               }
           },
           handleClose(done) {
               this.$confirm('确认关闭？')
                   .then(_ => {
                       done();
                   })
                   .catch(_ => {});
           },
           getCheckedNodes(value) {
               console.log(value);
           }
       },
       created() {
           this.resolve();
       }
   }
</script>

<style  rel="stylesheet/stylus">

</style>
