/*
* 全局state状态修改提交
* */

import * as types from './mutation-types'

const mutations = {
    [types.SHOW_DEL_BUTTON](state,data){
        state.show = data;
    },

    [types.SET_TREE_IDS](state,data){
        state.treeids = data;
    },

    [types.SHOW_EDIT_BUTTON](state,data){
        state.show = data;
    },

    [types.SET_TABLE_URL](state,data){
        state.tableurl = data;
    },

    [types.SET_TABLE_DATA](state,data){
        state.tableData = data;
    },

    [types.SET_TOKEN_DATA](state,data){
        state.token = data;
    },

    [types.SET_BUTTON_PERMISSION](state,data){
        state.buttonpermission = data;
    },

    [types.SET_SYSTEM_PERMISSION](state,data){
        state.systeminfo = data;
    },

    [types.SET_ASIDETITLE_PERMISSION](state,data){
        state.asideinfo = data;
    },

    [types.SET_ALL_PERMISSION](state,data){
        state.permission = data;
    },

    [types.SET_SURE_URL](state,data){
        state.sureurl = data;
    },

    [types.SET_TABLE_TOTAL](state,data){
        state.total = data;
    },

    [types.SET_USER_ROUTES](state,data){
        state.userroutes = data;
    },
    [types.SET_DICTS_DATA](state,data){
        state.dicts = data;
    },

    [types.SET_SYSTEM_TITLE](state,data){
        sessionStorage.setItem("system",data)
        state.system = data;
    },

    [types.SET_PERMISSION_URL](state,data){
        state.permissionUrl = data;
    },

    [types.SET_CHECK_URL](state,data){
        state.checkUrl = data;
    },

    [types.SET_DATA_BYURL](state,data){
        state.DataUrl = data;
    },

    [types.SET_PLACE_IDS](state,data){
        sessionStorage.setItem('placeIds',JSON.stringify(data))
        state.placeIds = data;
    },

    [types.SET_USER_PLACE](state,data){
        state.userPlace = data;
    },
}

export default mutations
