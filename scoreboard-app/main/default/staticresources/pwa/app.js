// App ///////////////////////////////////////////////////////////

var app = new Vue({
    el: '#app',
    data: {
        showMenu: false
    },
    store,
    router,
    created: function () {
        this.$on('nav-complete', function () {
            this.showMenu = false;
        });
    },
    computed: {
        userName() {
            return this.$store.state.userName;
        },
        userEmail() {
            return this.$store.state.userEmail;
        },
        sessionId() {
            return this.$store.state.accessToken;
        },
        games() {
            return this.$store.state.games;
        },
        verified() {
            return this.$store.state.verified;
        },
        installEvent() {
            return this.$store.state.installEvent;
        }
    },
    methods: {
        logout: function () {
            this.showMenu = false;
            this.$store.dispatch({type: 'clear'}).then(() => {
                this.$router.push({name: 'login'});
            });
        },
        login: function ($event) {
            console.log($event);
            this.$store.dispatch({type: 'setUser', email: $event}).then(results => {
                console.log(results);
                this.updateSession().then(() => {
                    this.$router.push({name: 'home'});
                });
            });
        },
        updateSession: function () {
            return fetch('pwaoptions', {
                credentials: 'include',
                cache: 'no-cache'
            }).then(results => {
                console.log(results);
                results.text().then(text => {
                    console.log(text);
                    let options = JSON.parse(text);
                    console.log(options);
                    return this.$store.dispatch('setOptions', options);
                });
            });
        },
        submitGame: function ($event) {
            console.log('submit game');
            this.$store.dispatch({type: 'submitGame', game: $event}).catch(error => console.log(error));
        },
        addToHomeScreen: function () {
            this.installEvent.prompt();

            this.installEvent.userChoice.then(choice => {
                console.log({choice});
            });
        }
    },
    template: `
  <div class="App" >
   
      <h1>Scoreboard</h1>
      <div class="clear">      
        <button 
          class="show-menu-button" 
          @click="showMenu = !showMenu"
        >
              <span v-show="showMenu">⬆</span>
                  <span v-show="!showMenu">⬇</span>
                        Menu
        </button>
      </div>
      <transition name="menu">
           <ul 
            v-show="showMenu" 
            class="nav"
            >
               <li>
                  <router-link to="/" >Home</router-link>
               </li>
               <li>
                    <router-link :to="{ name : 'games', params : { games : games }}" >Games</router-link>
               
               </li>
               <li>
                    <router-link :to="{ name : 'user', params : { name : userName, email: userEmail, sessionId: sessionId }}">User</router-link>
               </li>
               <li v-if="verified">
                    <a 
                        href="#" 
                        @click="logout">logout</a>
               </li>
               <li v-if="!verified">
                    <router-link 
                        to="/login"
                        @login="login" 
                    >
                        Login
                    </router-link>
               </li>
          </ul>
      </transition>
      
      <router-view 
        @login="login" 
        @submit-game="submitGame"
      />
      
      
      <button 
        v-if="installEvent.prompt" 
        @click="addToHomeScreen"
        >
            Add to Home Screen
        </button>

  </div>
  `
});
