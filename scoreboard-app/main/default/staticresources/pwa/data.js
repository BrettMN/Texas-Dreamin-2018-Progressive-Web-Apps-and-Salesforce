// data ///////////////////////////////////////////////////////////
var store = new Vuex.Store({
  state: {
    installEvent: {},
    userEmail: '',
    userName: '',
    verified: false,
    dataLoaded: false,
    games: [],
    gamesToSync: [],
    resourceRoot: '',
    instanceUrl: '',
    accessToken: ''
  },
  mutations: {
    setInstallEvent(state, event) {
      state.installEvent = event;
    },
    clearAll(state, event) {
      state.userEmail = '';
      state.userName = '';
      state.verified = false;
      state.games = [];
    },
    setDataLoaded(state, event) {
      state.dataLoaded = event;
    },
    setAttribute(state, event) {
      state[event.name] = event.value;
    }
  },
  actions: {
    callSalesforce(state, payload) {
      Visualforce.remoting.Manager.invokeAction(
        payload.methodName,
        ...payload.params,
        function(result, event) {
          console.log({ event });
          console.log({ result });
          if (event.status) {
            payload.success(result);
          } else {
            payload.failure(result);
          }
        },
        {
          escape: false
        }
      );
    },
    saveAttribute(context, payload) {
      return localforage.setItem(payload.name, payload.value, () => {
        return context.commit({ type: 'setAttribute', name: payload.name, value: payload.value });
      });
    },
    setOptions(context, payload) {
      context.dispatch({
        type: 'saveAttribute',
        name: 'resourceRoot',
        value: payload.resourceRoot
      });

      context.dispatch({
        type: 'saveAttribute',
        name: 'instanceUrl',
        value: payload.instanceUrl
      });

      context.dispatch({
        type: 'saveAttribute',
        name: 'accessToken',
        value: payload.accessToken
      });
    },

    loadLocalData(context) {
      return new Promise((resolve, reject) => {
        localforage.iterate(
          (value, key) => {
            console.log({ value });
            console.log({ key });

            context.state[key] = value;
          },
          () => {
            context.commit('setDataLoaded', true);
            resolve();
          }
        );
      });
    },
    clear(context) {
      localforage.clear(() => {
        context.commit('clearAll');
      });
    },
    setUser(context, payload) {
      return new Promise((resolve, reject) => {
        context.dispatch({
          type: 'callSalesforce',
          methodName: 'PwaController.verifyEmail',
          params: [payload.email],
          success: results => {
            console.log(results);
            Promise.all([
              context.dispatch({
                type: 'saveAttribute',
                name: 'userEmail',
                value: results.contact.Email
              }),
              context.dispatch({
                type: 'saveAttribute',
                name: 'userName',
                value: results.contact.Name
              }),
              context.dispatch({
                type: 'saveAttribute',
                name: 'verified',
                value: true
              }),
              context.dispatch({
                type: 'setGames',
                games: results.games
              })
            ]).then(results => resolve(results));
          },
          failure: results => reject(results)
        });
      });
    },
    setGames(context, payload) {
      context.dispatch({ type: 'saveAttribute', name: 'games', value: payload.games });
    },
    setVerified(context, payload) {
      context.dispatch({ type: 'saveAttribute', name: 'verified', value: payload.status });
    },
    updateGame(context, payload) {
      let games = context.state.games;
      let index = games.findIndex(game => game.Id === payload.game.Id);
      games[index] = payload.game;

      context.dispatch({ type: 'saveAttribute', name: 'games', value: games });
    },
    updateGamesToSync(context, payload) {
      let games = context.state.gamesToSync;

      let index = games.findIndex(game => game.Id === payload.game.Id);
      if (index >= 0) {
        games[index] = payload.game;
      } else {
        games.push(payload.game);
      }

      context.dispatch({
        type: 'saveAttribute',
        name: 'gamesToSync',
        value: games
      });
    },
    submitGame(context, payload) {
      let game = {
        Id: payload.game.Id,
        Quarter_1_Score_Team_1: payload.game.Quarter_1_Score_Team_1__c,
        Quarter_1_Score_Team_2: payload.game.Quarter_1_Score_Team_2__c,
        Quarter_2_Score_Team_1: payload.game.Quarter_2_Score_Team_1__c,
        Quarter_2_Score_Team_2: payload.game.Quarter_2_Score_Team_2__c,
        Quarter_3_Score_Team_1: payload.game.Quarter_3_Score_Team_1__c,
        Quarter_3_Score_Team_2: payload.game.Quarter_3_Score_Team_2__c,
        Quarter_4_Score_Team_1: payload.game.Quarter_4_Score_Team_1__c,
        Quarter_4_Score_Team_2: payload.game.Quarter_4_Score_Team_2__c
      };

      context.dispatch({
        type: 'updateGamesToSync',
        game: game
      });

      // return new Promise((resolve, reject) => {
      //   context
      //     .dispatch({
      //       type: 'callSalesforce',
      //       methodName: 'PwaController.submitGame',
      //       params: [game],
      //       success: results => {
      //         console.log(results);
      //         context.dispatch({ type: 'updateGame', game: results });
      //         resolve(results);
      //       },
      //       failure: results => {
      //         context.dispatch({ type: 'updateGamesToSync', game: game });
      //         reject(results);
      //       }
      //     })
      //     .catch(error => {
      //       console.log(error);
      //       context.dispatch({ type: 'updateGamesToSync', game: game });
      //     });
      // });
    }
  }
});
