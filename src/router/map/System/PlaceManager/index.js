
const index = resolve => {
    require(['@/components/MainLayout'], resolve)
}

let router = [
    {
        path: '/system/place',
        component: index,
    },

]

export default router
