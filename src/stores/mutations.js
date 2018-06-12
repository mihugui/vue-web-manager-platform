/*
* 全局state状态修改提交
* */

import * as types from './mutation-types'

const mutations = {
    [types.SHOW_DEL_BUTTON](status,data){
        status.show = data;
    },

    [types.SHOW_EDIT_BUTTON](status,data){
        status.show = data;
    },

    [types.SET_TABLE_URL](status,data){
        console.log(data);
        status.tableurl = data;
    },

    [types.SET_TABLE_DATA](status,data){
        status.tableData = data;
    },

    [types.SET_TOKEN_DATA](status,data){
        status.token = data;
    },

    [types.SET_BUTTON_PERMISSION](status,data){
        status.buttonpermission = data;
    },

    [types.SET_SYSTEM_PERMISSION](status,data){
        status.systeminfo = data;
    },

    [types.SET_ASIDETITLE_PERMISSION](status,data){
        status.asideinfo = data;
    },
}

export default mutations
