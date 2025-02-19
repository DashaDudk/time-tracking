import { createRouter, createWebHashHistory } from "vue-router";

import ActivityReports from "./views/ActivityReports.vue";
 
export default createRouter({
    history: createWebHashHistory(),  /* забезпечує історію браузера (користувач може натискати «назад») */
    routes: [
    { path: '/reports', component: ActivityReports},
    ]
})