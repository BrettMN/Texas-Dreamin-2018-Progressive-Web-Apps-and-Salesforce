// Router ///////////////////////////////////////////////////////////

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'games',
    path: '/games/',
    component: Games,
    props: true
  },
  {
    name: 'game',
    path: '/game/:id/',
    component: Game,
    props: true
  },
  {
    name: 'user',
    path: '/user/',
    component: User,
    props: true
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  }
];

const router = new VueRouter({ routes });

const verifyRoute = (to, next) => {
  // if they are verified or going tothe login page let the user continue
  if (store.state.verified || to.fullPath === '/login') {
    next();
  } else {
    next('/login');
  }
};

router.beforeEach((to, from, next) => {
  // load local data if it's not loaded yet
  if (store.state.dataLoaded === false) {
    store.dispatch('loadLocalData').then(() => verifyRoute(to, next));
  } else {
    verifyRoute(to, next);
  }
});

router.afterEach((to, from) => {
  this.app.$emit('nav-complete')
});
