<template>
   <div class="content-search">
       <!--<section>-->
           <!--<el-form :inline="true"  class="demo-form-inline">-->
               <!--<el-form-item label="字典数据类型">-->
                   <!--<el-input  placeholder="字典数据类型" @change="dictype"></el-input>-->
               <!--</el-form-item>-->
           <!--</el-form>-->
       <!--</section>-->
       <!--<section>-->
           <!--<el-row>-->
               <!--<el-button type="primary" icon="el-icon-plus" size="mini"  @click="showAddModal">增加</el-button>-->
               <!--<el-button type="primary" size="mini"  icon="el-icon-edit" @click="showEditModal" v-if="showEdit">修改</el-button>-->
               <!--<el-button type="primary" size="mini" icon="el-icon-tickets" @click="showexcel" v-if="showlook">查看子表</el-button>-->
               <!--<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteList" v-if="showDetele">删除</el-button>-->
           <!--</el-row>-->
       <!--</section>-->
       <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
           <el-form-item
               label="字典数据名称" label-width="120px">
               <el-input
                   placeholder="输入字典数据类型"
                   v-model="indicttype"
                   clearable>
               </el-input>
           </el-form-item>
           <el-form-item>
               <el-button type="primary" icon="el-icon-search" @click="dictype">查询</el-button>
           </el-form-item>
       </el-form>
       <section>
           <div>
               <div style="display: inline-block;float: left" :style="stylefa">
                   <section class="content-operate">
                       <el-row>
                           <el-button type="primary" icon="el-icon-plus" size="mini"  @click="showAddModal">增加</el-button>
                           <el-button type="primary" size="mini"  icon="el-icon-edit" @click="showEditModal" v-if="showEdit">修改</el-button>
                           <el-button type="primary" size="mini" icon="el-icon-tickets" @click="showexcel" v-if="showlook">查看子表</el-button>
                           <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteList" v-if="showDetele">删除</el-button>
                       </el-row>
                   </section>
                   <section class="content-table">
                   <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange"></mini-table>
                   </section>
               </div>
               <div style="display: inline-block;float: left;width: 50%" v-if="showson">
                   <section class="content-operate">
                       <el-row>
                           <el-button type="primary" icon="el-icon-plus" size="mini"  @click="showsonAddModal">增加</el-button>
                           <el-button type="primary" size="mini"  icon="el-icon-edit" @click="showsonEditModal" v-if="showsonEdit">修改</el-button>
                           <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteListson" v-if="showsonDetele">删除</el-button>
                       </el-row>
                   </section>
                   <section class="content-table">
                   <mini-table :tableData="tableDatason" :tableKey="tableKeyson" :total="totalson" :selectedChange="selectedChangeson" :sizeChange="sizeChange" :currentChange="currentChangeson"></mini-table>
                   </section>
               </div>
           </div>
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
                <div class="dialog-input" style="margin-top: 15px;" v-if="reason">
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
                reason: true,
                dialogVisible:false,
                totalson: '0',
                tableDatason:'tableDatason',
                showEdit:false,
                showDetele:false,
                showsonEdit:false,
                showsonDetele:false,
                showson: false,
                showlook: false,
                stylefa: 'width:100%',
                url:'/dictGroup/list',
                urlson:'/dict/list',
                page:{
                    page:1,
                    pageSize:10,
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
                tableKeyson: [{
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
                }],
                param:null,
                indicttype:'',
            }
        },
        components:{
            'mini-table':Table
        },
        computed:{
            ...mapGetters({
                tableData:'tableData',
                total:'total'
            }),
        },
        methods:{
            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL',
                setSureUrl:'SET_SURE_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA',
                updateSureOK : 'UPDATE_TABLE_DATA',
                getDictsData:'GET_DICTS_DATA'
            }),
            dictype(val){
                this.page.name = this.indicttype;
                this.getTableData(this.page);
            },
            showexcel(){
                axios({
                    method: 'post',
                    url:url.allurl+'/dict/list',
                    params: {
                        page:1,
                        pageSize:10,
                        code: JSON.parse(this.codeone)
                    }
                }).then((res)=>{
                  let  vm = this
                    if (res.data.retcode === 200) {
                        console.log(res.data.data);
                        this.tableDatason = res.data.data.list;
                        this.totalson = res.data.data.total
                    }
                })
                if(this.showson){
                    this.showson = false;
                    this.stylefa= 'width:100%';
                    this.showsonEdit=false;
                    this.showsonDetele=false;
                } else {
                    this.showson = true;
                    this.stylefa= 'width:50%';
                }
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
                    this.selectid = JSON.stringify(c);
                    this.groupid = val[0].id;
                    this.codeone =  JSON.stringify(val[0].code);
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
                        vm.showlook = false
                        this.showson = false;
                        this.stylefa= 'width:100%';
                        break;
                    case 1:
                        vm.showEdit = true
                        vm.showDetele = true;
                        vm.showlook = true
                        break;
                    default:
                        vm.showEdit = false;
                        vm.showDetele = true;
                        vm.showlook = false;
                        this.showson = false;
                        this.stylefa= 'width:100%';
                }
            },
            selectedChangeson(val){
                var vm = this;
                if(val.length>0){
                    console.log(val[0].id)
                    let c = [];
                    val.forEach((item, index) =>{
                            c.push(item.id)
                    });
                    console.log(c)
                    console.log(val[0].groupId)
                    this.groupsonid = val[0].groupId
                    this.selectid = c;
                    this.codeone =  JSON.stringify(val[0].code);
                    this.seltableson ={
                        "code":val[0].code,
                        "name":val[0].name,
                        'id': val[0].id,
                        'groupId': this.groupsonid
                    };}
                switch(val.length){
                    case 0:
                        vm.showsonEdit = false;
                        vm.showsonDetele = false;
                        vm.showsonlook = false
                        break;
                    case 1:
                        vm.showsonEdit = true
                        vm.showsonDetele = true;
                        vm.showsonlook = true
                        break;
                    default:
                        vm.showsonEdit = false;
                        vm.showsonDetele = true;
                        vm.showsonlook = false;
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
            currentChangeson(val){
                axios({
                    method: 'post',
                    url:url.allurl+'/dict/list',
                    params: {
                        page:val,
                        pageSize:20,
                        code: JSON.parse(this.codeone)
                    }
                }).then((res)=>{
                    let  vm = this
                    if (res.data.retcode === 200) {
                        console.log(res.data.data);
                        this.tableDatason = res.data.data.list;
                        this.totalson = res.data.data.total;
                        vm.getDictsData()
                    }
                })
//                this.getTableData(this.page);
            },
            showAddModal(){
                this.closeDialog();
                this.title="新增";
                this.reason = true;
                this.setSureUrl('/dictGroup/add');
                this.dialogVisible=true;
            },
            showsonAddModal(){
                this.closeDialog();
                this.reason = false;
//                this.dialog={name:dialog.name,code:dialog.code};
                this.title="新增子表数据";
                this.setSureUrl('/dict/add');
                this.dialogVisible=true;
            },
            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.reason = true;
                this.setSureUrl('/dictGroup/update');
                this.dialogVisible=true;
            },
            showsonEditModal(){
                this.dialog={...this.seltableson};
                this.title="编辑";
                this.reason = false;
                this.setSureUrl('/dict/update');
                this.dialogVisible=true;
            },
            deleteList(){
                let vm = this;
                this.$confirm('确认删除？')
                    .then(_ => {
                        axios({
                            method: 'post',
                            url:url.allurl+'/dictGroup/delete',
                            params: {
                                ids: JSON.parse(this.selectid)
                            }
                        }).then((res)=>{
                            if (res.data.retcode === 200) {
                                vm.$message.success("删除成功");
                                vm.getTableByOther();
                                vm.getDictsData()
                            } else {
                                vm.$message.warning("删除失败");
                            }
                        })
                    })
                    .catch(_ => {});
            },
            deleteListson(){
                let vm = this;
                this.$confirm('确认删除？')
                    .then(_ => {
                        axios({
                            method: 'post',
                            url:url.allurl+'/dict/delete',
                            params: {
                                ids: this.selectid
                            }
                        }).then((res)=>{
                            if (res.data.retcode === 200) {
                                vm.$message.success("删除成功");
                                vm.getTableByOther();
                                vm.getDictsData()
                            } else {
                                vm.$message.warning("删除失败");
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
                if(this.reason === false) {
                    console.log(vm.dialog)
                     vm.dialog.groupId= this.groupid;
                     delete vm.dialog.description;
                    console.log(vm.dialog)
                }
                vm.updateSureOK(vm.dialog).then(function(val){
                    if(val.data.retcode===200){
                        vm.$message.success(val.data.retmsg);
                        vm.dialogVisible=false;
                        vm.getTableByOther();
                    }else{
                        vm.$message.error(val.data.retmsg);
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
            },
            getTableSON:function(){
                this.getTableData(this.page1);
            }

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableByOther();
        }
    }
</script>

<style>
    .content-search {
        background-color: #fff;
        border-bottom: 2px solid hsla(0,0%,92%,.9);
        margin:20px 0 0 0;
        width: 100% ;
    }
    .content-operate {
        margin:10px 0 10px 30px;
        flex: 1;
        overflow-y: auto;
    }

    .content-table{
        background-color: #f0f4f7;
        padding: 10px 20px 60px;
    }
</style>
