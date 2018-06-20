/*
* 全局公用数据条件筛选
* */
export const asideinfo = (state) =>{
    return state.asideinfo.filter(p=>{return p.system===state.system})[0].children
}

export const systeminfo = state => state.systeminfo

export const showedit = state => state.showedit

export const showdel = state => state.showdel

export const tableData = state => state.tableData

export const total = state => state.total

export const tableurl = state => state.tableurl

export const token = state => state.token

export const permission = state => state.permission

export const mycomponents = state =>state.mycomponents

