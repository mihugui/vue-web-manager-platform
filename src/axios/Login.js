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
    }
}
