/*
* 全局变量，状态管理
* */
const state = {
    treeids:[], //组织数id
    token:'', //token

    //表格相关
    sureurl:'', //添加修改url
    tableurl:'', //表格url
    total:0, // 总数
    tableData:[], // 表格数据
    system:'system', // 当前系统
    showedit:true, // 表格 更改显示
    showdel:true, // 表格 删除显示

    //权限相关
    buttonpermission:'', // 权限按钮
    asideinfo:[], // 权限边框
    systeminfo:[], // 权限系统
    permission:[], //全部权限
    permissionUrl:'', //权限更新url

    //组建定死数据
    mycomponents: {
        place: (resolve) => {
            require(['@/components/SystemManager/PlaceManager'],resolve)
        },
        source: (resolve) => {
            require(['@/components/SystemManager/ResourceManagement'],resolve)
        },
        enterprise: (resolve) => {
            require(['@/components/SystemManager/EnterpriseManager'],resolve)
        },
        user: (resolve) => {
            require(['@/components/SystemManager/UserManager'],resolve)
        },
        role: (resolve) => {
            require(['@/components/SystemManager/RoleManager'],resolve)
        },
        log: (resolve) => {
            require(['@/components/SystemManager/LogManagement'],resolve)
        },
        dictonary: (resolve) => {
            require(['@/components/SystemManager/dictonary'],resolve)
        },
        optionpage:(resolve) => {
            require(['@/components/SystemManager/OptionPage'],resolve)
        },
    },

    //路由
    userroutes:false,

    //数据字典
    dicts:[],

    //检测编号是否存在
    checkUrl:''

}

export default state
