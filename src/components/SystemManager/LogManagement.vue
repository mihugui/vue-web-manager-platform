<template>
  <div id="LogManagement">
      <section>
          <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
              <!--<el-form-item label="用户">-->
                  <!--<el-input v-model="formInline.user" placeholder="输入用户名查询" @change="inputtext"></el-input>-->
              <!--</el-form-item>-->
          <!--</el-form>-->
          <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
              <el-form-item
                  label="用户" label-width="80px">
                  <el-input
                      placeholder="输入用户名查询"
                      v-model="formInline.user"
                      clearable>
                  </el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="inputtext">查询</el-button>
              </el-form-item>
          </el-form>
      </section>
      <section>
          <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange"></mini-table>
      </section>
  </div>
</template>
<script type="text/ecmascript-6">
    import Table from '@/components/Table'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: 'LogManagement',
        data() {
            return {
                url:'/log/list',
                //表格
                page:{
                    page:1,
                    pageSize:20,
                    operatorName: ''
                },
                tableKey: [{
                    name: '序号',
                    type: 'index',
                    operate: true
                },{
                    name: '用户',
                    value: 'operatorName',
                    operate: false
                },{
                    name: '操作内容',
                    value: 'operateContent',
                    operate: false
                },{
                    name: '操作IP',
                    value: 'operateIp',
                    operate: false
                },{
                    name: '浏览器',
                    value: 'operateBrowser',
                    operate: false
                },{
                    name: '操作时间',
                    value: 'operateTime',
                    operate: false
                }],
                formInline: {
                    user: '',
                    region: '',
                }
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
            inputtext(val){
                console.log(val)
                this.page.operatorName = this.formInline.user;
                this.getTableData(this.page);
            },
            selectedChange(val){
                var vm = this;
                if(val.length>0){
                    this.seltable ={
                        "placeName":val[0].placeName,
                        "placeCode":val[0].placeCode,
                        "placeAddress":val[0].placeAddress,
                        "placeArea":val[0].placeArea,
                        "placeDescription":val[0].placeDescription,
                        "Id":val[0].id,
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
                this.setSureUrl('/places/add');
                this.dialogVisible=true;
            },
            showEditModal(){
                this.dialog={...this.seltable};
                this.title="编辑";
                this.setSureUrl('/places/update');
                this.dialogVisible=true;
            },
            deleteList(){

                this.setSureUrl('/places/delete');
                this.$confirm('确认删除？')
                    .then(_ => {
                        console.log(123);
                    })
                    .catch(_ => {});
            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
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
                this.dialog.placeArea='';
                this.dialog.placeAddress='';
                this.dialog.placeCode='';
                this.dialog.placeDescription='';
                this.dialog.placeName='';
                if(this.dialog.Id){
                    delete this.dialog.Id;
                }
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
