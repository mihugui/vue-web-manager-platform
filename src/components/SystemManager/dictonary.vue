<template>
   <div class="dictonary">
       <section>
           <el-form :inline="true"  class="demo-form-inline">
               <el-form-item label="字典数据类型">
                   <el-input  placeholder="字典数据类型"></el-input>
               </el-form-item>
           </el-form>
       </section>
       <section>
           <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"></mini-table>
       </section>
   </div>
</template>

<script type="text/ecmascript-6">
    import Table from '@/components/Table'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "dictonary",
        data(){
            return {
                dialog:{
                },
                dialogVisible:false,
                showEdit:true,
                showDetele:true,
                url:'/table/data',
                placename:'',
                tableKey: [{
                    name: '序号',
                    value: 'date',
                    operate: true
                },{
                    name: '字典类型名称',
                    value: 'name',
                    operate: false
                },{
                    name: '字典类型编码',
                    value: 'address',
                    operate: false
                },{
                    name: '字典类型描述',
                    value: 'date',
                    operate: true
                },{
                    name: '操作',
                    value: 'date',
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
                total:'total'
            }),
        },
        methods:{

            ...mapMutations({
                setTableUrl: 'SET_TABLE_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA'
            }),

            selectedChange(val){
                var vm = this;
                switch(val.length){
                    case 0:
                        console.log(13);
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

            showAddModal(){
                this.dialogVisible=true;

            },
            showEditModal(){
                this.dialogVisible=true;
            },
            deleteList(){

            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableData(123);
        }
    }
</script>

<style  rel="stylesheet/stylus">

</style>
