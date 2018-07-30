<template>
    <el-popover
        placement="bottom"
        width="500"
        trigger="click">
        <template>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedPlaces"  size="mini" @change="handleCheckedPlacesChange">
                <el-checkbox-button v-for="place in places" :label="place.id" :key="place.id" border>{{place.placeName}}</el-checkbox-button>
            </el-checkbox-group>
        </template>
        <el-button type="primary" icon="el-icon-edit" slot="reference" circle></el-button>
    </el-popover>
</template>
<script>
    import {Permission} from "../axios/Permission";
    import { mapGetters,mapMutations } from 'vuex'
    export default {
        name: 'LoginPage',
        data() {
            return {
                places:[],
                checkAll: false,
                checkedPlaces:[],
                isIndeterminate: true,
                allPlace:[],
            }
        },
        methods:{
            handleCheckAllChange(val) {
                this.checkedPlaces = val? this.allPlace:[];
                this.isIndeterminate = false;
                this.setPlaceIds(this.checkedPlaces)
            },

            handleCheckedPlacesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.places.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.places.length;
                this.setPlaceIds(this.checkedPlaces)
            },

            gerUserPlace:function(){
                let vm =this
                Permission.getUserPlaces().then(function(val){
                    vm.places = val;
                    for(let place of vm.places)
                    {
                        vm.allPlace.push(place.id)
                    }
                    if(sessionStorage.getItem('placeIds') === null){
                        vm.checkedPlaces = vm.allPlace
                        vm.setPlaceIds(vm.allPlace)
                    }else{
                        vm.checkedPlaces = JSON.parse(sessionStorage.getItem('placeIds'))
                        vm.setPlaceIds(JSON.parse(sessionStorage.getItem('placeIds')))
                    }
                    console.log(vm.checkedPlaces)
                })
            },

            ...mapMutations({
                setPlaceIds : 'SET_PLACE_IDS',
            }),
        },

        computed:{
            ...mapGetters({
                placeIds:'placeIds'
            })
        },

        mounted () {
            this.gerUserPlace();
        }
    }
</script>
<style scoped>
    /*.el-checkbox+.el-checkbox {*/
        /*margin-left: 0px !important;*/
    /*}*/
</style>
