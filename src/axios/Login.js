import url from '../globbal/url'
import axios from 'axios';
import CryptoJS from "crypto-js";

export const loginpage = {
    //密码加密
     password:function(pwd){
         const key = CryptoJS.enc.Utf8.parse('shzdcmcc20180525');
         const options = {
             mode: CryptoJS.mode.ECB,
             padding: CryptoJS.pad.Pkcs7
         };
         const encryptedData = CryptoJS.AES.encrypt(pwd, key, options);
         const encryptedBase64Str = encryptedData.toString();
         return encryptedBase64Str;
     },
    //获取图片url
    getimgurl:function getimgurl(random){
         return url.allurl+"/validateCode?random="+random;
    },
    //登陆
    loginget:function loginget(params)
    {
        params.userpwd = this.password(params.userpwd);
        var qs = require('qs');
        return axios.post(url.allurl+'/login',qs.stringify(params));
    },

    //密码修改
    updatePwd:function updatePwd(params)
    {
        params.oldpwd = this.password(params.oldpwd);
        params.newpwd = this.password(params.newpwd);
        var qs = require('qs');
        return axios.post(url.allurl+'/user/updatePwd',qs.stringify(params));
    },

    //密码重置
    resetPwd:function updatePwd(params)
    {
        var qs = require('qs');
        return axios.post(url.allurl+'/user/resetPwd',qs.stringify(params));
    },

    logout:function logout(){

        const promise = new Promise(function(resolve, reject) {
            axios.post(url.allurl + '/logout') .then(res =>{
                resolve(res.data.retcode);
                sessionStorage.clear();
            }).catch(error => {
                reject(error);
            })
        });
        return promise;

    }
}
