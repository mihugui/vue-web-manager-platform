
const index = resolve => {
    require(['@/components/SelectPlace.vue'], resolve)
}

let router = [
    {
        path: '/selectPlace',
        component: index
    }
]

export default router
