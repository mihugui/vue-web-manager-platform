
const index = resolve => {
    require(['@/components/AsideTitle'], resolve)
}


let router = [
    {
        name:'test',
        path: '/test',
        component: index,
    },

]

export default router
