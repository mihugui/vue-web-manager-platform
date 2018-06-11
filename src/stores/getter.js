/*
* 全局公用数据条件筛选
* */
export const asideinfo = (state) =>{
    return state.asideinfo.filter(p=>{return p.system==='manager'})
}

export const systeminfo = state => state.systeminfo

export const showedit = state => state.showedit

export const showdel = state => state.showdel


