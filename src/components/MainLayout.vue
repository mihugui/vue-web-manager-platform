<template>
    <el-container>
        <el-header>
            <div>
                <div class="fl title" style="display: inline-block;"><img style="margin-top: 12px ;width:160px" src="../assets/logo.png">
                    <!--<div :style="main_logo"></div>-->
                    </div>
                <div class="fl system">
                    <mini-system :SystemTitle="SystemTitle" :changeSystem="changeSystem"></mini-system>
                </div>
                <div class="fr">
                <el-menu  class="el-menu-demo"
                          mode="horizontal"
                          background-color="#36a8fc"
                          text-color="#fff"
                          active-text-color="#ffd04b" >
                <el-submenu index="1">
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
    </el-container>
</template>
<script>
    import SystemTitle from '@/components/SystemTitle'
    import AsideTitle from '@/components/AsideTitle'
    import {loginpage} from '../axios/Login'
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    export default {
        name: "MainLayout",
        data(){
            return {
                isCollapse:true,
                myWidth:"65px",
                username:sessionStorage.getItem("username"),
                main_logo:{
                        height: '60px',
                        width: '310px',
                        margin: '0 auto 0 0px',
                        background: 'white url(' + require('../assets/img.png') + ') left -44px no-repeat',
                }
            }
        },


        methods:{
            changertitle(){
                if(window.innerWidth>800) {
                    this.isCollapse = false;
                    this.myWidth = "210px";
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
                loginpage.logout();
                this.$router.push('/login')
            },
            resetRouter:function(){
                sessionStorage.removeItem("permission");
                location.reload();
            },
            ...mapActions({
                getUserPermission: 'GET_USER_PERMISSION'
            }),
            ...mapMutations({
                setSystemTitle : 'SET_SYSTEM_TITLE'
            })
        },
        mounted () {

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
            })
        },
        components: {
            'mini-system': SystemTitle,
            'mini-asidetitle':AsideTitle,
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
        background-color: #36a8fc;
        color: #333;
        text-align: center;
        line-height: 60px;
        padding: 0;
    }
    .el-aside {
        background-color: rgb(84, 92, 100);
        color: #333;
        text-align: center;
        line-height: 200px;
        width: 63px;
    }

    .el-main {
        background-color: #fff;
        color: #333;
        /*text-align: center;*/
        margin:0px 0px 0px 0px;
        height: auto;
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
