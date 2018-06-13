
const index = resolve => {
    require(['@/components/TreeMenu'], resolve)
}


let router = [
    {
        name:'test',
        path: '/test',
        component: index,
    },

]

export default router
