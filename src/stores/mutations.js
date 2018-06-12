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
    }
}

export default mutations
