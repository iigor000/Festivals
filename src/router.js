import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import OrganizerPage from './components/OrganizerPage.vue'
import FestivalPage from './components/FestivalPage.vue'
import FestivalsPage from './components/FestivalsPage.vue'
import OrganizerEdit from './components/OrganizerEdit.vue'
import AccountPage from './components/AccountPage.vue'
import ErrorPage from './components/ErrorPage.vue'

const routes = [
  { path: '/', component: HomePage },
  {
    path: '/organizer/:id',
    name: 'organizer',
    component: OrganizerPage,
    props: true
  },
  {
    path: '/festival/:id/:festivalsId',
    name: 'festival',
    component: FestivalPage,
    props: true
  },
  {path: '/festivali', component: FestivalsPage},
  {
    path: '/organizerEdit/:id',
    name: 'organizerEdit',
    component: OrganizerEdit,
    props: true
  },
  {
    path: '/account', component: AccountPage
  },
  {
    path: '/error', component: ErrorPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes // short for `routes: routes`
})

export default router