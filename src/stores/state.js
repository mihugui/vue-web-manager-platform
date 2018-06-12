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
    system:'xfxt',
    showedit:true,
    showdel:true,
    buttonpermission:'',
    asideinfo:[
        {"id":1, "system":"xfxt","name":"消费系统","icon":"fab fa-apple","url":"aaaa","pId":null,"button":null,
            "list":[
                {"id":11,"system":null,"name":"消费系统菜单一","icon":"fab fa-apple","url":"aaaa","pId":1,"button":null,"list":[
                        {
                            "id":111,
                            "system":null,
                            "name":"消费系统菜单一一",
                            "icon":"fab fa-apple",
                            "url":"aaaa",
                            "pId":11,
                            "button":null,
                            "list":[]
                        }
                    ]},
                {"id":12,"system":null,"name":"消费系统菜单二","icon":"fab fa-apple","url":"aaaa","pId":1,"button":null,"list":[]}]},
        {"id":2,"system":"mjxt","name":"门禁系统","icon":"fab fa-apple","url":"aaaa","pId":null,"button":null,
            "list":[
                {"id":21,"system":null,"name":"门禁系统菜单一","icon":"fab fa-apple","url":"aaaa","pId":2,"button":null,"list":[]},
                {"id":22,"system":null,"name":"门禁系统菜单二","icon":"fab fa-apple","url":"aaaa","pId":2,"button":null,"list":[]}]
        }],
    systeminfo:[
        {
            "id":1,
            "system":"xfxt",
            "name":"消费系统",
            "icon":"fab fa-apple",
            "url":"aaaa",
            "pId":null,
            "button":null
        },{
            "id":2,
            "system": "mjxt",
            "name":"门禁系统",
            "icon":"fab fa-apple",
            "url":"aaaa",
            "pId":null,
            "button":null
    }]
}

export default state
