
/*
* 全局变量，状态管理
* */

const state = {
    system:'manager',
    showedit:false,
    showdel:false,
    asideinfo:[{
        system:'manager',
        name:'园区管理',
        url:'/yqgl',
        icon:'fa fa-globe fa-2x'
    },{
        system:'manager',
        name:'企业管理',
        url:'/yqgl',
        icon:'fa fa-home fa-2x'
    },{
        system:'test',
        name:'用户管理',
        url:'/yqgl',
        icon:'fa fa-group fa-2x'
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
