/*
* 全局公用数据条件筛选
* */
export const asideinfo = (state) =>{
    return state.asideinfo.filter(p=>{return p.system===state.system})
}

export const systeminfo = state => state.systeminfo

export const showedit = state => state.showedit

export const showdel = state => state.showdel

export const tableData = state => state.tableData

export const total = state => state.total

export const tableurl = state => state.tableurl



