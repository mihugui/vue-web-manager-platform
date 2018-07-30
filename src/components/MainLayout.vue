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
                    <!--<el-menu-item index="1" @click="changePlace">{{  placename }}</el-menu-item>-->
                    <!--<el-submenu index="2">-->
                        <!--<template slot="title">{{username}}</template>-->
                        <!--<el-menu-item index="1-1" @click="updatePWD">密码修改</el-menu-item>-->
                        <!--<el-menu-item index="1-2" @click="resetRouter">界面重置</el-menu-item>-->
                        <!--<el-menu-item index="1-3" @click="logout">退出</el-menu-item>-->
                    <!--</el-submenu>-->
                    <place-button></place-button>
                    <el-dropdown index="2" @command="clickdropdown">
                      <span class="el-dropdown-link">
                        {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="updatePWD">密码修改</el-dropdown-item>
                            <el-dropdown-item command="resetRouter">界面重置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu>
            </div>
            </div>
        </el-header>
        <el-container class="maintype">
            <el-aside :width="myWidth"><mini-asidetitle :AsideTitle="AsideTitle" :isCollapse="isCollapse"></mini-asidetitle></el-aside>
            <el-main>
                <router-view v-if="isRouterAlive"></router-view>
            </el-main>
        </el-container>
        <el-dialog
            title="请选择园区"
            :visible.sync="dialogVisible_place"
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
                <el-button @click="dialogVisible_place=false">取 消</el-button>
                <el-button type="primary" @click="selectPlace">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="密码修改"
            :visible.sync="dialogVisible_pwd"
            width="600px"
            heigth="80%"
            :modal-append-to-body="true"
            :close-on-click-modal="false"
            style="z-index: 99999;">
            <span>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="旧密码" prop="oldPwd">
                    <el-input  type="password" v-model="ruleForm.oldPwd" ></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" v-model="ruleForm.newPwd" ></el-input>
                  </el-form-item>
                  <el-form-item label="新密码确认" prop="validatePwd">
                    <el-input type="password" v-model="ruleForm.validatePwd" ></el-input>
                  </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_pwd=false">取 消</el-button>
                <el-button type="primary" @click="updatePwd">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>
<script>
    import SystemTitle from '@/components/SystemTitle'
    import AsideTitle from '@/components/AsideTitle'
    import SelectPlace from '@/components/SelectPlace'
    import PlaceButton from '@/components/PlaceButton'
    import {loginpage} from '../axios/Login'
    import {Permission} from "../axios/Permission";
    import { mapGetters,mapActions,mapMutations} from 'vuex'
    import * as types from '../stores/mutation-types'
    export default {
        name: "MainLayout",
        data(){
            var checkNewPwd = (rule, value, callback) => {
                if(value != this.ruleForm.newPwd) {
                    return callback(new Error('两次密码不一致'));
                }else{
                    return  callback()
                }

            };

            return {
                ruleForm:{
                    oldPwd:'',
                    newPwd:'',
                    validatePwd:''
                },
                rules:{
                    oldPwd:[
                        { required: true, message: '请输入旧密码', trigger: 'blur' },
                    ],
                    newPwd:[
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { pattern:/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/, message: '密码格式(字母，数字，符号)'}
                    ],
                    validatePwd:[
                        { required: true, message: '请重新输入密码', trigger: 'blur' },
                        { validator: checkNewPwd, trigger: 'blur' }
                    ],

                },
                isRouterAlive:true,
                dialogVisible_place:false,
                dialogVisible_pwd:false,
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
                },

                checkAll: false,
                checkedCities:[],
                isIndeterminate: true,
                allPlace:[],
            }
        },

        methods:{

            clickdropdown(command){

                switch(command){
                    case 'logout':
                        this.logout()
                        break;
                    case 'resetRouter':
                        this.resetRouter()
                        break;
                    case 'updatePWD':
                        this.updatePWD()
                        break;
                }

            },

            changePlace(){
              this.dialogVisible_place=true
            },

            updatePWD(){
              this.dialogVisible_pwd = true
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
                        vm.setUserPlace(val)
                })
            },

            updatePwd:function(){
                let vm = this
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let loginParams = {oldpwd: this.ruleForm.oldPwd, newpwd: this.ruleForm.newPwd};
                        loginpage.updatePwd(loginParams).then(res => {
                            if(res.data.retcode === 200){
                                vm.$message.success('修改密码成功')
                                vm.dialogVisible_pwd = false
                            }else{
                                vm.$message.success(res.data.retmsg)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            //重新加载组件
            reload(){
                this.isRouterAlive = false
                this.$nextTick(() => (this.isRouterAlive = true))
            },

            ...mapActions({
                getUserPermission: 'GET_USER_PERMISSION',
                setDefaultPlace:"SET_DEFAULT_PLACE"
            }),
            ...mapMutations({
                setSystemTitle : 'SET_SYSTEM_TITLE',
                setUserPlace:types.SET_USER_PLACE
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

        watch:{
            placeIds:function () {
                this.reload();
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
                placeIds:'placeIds',
            })
        },
        components: {
            'mini-system': SystemTitle,
            'mini-asidetitle':AsideTitle,
            'select-place':SelectPlace,
            'place-button':PlaceButton
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
        min-width: 1200px;
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
        padding-right: 20px;
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
