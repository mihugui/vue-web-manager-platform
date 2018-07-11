<template>
    <el-container>
        <el-header>
            <div>
                <div class="fl title" style="display: inline-block;background-color: #36a8fc"><img style="margin-top: 12px ;width:160px" src="../assets/logo.png">
                    <!--<div :style="main_logo"></div>-->
                    </div>
                <div class="fl system">
                    <mini-system :SystemTitle="SystemTitle" :changeSystem="changeSystem"></mini-system>
                </div>
                <div class="fr">
                <el-menu  class="el-menu-demo"
                          mode="horizontal"
                          background-color="#fff"
                          text-color="#333"
                          active-text-color="#36a8fc" >
                    <el-menu-item index="1" @click="changePlace">{{  placename }}</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">{{username}}</template>
                        <el-menu-item index="1-1" @click="resetRouter">界面重置</el-menu-item>
                        <el-menu-item index="1-2" @click="logout">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
            </div>
        </el-header>
        <el-container class="maintype">
            <el-aside :width="myWidth"><mini-asidetitle :AsideTitle="AsideTitle" :isCollapse="isCollapse"></mini-asidetitle></el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
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
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="selectPlace">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>
<script>
    import SystemTitle from '@/components/SystemTitle'
    import AsideTitle from '@/components/AsideTitle'
    import SelectPlace from '@/components/SelectPlace'
    import {loginpage} from '../axios/Login'
    import {Permission} from "../axios/Permission";
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "MainLayout",
        data(){
            return {
                dialogVisible:false,
                isCollapse:true,
                myWidth:"65px",
                placename:'',
                username:sessionStorage.getItem("username"),
                selplace:'',
                places:'',
                main_logo:{
                        height: '60px',
                        width: '310px',
                        margin: '0 auto 0 0px',
                        background: 'white url(' + require('../assets/img.png') + ') left -44px no-repeat',
                }
            }
        },

        methods:{

            changePlace(){
              this.dialogVisible=true
            },

            changertitle(){
                if(window.innerWidth>800) {
                    this.isCollapse = false;
                    this.myWidth = "200px";
                }
                else{
                    this.isCollapse = true;
                    this.myWidth = "65px";
                }
            },
            changeSystem:function(val){
                this.setSystemTitle(val);
            },
            logout:function(){
                let vm = this
                loginpage.logout().then(function(val){
                    console.log(val);
                    location.reload();
                });

            },
            resetRouter:function(){
                sessionStorage.removeItem("permission");
                location.reload();
            },

            selectPlace:function(){

                this.setDefaultPlace({"placeId":sessionStorage.getItem("placeId"),isDefault:0})
                sessionStorage.setItem("placeId",this.selplace)
                this.setDefaultPlace({"placeId":this.selplace,isDefault:1})
                this.$message.info('正在跳转到选择园区')
                sessionStorage.removeItem("permission")
                this.dialogVisible =false;
                this.$router.push('/');
                location.reload();
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
                        vm.places = val;
                        vm.selplace = val.filter(p=>{return p.isDefault === "1"})[0].id;
                        vm.placename = val.filter(p=>{return p.isDefault === "1"})[0].placeName;
                })

            },

            ...mapActions({
                getUserPermission: 'GET_USER_PERMISSION',
                setDefaultPlace:"SET_DEFAULT_PLACE"

            }),
            ...mapMutations({
                setSystemTitle : 'SET_SYSTEM_TITLE',
            })
        },
        mounted () {
            this.gerUserPlace();
            this.changertitle();
            var _this =this;
            // 注：window.onresize只能在项目内触发1次
            window.onresize = function windowResize () {
                // 通过捕获系统的onresize事件触发我们需要执行的事件
                _this.changertitle()
            }
        },
        created(){
            this.getUserPermission();
        },
        computed:{
            ...mapGetters({
                AsideTitle: 'asideinfo',
                SystemTitle:'systeminfo',
                myComponents: 'mycomponents',
            })
        },
        components: {
            'mini-system': SystemTitle,
            'mini-asidetitle':AsideTitle,
            'select-place':SelectPlace,
        },
    }
</script>
<style scoped>
    .maintype {
        height: 100%;
        width: 100%;
        position: fixed;
        margin-top: 60px
    }
    .el-header {
        background-color: #fff;
        color: #333;
        text-align: center;
        line-height: 60px;
        padding: 0;
    }
    .el-aside {
        background-color: #36a8fc;
        color: #333;
        text-align: center;
        line-height: 200px;
        width: 63px;
    }

    .el-main {
        background-color: #fff;
        color: #333;
        /*text-align: center;*/
        margin:0px 0px 20px 0px;
        padding:0;
        height: auto;
        width: auto;
        border-top:solid 2px hsla(0,0%,92%,.9)
    }

    .title {
        width: 200px;
        text-align: center;
        line-height: 60px;
        color: #fff;
    }

    .fl {
        float: left;
    }
    .fr {
        float: right;
    }

    .system{
        position:absolute;
        left:210px;
        height:60px ;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
</style>
