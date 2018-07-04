<template>
    <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="selectedOptions">
                <el-cascader
                    expand-trigger="hover"
                    :options="options"
                    v-model="form.selectedOptions"
                    filterable
                    :props="props_option"
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="显示类型" prop="region">
                <el-select v-model="form.region" placeholder="请选择显示模式">
                    <el-option label="表格" value="table"></el-option>
                    <el-option label="页面" value="table"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="URL" prop="url">
                <el-input v-model="form.url" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="参数" prop="url">
                <el-button @click.prevent="addParameter()">添加参数</el-button>
            </el-form-item>
        </el-form>

        <el-form :model="parameter" ref="parameter" label-width="100px" class="demo-dynamic">
            <el-form-item
                v-for="(item, index) in parameter"
                :label="'参数' + index"
                :key="item.key"
                :prop="'item.' + index + '.name'"
                :rules="{required: true, message: '参数不能为空', trigger: 'blur'}"
            >
                <el-input v-model="item.name" placeholder="填写参数名称" style="width: 150px;"></el-input>
                <el-input v-model="item.desc" placeholder="填写参数描述" style="width: 150px;"></el-input>
                <el-checkbox v-model="item.isShow">表格显示</el-checkbox>
                <el-checkbox v-model="item.isSearch">表格查询</el-checkbox>
                <el-button @click.prevent="removeParameter(item)">删除</el-button>
            </el-form-item>
        </el-form>



    </div>

</template>
<script>
    import {Permission} from "../../axios/Permission";
    export default {
        name: 'OptionPage',
        data() {
            return {
                rules:{
                    selectedOptions:[
                        { required: true, message: '请选择接入系统页面', trigger: 'change' },
                    ],
                    region:[
                        { required: true, message: '请选择接入类型', trigger: 'change' }
                    ],
                    url:[
                        { required: true, message: '请填写接口地址', trigger: 'blur' }
                    ]
                },
                form:{
                    selectedOptions:[],
                    region:'',
                    url:'',
                },

                parameter:[
                    {
                        name:'',
                        type:'',
                        isShow:'',
                        desc:'',
                        isSearch:'',
                    },
                ],
                options:[],
                selectedOptions:[],
                props_option:{
                    value:'id',
                    label:'name',
                    children:'children'
                }
            }
        },
        methods:{
            //删除参数
            removeParameter(item){

                var index = this.parameter.indexOf(item)
                if (index !== -1) {
                    this.parameter.splice(index, 1)
                }

            },

            //添加参数
           addParameter(){
                this.parameter.push({
                    name:'',
                    type:'',
                    isShow:'',
                    desc:'',
                    isSearch:'',
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

            getAllPermission(){
                let vm = this
                Permission.getAllPermission(1).then(function(val)
                {
                    vm.options = vm.getMenuName(val)
                })
            },
            handleChange(value) {
                console.log(value[value.length-1]);
            }
        },

        mounted(){
            this.getAllPermission();
        }

    }

</script>
<style>

</style>
