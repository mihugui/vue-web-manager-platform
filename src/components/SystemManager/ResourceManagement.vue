<template>
   <div id="ResourceManagement">
       <el-row>
           <el-button type="primary" size="small" @click="dialogVisible = true">增加</el-button>
           <el-button type="primary" size="small">删除</el-button>
           <el-button type="primary" size="small">修改</el-button>
       </el-row>
       <el-row style="margin-top: 20px">
           <el-tree
               :data="permission"
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
   import {mapGetters,mapMutations} from 'vuex'
   import * as types from '../../stores/mutation-types';
   export default {
       components: {ElRow},
       name: 'ResourceManagement',
       data() {
           return {
               form: {
                   name: ''
               },
               table: [{"id":1,"system":"xfxt","name":"消费系统","icon":"fab fa-apple","url":"aaaa","pId":null,"button":null},{"id":2,"system":"mjxt","name":"门禁系统","icon":"fab fa-apple","url":"aaaa","pId":null,"button":null},{"id":11,"system":null,"name":"消费系统菜单一","icon":"fab fa-apple","url":"aaaa","pId":1,"button":null},{"id":12,"system":null,"name":"消费系统菜单二","icon":"fab fa-apple","url":"aaaa","pId":1,"button":null},{"id":21,"system":null,"name":"门禁系统菜单一","icon":"fab fa-apple","url":"aaaa","pId":2,"button":null},{"id":22,"system":null,"name":"门禁系统菜单二","icon":"fab fa-apple","url":"aaaa","pId":2,"button":null},{"id":111,"system":null,"name":"消费系统菜单一按钮","icon":"fab fa-apple","url":"aaaa","pId":11,"button":1},{"id":121,"system":null,"name":"消费系统菜单二按钮","icon":"fab fa-apple","url":"aaaa","pId":12,"button":1},{"id":211,"system":null,"name":"门禁系统菜单一按钮","icon":"fab fa-apple","url":"aaaa","pId":21,"button":1},{"id":221,"system":null,"name":"门禁系统菜单二按钮","icon":"fab fa-apple","url":"aaaa","pId":22,"button":1}],
               dialogVisible: false,
               permission:[
                   {"id":1,"system":"xfxt","label":"消费系统","icon":"fab fa-apple","url":"aaaa","pId":null,"button":null,
                       children: [
                       {"id":11,"system":null,"label":"消费系统菜单一","icon":"fab fa-apple","url":"aaaa","pId":1,"button":null,children: [
                           {"id":111,"system":null,"label":"消费系统菜单一按钮","icon":"fab fa-apple","url":"aaaa","pId":11,"button":1},
                       ]},
                       {"id":12,"system":null,"label":"消费系统菜单二","icon":"fab fa-apple","url":"aaaa","pId":1,"button":null,children: [
                           {"id":121,"system":null,"label":"消费系统菜单二按钮","icon":"fab fa-apple","url":"aaaa","pId":12,"button":1},
                       ]},
                       ]},
                    {"id":2,"system":"mjxt","label":"门禁系统","icon":"fab fa-apple","url":"aaaa","pId":null,"button":null,
                        children: [
                            {"id":21,"system":null,"label":"门禁系统菜单一","icon":"fab fa-apple","url":"aaaa","pId":2,"button":null,children:[
                                {"id":211,"system":null,"label":"门禁系统菜单一按钮","icon":"fab fa-apple","url":"aaaa","pId":21,"button":1},
                            ]},
                            {"id":22,"system":null,"label":"门禁系统菜单二","icon":"fab fa-apple","url":"aaaa","pId":2,"button":null,children:[
                                {"id":221,"system":null,"label":"门禁系统菜单二按钮","icon":"fab fa-apple","url":"aaaa","pId":22,"button":1}
                            ]},
                        ]
                   },
                   ],
               defaultProps: {
                   children: 'children',
                   label: 'label'
               },
               checkList: ['选中且禁用','复选框 A']
           };
       },
       computed: {
           ...mapGetters({
               data: 'permission'
           }),
       },
       methods: {
           handleClose(done) {
               this.$confirm('确认关闭？')
                   .then(_ => {
                       done();
                   })
                   .catch(_ => {});
           },
           getCheckedNodes(value) {
               console.log(value);
           },
           init() {
               this.table.forEach((item, index) => {
//                   console.log(item);
                   if (item.button === null) {
                        console.log(item.id);
                        console.log(item.name);
                        console.log(item.icon);
                        console.log(item.url);
                   } else if (item.button === 1) {
                       console.log(item.id);
                       console.log(item.name);
                       console.log(item.icon);
                       console.log(item.url);
                   }
               })
           }
       },
       created() {
         this.init()
            }
   }
</script>

<style  rel="stylesheet/stylus">

</style>
