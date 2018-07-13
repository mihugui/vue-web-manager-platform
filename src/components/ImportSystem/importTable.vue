<template>
    <div>
        <section class="content-search">
            <div style="padding-left: 20px">
            <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
                <el-form-item
                    v-for="(item,key) in search"
                    :key="key"
                    :label="item.paramDesc"
                    label-width="80px">
                    <el-input
                        :placeholder="'请输入'+item.paramDesc"
                        v-model="search[key].paramValue"
                        clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchTable">查询</el-button>
                </el-form-item>
            </el-form>
            </div>
        </section>
        <section class="content-operate">
            <el-button
                v-for="(item,key) in button"
                :key="key"
                type="primary"
                size="mini"
                :icon="item.resourceIcon"
                @click="clickbutton(item.dataType)">
                {{ item.resourceName }}
            </el-button>
        </section>
        <section class="content-table">
        <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange" :sizeChange="sizeChange" :currentChange="currentChange" :loading="loading"></mini-table>
        </section>
        <div>
            <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="850px"
                heigth = "80%"
                :modal-append-to-body="false"
                :close-on-click-modal="false"
                @close='closeDialog'
                style="z-index: 99999;">
            <span>
                <el-form :model="dialog" ref="dialog"  label-width="120px"  class="demo-ruleForm">
                    <el-form-item
                        v-for="(item,key) in formList"
                        :key="key"
                        :label="item.paramDesc"
                        :rule="item.paramRule">
                        <el-col :span="20">
                        <el-input v-model="dialog[item.paramKey]"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
            </span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="sureok">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Table from '@/components/Table'
    import { mapActions,mapGetters,mapMutations } from 'vuex'
    export default {
        name: 'importTable',
        data() {
            return {
                title:'',
                id:'',
                dialog:{

                },
                rules:{

                },
                search:[],
                page:[],
                button:[],
                tableKey:[],
                formList:[],
                searchParams:{

                },
                tableData: [],
                total:10,
                loading:false,
                url:'/resourceData/getData',
                //dialog
                dialogVisible:false,


            }
        },

        computed:{
            ...mapGetters({
                test:'test',
            }),
        },

        methods:{

            ...mapMutations({
                setDataByUrl: 'SET_DATA_BYURL',
            }),
            ...mapActions({
                getTableInfo:'GET_TABLE_INFO',
                getDataByUrl:'GET_DATA_BYURL',
                getTableButton:'GET_TABLE_BUTTON'
            }),

            getTableOption:function(){
                let vm = this
                this.id = JSON.parse(sessionStorage.getItem('permission')).filter(p=>{return p.path === vm.$route.path})[0].id
                let rid = {'rId':this.id}
                this.getTableInfo(rid).then(function(val){
                    let info = val.data.data.srdpList
                    vm.search = info.filter(p=>{return p.isCondition === "1"})
                    for(let s of vm.search){
                        vm.searchParams[s.paramKey]='';
                    }
                    vm.page.push(info.filter(p=>{return p.paramDesc === "page"})[0])
                    vm.page.push(info.filter(p=>{return p.paramDesc === "pagesize"})[0])
                    vm.page[0].paramValue = 1
                    vm.page[1].paramValue = 10
                    vm.formList = [...info.filter(p=>{return p.isShow === "1"})]
                    vm.tableKey.push({
                        name: '序号',
                        type: 'index',
                    })
                    for(let a of info.filter(p=>{return p.isShow === "1"})){
                        vm.tableKey.push({
                            name:a.paramDesc,
                            value:a.paramKey
                        })
                    }
                    vm.getTableDataByUrl();
                })

                this.getTableButton(rid).then(function(val){
                    let result = val.data.data.filter(p=>{return p.isButton === 1})
                    for( let b of result){
                        let bid = { 'rId':b.id}
                        vm.getTableInfo(bid).then(function(val){
                            b.dataType = val.data.data.srd.dataType
                        })
                    }
                    console.log(result)
                    vm.button = result
                })

            },

            clickbutton(val){
                let vm = this
                switch(val){
                    case 'add':
                        vm.title = "新增"
                        vm.dialogVisible = true

                }
            },

            getTableDataByUrl(){
                let vm = this
                //this.search[0].paramValue = '洛阳园区'
                let Condition = [...this.page,...this.search]
                let Params = {'rId':this.id,'params':JSON.stringify(Condition)}
                this.getDataByUrl(Params).then(function(val){
                    let data = JSON.parse(val.data.data)

                    vm.tableData = data.data.list
                    vm.total = data.data.total

                })

            },

            searchTable:function(){
                this.getTableDataByUrl()
            },

            selectedChange:function(val){

                console.log(val)
            },
            sizeChange:function(val){

                this.page[0].paramValue = val
                this.getTableDataByUrl()

            },
            currentChange:function(val){

                this.page[1].paramValue = val
                this.getTableDataByUrl()
            },
            sureok:function(){
                console.log(this.dialog)

            },
            closeDialog:function(){
                this.dialog = {}

            }
        },
        components:{
            'mini-table':Table
        },



        created(){
            this.setDataByUrl(this.url)
            this.getTableOption();
        }
    }


</script>
<style scoped>
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
        height: auto;
    }
</style>
