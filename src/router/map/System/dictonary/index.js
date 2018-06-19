const index = resolve => {
    require(['@/components/MainLayout'], resolve)
}

const table = resolve => {
    require(['@/components/SystemManager/dictonary'], resolve)
}

let router = [
    {
        name:'MainLayout',
        path: '/',
        component: index,
        children:[{
            name:'dictonary',
            path:'dictonary',
            component:table,
        }]
    },

]

export default router
