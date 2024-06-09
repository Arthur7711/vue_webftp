import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/Index'
import Edit from "@/views/Edit";
import Add from "@/views/Add";
import Stats from "@/views/Stats";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/index',
            name: 'index',
            component: Index
        },
        {
            path: "/edit/:id",
            name: "edit",
            component: Edit
        },
        {
            path: "/add",
            name: "add",
            component: Add
        },
        {
            path: "/stats",
            name: "stats",
            component: Stats
        },
        {
            path: '*',
            redirect: 'index',
        },
    ]
})
