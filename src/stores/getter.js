/*
* 全局公用数据条件筛选
* */
export const asideinfo = (state) =>{
    if(state.asideinfo.filter(p=>{return p.system===sessionStorage.getItem("system")}).length != 0 ) {
        return state.asideinfo.filter(p => {
            return p.system === state.system
        })[0].children
    }else{
        return []
    }
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

export const buttonpermission = state => state.buttonpermission

export const userroutes = state => state.userroutes

export const dicts = state =>state.dicts

export const permissionUrl= state =>state.permissionUrl

export const test = state => state.test

export const placeIds = state => state.placeIds

export const userPlace = state  => state.userPlace
