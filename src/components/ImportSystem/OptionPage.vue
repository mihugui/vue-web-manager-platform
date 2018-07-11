<template>
    <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="资源名称">
                <!--<el-cascader-->
                    <!--expand-trigger="hover"-->
                    <!--:options="options"-->
                    <!--v-model="form.selectedOptions"-->
                    <!--filterable-->
                    <!--:props="props_option"-->
                    <!--@change="handleChange">-->
                <!--</el-cascader>-->
                <el-select v-model="resource.id" placeholder="请选择" disabled>
                    <el-option
                        :label="resource.name"
                        :value="resource.id"
                        selected
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="显示类型" prop="region">
                <el-select v-model="form.region" placeholder="请选择显示模式">
                    <el-option
                        v-for="(item,key) in dicts.system"
                        :key="key"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="URL" prop="url">
                <el-input v-model="form.url" style="width: 90%;">
                <el-select v-model="form.data_method" style="width: 90px;" slot="append" placeholder="请选择">
                    <el-option label="POST" value="POST"></el-option>
                    <el-option label="GET" value="GET"></el-option>
                </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="页数参数" prop="page" v-if="form.region === 'table'">
                <el-input v-model="form.page" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="个数参数" prop="pageSize" v-if="form.region === 'table'">
                <el-input v-model="form.pageSize" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item
                v-for="(item, index) in form.parameter"
                :label="'参数 ' + index"
                :key="item.key"
                :prop="'item.' + index + '.paramKey'"
                :rules="{required: true, message: '参数不能为空', trigger: 'blur'}">
                <el-input v-model="item.paramKey" placeholder="填写参数名称" style="width: 150px;"></el-input>
                <el-input v-model="item.paramDesc" placeholder="填写参数描述" style="width: 150px;"></el-input>
                <el-checkbox v-model="item.isShow">表格显示</el-checkbox>
                <el-checkbox v-model="item.isCondition">表格查询</el-checkbox>
                <el-button @click.prevent="removeParameter(item)">删除</el-button>
            </el-form-item>
            <el-form-item label="参数">
                <el-button @click.prevent="addParameter()">添加参数</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>
<script>
    import {Permission} from "../../axios/Permission";
    import { mapActions,mapGetters } from 'vuex'
    export default {
        name: 'OptionPage',
        data() {
            return {
                rules:{
                    url:[
                        { required: true, message: '请填写接口地址', trigger: 'change' }
                    ],
                    region:[
                        { required: true, message: '请选择接入类型', trigger: 'change' }
                    ],
                    url:[
                        { required: true, message: '请填写接口地址', trigger: 'blur' }
                    ],
                    page:[{ required: true, message: '请填写页数参数', trigger: 'blur' }],
                    pageSize:[{ required: true, message: '请填写页面个数参数', trigger: 'blur' }],
                },
                form:{
                    selectedOptions:[],
                    region:'',
                    url:'',
                    page:'',
                    pageSize:'',
                    data_method:'POST',
                    parameter:[],
                },
                id:'',
                upStatus:'',
                permission:sessionStorage.getItem('permission'),
                options:[],
                props_option:{
                    value:'id',
                    label:'name',
                    children:'children'
                }
            }
        },

        computed:{
            ...mapGetters({
                dicts: 'dicts',
            }),
        },

        watch:{
            dataInfo(){
                this.isEdit()
            }
        },
        methods:{

            ...mapActions({
                setTableInfo: 'SET_TABLE_INFO',
                upTableInfo:'UP_TABLE_INFO'
            }),


            //删除参数
            removeParameter(item){

                var index = this.form.parameter.indexOf(item)
                if (index !== -1) {
                    this.form.parameter.splice(index, 1)
                }

            },

            //添加参数
           addParameter(){
                this.form.parameter.push({
                    paramKey:'',
                    isShow:'',
                    paramDesc:'',
                    isCondition:'',
                    paramRule:''
                })
           },
            //删除空的children字段
            getMenuName(menus){
                for (var value of menus) {
                    if (value.children) {
                        this.getMenuName(value.children)
                        if(value.children.length === 0){
                            delete value.children
                        }
                    }
                }

                return menus
            },

            //
            getAllPermission(){
                let vm = this
                Permission.getAllPermission(1).then(function(val)
                {
                    vm.options = vm.getMenuName(val)
                })
            },
            handleChange(value) {
                this.id = value[value.length-1];
            },

            sureok:function(){
                let vm = this

                let srdpList = [...this.form.parameter]

                for(let a of srdpList){
                    if(a.isShow === true){
                        a.isShow = 1
                    }else if(a.isShow === false){
                        a.isShow = 0
                    }

                    if(a.isCondition === true){
                        a.isCondition = 1
                    }else if(a.isCondition === false){
                        a.isCondition = 0
                    }
                }
                if(this.form.region === 'table')
                {
                srdpList.push({
                    paramKey:vm.form.page,
                    isShow:0,
                    paramDesc:'page',
                    isCondition:0,
                    paramRule:''
                },{
                    paramKey:vm.form.pageSize,
                    isShow:0,
                    paramDesc:'pagesize',
                    isCondition:0,
                    paramRule:''
                })}

                let tableParme = {id:vm.id,resourceId:vm.resource.id,dataType:vm.form.region,dataUrl:vm.form.url,dataMethod:vm.form.data_method,srdpList:JSON.stringify(srdpList)}
                if(this.upStatus === 0 ) {
                    return this.setTableInfo(tableParme)
                }else{
                    return this.upTableInfo(tableParme)
                }
            },
            isEdit:function(){

                console.log(this.dataInfo)

                if(this.dataInfo.srd != null){
                    this.id = this.dataInfo.srd.id
                    this.form.url = this.dataInfo.srd.dataUrl
                    this.form.region = this.dataInfo.srd.dataType
                    this.form.data_method = this.dataInfo.srd.dataMethod

                    this.form.parameter = [ ...this.dataInfo.srdpList]

                    this.form.pageSize = this.dataInfo.srdpList.filter(p=>{return p.paramDesc === "pagesize"})[0].paramKey
                    this.form.page = this.dataInfo.srdpList.filter(p=>{return p.paramDesc === "page"})[0].paramKey
                    this.removeParameter(this.dataInfo.srdpList.filter(p=>{return p.paramDesc === "pagesize"})[0])
                    this.removeParameter(this.dataInfo.srdpList.filter(p=>{return p.paramDesc === "page"})[0])


                    for(let a of this.form.parameter){
                        if(a.isShow === "1"){
                            a.isShow = true
                        }else if(a.isShow === "0"){
                            a.isShow = false
                        }

                        if(a.isCondition === "1"){
                            a.isCondition = true
                        }else if(a.isCondition === "0"){
                            a.isCondition = false
                        }
                    }

                    console.log(this.form.parameter)
                    this.upStatus = 1
                }else{
                    this.id = ''
                    this.form.url = ''
                    this.form.data_type = ''
                    this.form.pageSize = ''
                    this.form.page = ''
                    this.form.parameter = []
                    this.upStatus = 0
                    console.log('新增')
                }

                return
            }
        },

        mounted(){
            //this.getAllPermission();
            this.isEdit();
        },

        props:['resource','dataInfo']
    }

</script>
<style>

</style>
