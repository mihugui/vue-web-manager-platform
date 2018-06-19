
const index = resolve => {
    require(['@/components/MainLayout'], resolve)
}

const table = resolve => {
    require(['@/components/SystemManager/PlaceManager'], resolve)
}

let router = [
    {
        name:'MainLayout',
        path: '/',
        component: index,
        children:[{
            name:'system/place',
            path:'place',
            component:table,
        }]
    },

]

export default router
