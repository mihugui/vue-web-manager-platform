<template>
   <div id="ResourceManagement">
       <el-row>
           <el-button type="primary" size="small" @click="dialogVisible = true">增加</el-button>
           <el-button type="primary" size="small">删除</el-button>
           <el-button type="primary" size="small">修改</el-button>
       </el-row>
       <el-row style="margin-top: 20px">
           <el-tree
               :data="data2"
               show-checkbox
               node-key="id"
               :default-expanded-keys="[]"
               :default-checked-keys="[]"
               :props="defaultProps">
           </el-tree>
       </el-row>
       <el-dialog
           title="增加"
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
   export default {
       components: {ElRow},
       name: 'ResourceManagement',
       data() {
           return {
               form: {
                   name: ''
               },
               dialogVisible: false,
               data2: [
                   {
                   id: 1,
                   label: '消费系统',
                   children: [{
                       id: 4,
                       label: '报表管理',
                       children: [{
                           id: 9,
                           label: '员工福利'
                       }, {
                           id: 10,
                           label: '福利类型'
                       },{
                           id: 11,
                           label: '充支管理'
                       }]
                   },{
                       id: 5,
                       label: '信息管理'
                   },{
                       id: 6,
                       label: '消费设置'
                   },{
                       id: 7,
                       label: '设备管理'
                   },{
                       id: 8,
                       label: '系统管理'
                   },{
                       id: 9,
                       label: '财务管理'
                   }]
               },
                   {
                   id: 2,
                   label: '门禁系统',
                   children: [{
                       id: 5,
                       label: '二级 2-1'
                   }, {
                       id: 6,
                       label: '二级 2-2'
                   }]
               },{
                   id: 3,
                   label: '视频系统',
                   children: [{
                       id: 7,
                       label: '二级 3-1'
                   }, {
                       id: 8,
                       label: '二级 3-2'
                   }]
               },{
                   id :4,
                   label: '能耗系统',
                   },
                   {
                       id :5,
                       label: '**系统',
                   },
                   {
                       id :6,
                       label: '系统管理',
                       children: [{
                           id: 7,
                           label: '园区管理'
                       },{
                           id: 7,
                           label: '企业管理'
                       }]
                   }
               ],
               defaultProps: {
                   children: 'children',
                   label: 'label'
               },
               checkList: ['选中且禁用','复选框 A']
           };
       },
       methods: {
           handleClose(done) {
               this.$confirm('确认关闭？')
                   .then(_ => {
                       done();
                   })
                   .catch(_ => {});
           }
       }
   }
</script>

<style  rel="stylesheet/stylus">

</style>
