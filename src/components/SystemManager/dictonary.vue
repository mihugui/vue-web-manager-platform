<template>
   <div class="dictonary">
       <section>
           <el-form :inline="true"  class="demo-form-inline">
               <el-form-item label="字典数据类型">
                   <el-input  placeholder="字典数据类型" @change="dictype"></el-input>
               </el-form-item>
           </el-form>
       </section>
       <section>
           <el-row>
               <el-button type="primary" icon="el-icon-plus" size="mini"  @click="showAddModal">增加</el-button>
               <el-button type="primary" size="mini"  icon="el-icon-edit" @click="showEditModal" v-if="showEdit">修改</el-button>
               <el-button type="primary" size="mini" icon="el-icon-tickets" >查看子表</el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteList" v-if="showDetele">删除</el-button>
           </el-row>
       </section>
       <section>
           <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange"></mini-table>
           <div>
               <el-dialog
                   :title="title"
                   :visible.sync="dialogVisible"
                   width="850px"
                   heigth = "80%"
                   :modal-append-to-body="false"
                   :before-close="handleClose"
                   @close='closeDialog'
                   style="z-index: 99999;">
            <span>
                <div  class="dialog-input">
                    <el-input placeholder="请输入字典类型名称"  v-model="dialog.name">
                        <template slot="prepend">字典类型名称</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入字段类型代码" v-model="dialog.code">
                        <template slot="prepend">字段类型代码</template>
                    </el-input>
                </div>
                <div class="dialog-input" style="margin-top: 15px;">
                    <el-input placeholder="请输入字典类型描述" v-model="dialog.description">
                        <template slot="prepend">字典类型描述</template>
                    </el-input>
                </div>
            </span>
                   <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
               </el-dialog>


               <!--<el-dialog-->
                   <!--title="查看字表"-->
                   <!--:modal-append-to-body="false"-->
                   <!--:visible.sync="dialogVisible_1"-->
                   <!--width="60%"-->
                   <!--:before-close="handleClose_1">-->
            <!--<span>-->
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
            <!--</span>-->
                   <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="close">取 消</el-button>-->
    <!--<el-button type="primary" @click="makesure_1">确 定</el-button>-->
            <!--</span>-->
               <!--</el-dialog>-->
           </div>
       </section>
   </div>
</template>

<script type="text/ecmascript-6">
    import Table from '@/components/Table'
    import axios from 'axios'
    import url from "../../globbal/url";
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "dictonary",
        data(){
            return {
                title: '',
                dialog:{
                },
                dialogVisible:false,
                showEdit:false,
                showDetele:false,
                url:'/dictGroup/list',
                page:{
                    page:1,
                    pageSize:20,
                    name: ''
                },
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                },{
                    name: '字典类型名称',
                    value: 'name',
                    operate: false
                },{
                    name: '字典类型编码',
                    value: 'code',
                    operate: false
                },{
                    name: '字典类型描述',
                    value: 'description',
                    operate: true
                }],
                param:null,
            }
        },
        components:{
            'mini-table':Table
        },
        computed:{
            ...mapGetters({
                tableData:'tableData',
                total:'total',
            }),
        },
        methods:{
            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK : 'UPDATE_TABLE_DATA'
            }),
            dictype(val){
                this.page.name = val;
                this.getTableData(this.page);
            },
            selectedChange(val){
                var vm = this;
                if(val.length>0){
                    console.log(val)
                    let c = [];
                    val.forEach((item, index) =>{
                        c.push(item.id)
                    });
                    console.log(JSON.stringify(c))
                    sessionStorage.setItem('selectid',JSON.stringify(c))
                    this.seltable ={
                        "code":val[0].code,
                        "description":val[0].description,
                        "name":val[0].name,
                       'id': val[0].id
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

            sizeChange(val){
                this.page.pageSize = val;
                console.log(val)
                this.getTableData({...this.page,...this.placename});
            },
            currentChange(val){
                this.page.page = val;
                this.getTableData(this.page);
            },
            showAddModal(){
                this.closeDialog();
                this.title="新增";
                this.setSureUrl('/dictGroup/add');
                this.dialogVisible=true;
            },
            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.setSureUrl('/dictGroup/update');
                this.dialogVisible=true;
            },
            deleteList(){
                this.$confirm('确认删除？')
                    .then(_ => {
                        axios({
                            method: 'post',
                            url:url.allurl+'/dictGroup/delete',
                            params: {
                                ids: sessionStorage.getItem('selectid'),
                            }
                        }).then((res)=>{
                            if (res.data.retcode === 200) {
                                 alert(1)
                            }
                        })

                    })
                    .catch(_ => {});
            },

            handleClose(done) {
                        done();
            },
            sureok:function(){
                let vm =this;
                vm.updateSureOK(vm.dialog).then(function(val){
                    if(val.data.retcode===200){
                        vm.dialogVisible=false;
                        vm.getTableByOther();
                    }
                })

            },

            closeDialog:function(){
                this.dialog.name='';
                this.dialog.code='';
                this.dialog.description='';
//                if(this.dialog.Id){
//                    delete this.dialog.Id;
//                }
            },

            getTableByOther:function(){
                this.getTableData(this.page);
            }

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableByOther();
        }
    }
</script>

<style  rel="stylesheet/stylus">

</style>
