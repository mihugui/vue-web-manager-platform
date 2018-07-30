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
                <el-select v-model="form.region" placeholder="请选择显示模式" @change="changeShow">
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
            <el-collapse accordion>
            <el-form-item
                v-for="(item, index) in form.parameter"
                :label="'参数 ' + index"
                :key="item.key"
                :rules="{required: true, message: '参数不能为空', trigger: 'blur'}">
                <el-input v-model="item.paramKey" placeholder="填写参数名称" style="width: 150px;"></el-input>
                <el-input v-model="item.paramDesc" placeholder="填写参数描述" style="width: 150px;"></el-input>
                <el-checkbox v-model="item.isShow" v-if="showForm.isShow">{{ showForm.isShow }}</el-checkbox>
                <el-checkbox v-model="item.isCondition" v-if="showForm.isSearch">{{ showForm.isSearch }}</el-checkbox>
                <el-button @click.prevent="removeParameter(item)">删除</el-button>
                <el-collapse-item title="其他属性" :name="index">
                    <el-form-item label="默认值">
                        <el-input v-model="item.paramValue" placeholder="默认值" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="显示类型">
                        <el-select v-model="item.paramRule.type" placeholder="请选择数据类型" :key="'dataType'+index">
                            <el-option
                                v-for="(itemDict,key) in dicts.datatype"
                                :key="key"
                                :label="itemDict.name"
                                :value="itemDict.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="校验规则">
                        <el-checkbox v-model="item.paramRule.isRequired">是否必填</el-checkbox>
                        <el-checkbox v-model="item.paramRule.isRegular">正则校验</el-checkbox>
                        <el-input v-model="item.paramRule.regular" v-if="item.paramRule.isRegular" placeholder="填写正则表达式" style="width: 200px;"></el-input>
                    </el-form-item>
                </el-collapse-item>
            </el-form-item>
            </el-collapse>
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
                dialogVisible_rule:false,
                showForm:'',
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

            //切换加入方式
            changeShow(val){
                let vm = this
                switch(val){
                    case "table":
                        vm.showForm={
                            isShow:'表格显示',
                            isSearch:'表格查询'
                        };
                        break;
                    case "add":
                        vm.showForm={
                            isShow:'编辑参数',
                        };
                        break;

                    case "edit":
                        vm.showForm={
                            isShow:'编辑参数',
                        };
                        break;

                    case "import":
                        vm.showForm={
                            isShow:'导入相关参数',
                            isSearch:'导入参数'
                        };

                }
            },

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
                    paramRule:{
                        type:'',
                        rule:'',
                    },
                    paramValue:'',
                })

               console.log(this.form)
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

            //获取权限
            getAllPermission(){
                let vm = this
                Permission.getAllPermission(1).then(function(val)
                {
                    vm.options = vm.getMenuName(val)
                })
            },

            //获取id
            handleChange(value) {
                this.id = value[value.length-1];
            },

            //确认
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

            //添加规则
            addRule:function(item){
                this.dialogVisible_rule =true
                console.log(item)
            },

            //是否编辑
            isEdit:function(){

                console.log(this.dataInfo)

                if(this.dataInfo.srd != null){
                    this.id = this.dataInfo.srd.id
                    this.form.url = this.dataInfo.srd.dataUrl
                    this.form.region = this.dataInfo.srd.dataType
                    this.form.data_method = this.dataInfo.srd.dataMethod
                    this.form.parameter = [ ...this.dataInfo.srdpList]
                    this.changeShow(this.form.region)
                    if(this.form.region === 'table') {

                        this.form.pageSize = this.dataInfo.srdpList.filter(p => {
                            return p.paramDesc === "pagesize"
                        })[0].paramKey
                        this.form.page = this.dataInfo.srdpList.filter(p => {
                            return p.paramDesc === "page"
                        })[0].paramKey
                        this.removeParameter(this.dataInfo.srdpList.filter(p => {
                            return p.paramDesc === "pagesize"
                        })[0])
                        this.removeParameter(this.dataInfo.srdpList.filter(p => {
                            return p.paramDesc === "page"
                        })[0])
                    }


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

                        if(a.paramRule != '')
                        a.paramRule = JSON.parse(a.paramRule)
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
    .el-collapse{
        padding-top: 10px;
    }
</style>
