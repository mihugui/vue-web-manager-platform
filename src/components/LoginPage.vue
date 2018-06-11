<template>
    <div>
        <div class="login-page" @keyup.enter="login">
            <el-form class="login-form">
                <h1 class="main-title">中心平台系统</h1>
                <p class="des">登陆页面</p>
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
</template>
<script>
    import {loginpage} from '../axios/Login'
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
            }
        },
        computed:{
        btnText() {
            if (this.isBtnLoading) return '登录中...';
            return '登录';
        }
        },
        methods:{
            login(){
                var vm = this;
                console.log(this.random);
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
                    if(res.data.data){
                        console.log(res.data.data);
                    }else{
                        return Promise.reject({
                            message: '登录异常！'
                        });
                    }
                }).catch();
            },
            getimg(){
                this.random = new Date().getTime().toString();
                this.imgurl=loginpage.getimgurl(this.random);
                console.log(this.imgurl);
            }
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
    .login-page{background:#fff;}
</style>
