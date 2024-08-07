import { createMemoryHistory, createRouter } from 'vue-router'

import LaunchPad from "../views/launch_pad"
import Test from "../views/test"

const routes = [
    {path: "/", component: LaunchPad},
    {path: "/test", component: Test},
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router