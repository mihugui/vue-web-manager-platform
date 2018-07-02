<template>
    <div>
        <div :style = 'login_header'>
            <div :style="login_logo"></div>
        </div>
        <div :style = "login_middle">
            <div :style="login_adv_img"></div>
        <div class="login-page" @keyup.enter="login">
            <el-form class="login-form">
                <h1 class="main-title">中心平台系统</h1>
                <el-form-item>
                    <el-input
                        :autofocus="true"
                        placeholder="请输入账号"
                        v-model="username" >
                        <template slot="prepend"><i class="el-icon-mobile-phone"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input
                        placeholder="请输入密码"
                        type="password"
                        v-model="password">
                    <template slot="prepend"><i class="el-icon-info"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input
                        placeholder="请输入验证码"
                        v-model="seccode">
                        <template slot="prepend"><i class="el-icon-success"></i></template>
                    </el-input>
                    <img :src="imgurl"  @click="getimg" style="position: absolute;top: 8px;left: 305px;">
                </el-form-item>
                <el-form-item>
                    <el-button style="width:100%" @click.native="login" type="primary" :loading="isBtnLoading">{{btnText}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        </div>
    </div>
</template>
<script>
    import {loginpage} from '../axios/Login'
    import { mapGetters,mapMutations,mapActions} from 'vuex'
    export default {
        name: 'LoginPage',
        data() {
            return {
                username: '',
                password: '',
                seccode:'',
                imgurl:'',
                random:0,
                isBtnLoading: false,
                // login_background: {
                //     'font-size': '16px',
                //     position: 'fixed',
                //     width: '100%',
                //     'min-width': '592px',
                //     height: '100%',
                //     backgroundRepeat: 'no-repeat',
                //     backgroundImage: 'url(' + require('../assets/login.jpg') + ')'
                // },
                login_header:{
                    width: '1020px',
                    //margin: '0 auto',
                    height: '70px',
                    'padding-top': '50px',

                },
                login_logo:{
                    height: '45px',
                    width: '310px',
                    margin: '0 auto 0 150px',
                    background: 'url(' + require('../assets/img.png') + ') left -54px no-repeat',
                },
                login_middle:{
                    height: '450px',
                    width: '100%',
                    'min-width': '592px',
                    overflow: 'hidden',
                    background:'#0085d0',
                    backgroundImage: 'url(' + require('../assets/back-01.png') + ')',
                },
                login_adv_img:{
                    width: '366px',
                    height: '199px',
                    margin: '85px auto 0 150px',
                    background: 'url(' + require('../assets/img.png') + ') left -183px no-repeat',
                }
            }
        },
        computed:{
            btnText() {
                if (this.isBtnLoading) return '登录中...';
                return '登录';
            },
            ...mapGetters({
                myComponents: 'mycomponents',

            }),

            ...mapMutations({
                setUserRoutes : 'SET_USER_ROUTES',
                setUserName : 'SET_USER_NAME'
            })

        },

        methods:{
            login(){
                var vm = this;
                if(!vm.username){
                    vm.$message.error('请输入用户名！！！');
                    return;
                }
                if(!vm.password){
                    vm.$message.error('请输入密码！！！');
                    return;
                }
                if(!vm.seccode){
                    vm.$message.error('请输入验证码！！！');
                    return;
                }

                let loginParams = {username:vm.username,userpwd:vm.password,validatecode:vm.seccode,random:this.random};
                vm.isBtnLoading = true;
                loginpage.loginget(loginParams).then(res => {
                    vm.isBtnLoading = false;
                    if(res.data.retcode === 200){
                        let result = res.data.data.split(",");
                        sessionStorage.setItem("token",result[0]);
                        sessionStorage.setItem("username",result[1]);
                        vm.getDictsData();
                        vm.$router.push('/selectPlace');
                    }else{
                        vm.$message.error(res.data.retmsg);
                        return Promise.reject({
                            message: '登录异常！'
                        });
                    }
                }).catch();
            },
            getimg(){
                this.random = new Date().getTime().toString();
                this.imgurl=loginpage.getimgurl(this.random);
            },
            ...mapActions({
                 getDictsData:'GET_DICTS_DATA'
            })
        },
        mounted () {
            this.getimg();
        }
    }
</script>
<style scoped>
    #app{display: table;width:100%;}
    .main-title{text-align: center;}
    .des{text-align: center;color:#999;margin-bottom: 2em;}
    .login-form{width: 400px;margin:13% auto 0;}
    .login-page{
        position:absolute;
        border-radius:25px;
        padding: 10px;
        background:#fff;
        right:50px;
        top:150px;
    }
</style>
