<template>
<div>
    <section class="content-search">
    <el-form :inline="true" class="demo-form-inline" size="mini" label-width="100px">
        <el-form-item
            label="园区名称" label-width="80px">
            <el-input
                placeholder="请输入园区名称"
                v-model="placename"
                clearable>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
    </el-form>
    </section>
    <section class="content-operate">
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddModal">新增</el-button>
    <el-button type="primary" size="mini" icon="el-icon-plus" v-if="showEdit" @click="showEditModal">编辑</el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete" v-if="showDetele" @click="deleteList">删除</el-button>
    </section>
    <mini-table :tableData="tableData" :tableKey="tableKey" :total="total" :selectedChange="selectedChange"></mini-table>
</div>
</template>
<script>
    import Table from '@/components/Table'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "PlaceManager",
        data(){
            return {
                showEdit:false,
                showDetele:false,
                url:'/table/data',
                placename:'',
                tableKey: [{
                    name: '日期',
                    value: 'date',
                    operate: true
                },{
                    name: '姓名',
                    value: 'name',
                    operate: false
                },{
                    name: '地址',
                    value: 'address',
                    operate: false
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
            selectedChange(val){

                switch(val.length){
                    case 0:
                        this.showEdit = false;
                        this.showDetele= false;
                    case 1:
                        this.showEdit = true
                        this.showDetele= true;
                    default:
                        this.showEdit = false;
                        this.showDetele= true;
                }
                console.log(val.length);
            },

            showAddModal(){

            },
            showEditModal(){

            },
            deleteList(){

            },

            ...mapMutations({
               setTableUrl: 'SET_TABLE_URL'
            }),
            ...mapActions({
                getTableData : 'GET_TABLE_DATA'
            })

        },
        mounted () {
            this.setTableUrl(this.url);
            this.getTableData(123);
            this.selectedChange('');
        }
    }
</script>
<style>
    .content-search {
        text-align: left;
        background-color: #fff;
        border-bottom: 1px solid hsla(0,0%,92%,.9);
        padding: 15px 20px 0;
        display: block;
        margin: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    .content-operate {
        margin-bottom: 10px;
        text-align: left;
        background-color: #fff;
        border-bottom: 1px solid hsla(0,0%,92%,.9);
        display: block;
        padding-left: 30px;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
</style>
