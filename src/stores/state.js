/*
* 全局变量，状态管理
* */
const state = {
    token:'123',
    tableurl:'',
    total:100,
    tableData:[{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    }],
    system:'manager',
    showedit:true,
    showdel:true,
    buttonpermission:'',
    asideinfo:[{
        system:'manager',
        name:'园区管理',
        icon:'fa fa-globe fa-2x',
        children:[{
            name:'洛阳园区',
            children:[{
                name:'洛阳园区-分区',
                children:[{
                    name:'洛阳园区-分区中的分区',
                    url:'/yqgl',
                }]
            }]
        },{
            system:'manager',
            name:'园区管理',
            icon:'fa fa-globe fa-2x',
        }]
    },{
        system:'manager',
        name:'企业管理',
        url:'/yqgl',
        icon:'fa fa-home fa-2x'
    },{
        system:'test',
        name:'用户管理',
        url:'/yqgl',
        icon:'fa fa-group fa-lg'
    },{
        system:'manager',
        name:'资源管理',
        url:'/yqgl',
        icon:'fa fa-briefcase fa-lg',
    },{
        system:'manager',
        name:'日志管理',
        url:'/yqgl',
        icon:'fa fa-calendar fa-lg',
    },{
        system:'manager',
        name:'数据字典管理',
        url:'/yqgl',
        icon:'fa fa-book fa-lg',
    }],
    systeminfo:[{
        icon:'fa fa-money',
        url: '/login',
        name: '消费系统',
    },{
        icon:'fa fa-map-signs',
        url: 'login',
        name: '门禁系统',
    },{
        icon:'fa fa-map-signs',
        url: 'login',
        name: '***系统',
    }]
}

export default state
