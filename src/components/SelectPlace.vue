<template>
<div
    style="width: 100%;height: 400px"
    v-loading="loading">
    <el-dialog
        title="请选择园区"
        :visible.sync="dialogVisible"
        width="500px"
        heigth="80%"
        :modal-append-to-body="true"
        :close-on-click-modal="false"
        style="z-index: 99999;">
            <span>
                <el-radio-group v-model="selplace">
                    <el-radio-button
                        v-for="item in places"
                        :key="item.id"
                        :label="item.id" >
                        {{item.placeName}}
                    </el-radio-button>
                </el-radio-group>
            </span>
        <span slot="footer" class="dialog-footer">
                <el-button @click="selectOther">取 消</el-button>
                <el-button type="primary" @click="selectPlace">确 定</el-button>
            </span>
    </el-dialog>
</div>
</template>
<script>
    import {Permission} from "../axios/Permission";
    import { mapGetters,mapActions } from 'vuex'
    import * as types from "../stores/mutation-types"

    export default{
        data(){
            return{
                dialogVisible:false,
                loading:true,
                places:[],
                selplace:'',
            }
        },

        computed:{
            ...mapGetters({
                myComponents: 'mycomponents',
            }),

        },
        methods: {

            ...mapActions({
                setDefaultPlace:"SET_DEFAULT_PLACE"
            }),

            selectOther:function(){
                console.log(this.selplace)
                this.$message.info('正在跳转到默认园区')
                this.getUserPlacePermission(this.selplace)
                this.dialogVisible =false;
            },
            selectPlace:function(){
                sessionStorage.setItem("placeId",this.selplace)
                this.setDefaultPlace({"placeId":this.selplace,isDefault:1})
                this.$message.info('正在跳转到选择园区')
                this.getUserPlacePermission(this.selplace)
                this.dialogVisible =false;
            },

            getUserPlacePermission:function(){
                let vm = this
                Permission.getUserPermission(1).then(function(val){
                    let userRoutes = Permission.getrouter(val,vm.myComponents);
                    vm.$router.addRoutes(userRoutes);
                    vm.$router.push('/');
                });
            },

            gerUserPlace:function(){
                let vm =this
                Permission.getUserPlaces().then(function(val){
                    console.log(val.length);
                    if(val.length === 1){
                        sessionStorage.setItem("placeId",val[0].id)
                        vm.getUserPlacePermission(vm.placeId)
                    }else if(val.filter(p=>{return p.isDefault === "1"}).length >= 1) {
                        sessionStorage.setItem("placeId", val[0].id)
                        vm.getUserPlacePermission(val[0].id)
                    }else{
                        vm.dialogVisible = true
                        vm.loading = false;
                        vm.places = val;
                    }
                })
            },


        },
        mounted () {
            this.gerUserPlace();
        }
    }
</script>
<style>

</style>
