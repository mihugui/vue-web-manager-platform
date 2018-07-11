/*
* 全局变量，状态管理
* */
const state = {

    //表格配置数据(测试)
    test:[{
        id:1,
        value:'name',
        name:'姓名',
        is_show:'1',
        is_search:'1',
        is_edit:'1',
        rule:[
            { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
    },{
        id:2,
        value:'age',
        name:'年龄',
        is_show:'1',
        is_search:'1',
        is_edit:'1',
        rule:[
            { required: true, message: '请输入员工年龄', trigger: 'blur' }
        ],
    },{
        id:3,
        value:'address',
        name:'住址',
        is_show:'1',
        is_search:'0',
        is_edit:'1',
        rule:[
            { required: true, message: '请输入员工住址', trigger: 'blur' }
        ],
    }],


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
    DataUrl:'', // 获取数据URL
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
            require(['@/components/ImportSystem/OptionPage'],resolve)
        },
        importurl:(resolve) => {
            require(['@/components/ImportSystem/ImportUrl'],resolve)
        },
        importtable:(resolve) => {
            require(['@/components/ImportSystem/ImportTable'],resolve)
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
