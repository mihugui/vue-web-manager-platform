<template>
    <el-form :inline="true" :model="companySearch" class="demo-form-inline" size="mini" label-width="100px">
    <el-form-item
        v-for ="(search,index) in searchData"
        :key="index"
        v-if="search.seachtype===1"
        :label="search.name" label-width="80px">
        <el-input
                :placeholder="'请输入'+search.name"
                :id="search.key"
                clearable>
        </el-input>
    </el-form-item>

    <el-form-item>
        <el-button type="primary" @click="searchChange" icon="el-icon-search">查询</el-button>
    </el-form-item>
    </el-form>

</template>
<script>
    export default{
        data(){
            return{
                option:null,
                searchData:[{
                    name:'园区名称',
                    seachtype:1,
                    key:'place'
                },{
                    name:'园区设备',
                    seachtype:2,
                    key:'device',
                    url:'/Employee/type',
                    optionvalue:'classtype',
                    optionname:'classname',
                }]
            }
        },
        methods:{

        },
        props:[],
    }
</script>
<style>

</style>
