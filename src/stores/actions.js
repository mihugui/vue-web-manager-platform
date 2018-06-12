/*
* 异步操作
* */
import * as types from './mutation-types'
import url from "../globbal/url";
import axios from "axios/index";


export const USER_INFO = async ({ dispatch, commit, state }, data) => {
    //dispatch可调用其他action方法

}

export const GET_TABLE_DATA = async({ dispatch, commit, state }, data)=>{

    console.log(data);
    let tableurl = state.tableurl;
    var qs = require('qs');
    axios.post(url.allurl+tableurl,qs.stringify(data)).then(function(res){
        console.log(res);
    }).catch(function(error){
        console.log(error)
    });
}

