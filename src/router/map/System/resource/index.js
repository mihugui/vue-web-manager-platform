const index = resolve => {
    require(['@/components/MainLayout'], resolve)
}
const resource = resolve => {
    require(['@/components/SystemManager/ResourceManagement'], resolve)
}

let router = [
    {
        name:'MainLayout',
        path: '/',
        component: index,
        children:[{
            name:'source',
            path:'system/source',
            component:resource,
        }]
    },

]

export default router
