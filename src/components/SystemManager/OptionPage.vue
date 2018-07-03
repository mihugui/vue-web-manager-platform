<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="活动名称" prop="name">
            <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            filterable
            :props="props_option"
            @change="handleChange">
            </el-cascader>
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
