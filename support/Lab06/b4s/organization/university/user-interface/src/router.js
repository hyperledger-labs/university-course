import Vue from 'vue'
import Router from 'vue-router'
import frontend from '../views/University-frontend.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: frontend
        },
    ]
})