
const index = resolve => {
    require(['@/components/MainLayout'], resolve)
}

const table = resolve => {
    require(['@/components/SystemManager/CompanyManager'], resolve)
}

let router = [
    {
        name:'MainLayout',
        path: '/',
        component: index,
        children:[{
            name:'CompanyManager',
            path:'CompanyManager',
            component:table,
        }]
    },

]

export default router
