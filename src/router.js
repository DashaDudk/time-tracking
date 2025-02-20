import { createRouter, createWebHashHistory } from "vue-router";

import ActivityReports from "./views/ActivityReports.vue";
import HomePage from "./views/HomePage.vue";
 
export default createRouter({
    history: createWebHashHistory(),  /* забезпечує історію браузера (користувач може натискати «назад») */
    routes: [
    {path: '/', component: HomePage},
    { path: '/reports', component: ActivityReports},
    ]
})