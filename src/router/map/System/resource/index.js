const index = resolve => {
    require(['@/components/MainLayout'], resolve)
}
const table = resolve => {
    require(['@/components/SystemManager/resource'], resolve)
}

let router = [
    {
        name:'MainLayout',
        path: '/',
        component: index,
        children:[{
            name:'source',
            path:'source',
            component:table,
        }]
    },

]

export default router
