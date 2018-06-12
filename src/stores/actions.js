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

    let tableurl = state.tableurl;
    var qs = require('qs');
    axios.post(url.allurl+tableurl,qs.stringify(data)).then(function(res){
        console.log(res);
    }).catch(function(error){
        console.log(error)
    });
}


export const GET_ALL_PERMISSION = async({ dispatch, commit, state })=>{

}

export const SET_BUTTON_PERMISSION = async({ dispatch, commit, state },data)=>{
    commit(types.SET_BUTTON_PERMISSION,data.filter(Permission=>{
        return Permission.button ===1;
    }))
}

export const SET_ASIDETITLE_PERMISSION = async({ dispatch, commit, state },data)=>{
    commit(types.SET_ASIDETITLE_PERMISSION,data.filter(Permission=>{
        return Permission.pId ===null;
    }))
}

export const SET_SYSTEM_PERMISSION = async({ dispatch, commit, state },data)=>{
    for(let system of state.systeminfo ){

    }
}

