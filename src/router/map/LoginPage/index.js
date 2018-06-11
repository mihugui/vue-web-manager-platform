
const index = resolve => {
    require(['@/components/LoginPage.vue'], resolve)
}

let router = [
    {
        path: '/login',
        component: index
    }
]

export default router
