const test = resolve => {
    require(['@/components/Search'], resolve)
}

let router = [
    {
        path: '/test',
        component: test,
    }
]

export default router
