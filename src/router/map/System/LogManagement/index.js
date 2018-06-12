
const index = resolve => {
    require(['@/components/MainLayout'], resolve)
}

const table = resolve => {
    require(['@/components/SystemManager/LogManagement'], resolve)
}

let router = [
    {
        name:'MainLayout',
        path: '/',
        component: index,
        children:[{
            name:'log',
            path:'log',
            component:table,
        }]
    },

]

export default router
