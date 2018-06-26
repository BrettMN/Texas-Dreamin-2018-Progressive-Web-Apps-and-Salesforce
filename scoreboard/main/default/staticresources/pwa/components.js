// Components ///////////////////////////////////////////////////////////

const Home = {
  data: function() {
    return {
      text: [
        "I can't abide these Jawas. Disgusting creatures. Go on, go on. I can't understand how we got by those troopers. I thought we were dead. The Force can have a strong influence on the weak-minded. You will find it a powerful ally. Do you really think we're going to find a pilot here that'll take us to Alderaan? Well, most of the best freighter pilots can be found here. Only watch your step. This place can be a little rough. I'm ready for anything. Come along, Artoo.",
        "What a piece of junk. She'll make point five beyond the speed of light. She may not look like much, but she's got it where it counts, kid. I've added some special modifications myself. We're a little rushed, so if you'll hurry aboard we'll get out of here. Hello, sir. Which way? All right, men. Load your weapons! Stop that ship! Blast 'em! Chewie, get us out of here! Oh, my. I'd forgotten how much I hate space travel.",
        "All right, kid. But you'd better be right about this. All right. What's your plan? Uh...Threepio, hand me those binders there will you? Okay. Now, I'm going to put these on you. Okay. Han, you put these on. Don't worry, Chewie. I think I know what he has in mind. Master Luke, sir! Pardon me for asking...but, ah...what should Artoo and I do if we're discovered here? Lock the door! And hope they don't have blasters. That isn't very reassuring.",
        "Uh, I'm quite sure you'll be very pleased with that one, sir. He really is in first-class condition. I've worked with him before. Here he comes. Okay, let's go. Now, don't you forget this! Why I should stick my neck out for you is quite beyond my capacity! Thank the maker! This oil bath is going to feel so good. I've got such a bad case of dust contamination, I can barely move! It just isn't fair. Oh, Biggs is right. I'm never gonna get out of here! Is there anything I might do to help? Well, not unless you can alter time, speed up the harvest, or teleport me off this rock! I don't think so, sir. I'm only a droid and not very knowledgeable about such things. Not on this planet, anyways. As a matter of fact, I'm not even sure which planet I'm on.",
        "My scope's negative. I don't see anything. Keep up your visual scanning. With all this jamming, they'll be on top of you before your scope can pick them up. Biggs! You've picked one up...watch it! I can't see it! Where is he?! He's on me tight, I can't shake him...I can't shake him. Hang on, Biggs, I'm coming in. Got him!"
      ]
    };
  },
  computed: {
    curentTime() {
      return new Date();
    },
    currentDisplayTime() {
      return this.curentTime().toLocaleTimeString();
    },
    timeToNextGame() {
      return this.$store.state.games[0];
    }
  },
  template: `
    <div class="Home">
        <h2>Home</h2>
        
        <div v-for="t in text">
            <p>{{t}}</p>
            <hr>
            <br>
        </div>
        
    </div>
  `
};

const ScoreBoardButton = {
  props: {
    label: String,
    isDisabled: Boolean
  },
  template: `
      <div class="ScoreBoardButton clear">
        <button 
            @click="$emit('ScoreBoardButtonClick')" 
            class="scoreboard"
            :disabled="isDisabled"
        >
            {{label}}
        </button>
      </div>
    `
};

const Games = {
  data: () => {
    return { sports: [] };
  },
  props: {
    games: Array
  },
  template: `
  <div class="Games">
    <h2>Games</h2>
    <ul v-if="games">
      <li v-for="(game, index) in games" :key="game.Id">
        {{ game.Sport__r.Name }} <strong>{{ game.Team_1__r.Name }} vs. {{ game.Team_2__r.Name }}</strong> @ {{ new Date(game.Date__c).toLocaleTimeString() }} on {{ new Date(game.Date__c).toLocaleDateString() }} <router-link :to="{ name : 'game', params : { id : game.Id }}" >Details ➡ </router-link>
      </li>
    </ul>
    <p v-if="!games">No Games</p>
    
    <div  v-if="sports.length > 0">
    
      <h2>Sports</h2>
      <ul v-if="sports">
      
        <li v-for="(sport, index) in sports" :key="sport.name">
        <h3>{{ sport.name }}</h3>
            <ul>
              <li v-for="(game, index) in sport.games" :key="game.Id">
                  <strong>{{ game.Team_1__r.Name }} vs. {{ game.Team_2__r.Name }}</strong> <router-link :to="{ name : 'game', params : { id : game.Id }}" >Details ➡ </router-link>
              </li>
            
            </ul>
        </li>
       </ul>
     </div>
    <p v-if="!sports">No Games</p>
  </div>
  `
};

const AddGameHighlight = {
  props: {
    teams: Array,
    game: Object
  },
  data() {
    return {
      Name: '',
      Highlight_Caption__c: '',
      Game__c: '',
      Team__c: ''
    };
  },
  template: `
    <div class="AddGameHighlight">
        <input type="text" :Name />
        <input type="text" :Highlight_Caption__c>
        <select v-model="Team__c">
            <option :value=""></option>
        </select>
    </div>
    `
};

const GameHighlight = {
  props: {
    highlight: Object
  },
  computed: {
    image: function() {
      return decodeURI(this.highlight.Picture__c);
    }
  },
  template: `
    <li class="GameHighlight">
        <div>
            <h4>{{ highlight.Name }} <small>{{ highlight.Team__r.Name}}</small></h4>
            <span v-html="image"></span>
            <p>{{ highlight.Highlight_Caption__c }}</p>
        </div>
    </li>
    `
};

const NewGameHighlight = {
  props: {
    highlight: Object
  },
  components: { ScoreBoardButton },
  computed: {
    image: function() {
      return decodeURI(this.highlight.Picture__c);
    }
  },
  template: `
    <div class="NewGameHighlight">
        <div>
            <h4>{{ highlight.Name }} <small>{{ highlight.Team__r.Name}}</small></h4>
            <span v-html="image"></span>
            <p>{{ highlight.Highlight_Caption__c }}</p>
        </div>
    </div>
    `
};

const GameHighlights = {
  props: {
    highlights: Array
  },
  components: { GameHighlight, ScoreBoardButton },
  template: `
     <div class="GameHighlights">
        <h3>Highlights</h3>
        <ul>
            <GameHighlight v-for="(highlight, index) in highlights" :key="highlight.Id" :highlight="highlight" />
        </ul>
        <ScoreboardButton @click="addNewHighlight" />
     </div>
    `
};

const Game = {
  props: {
    id: String
  },
  data: function() {
    return { clean: true };
  },
  components: { GameHighlights, ScoreBoardButton },
  computed: {
    games: function() {
      return this.$store.state.games;
    },
    game: function() {
      return this.games.find(game => game.Id == this.id);
    },
    dateTime: function() {
      let date = new Date(this.game.Date__c);

      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    },
    teamOneTotal: function() {
      return (
        (this.game.Quarter_1_Score_Team_1__c || 0) +
        (this.game.Quarter_2_Score_Team_1__c || 0) +
        (this.game.Quarter_3_Score_Team_1__c || 0) +
        (this.game.Quarter_4_Score_Team_1__c || 0)
      );
    },
    teamTwoTotal: function() {
      return (
        (this.game.Quarter_1_Score_Team_2__c || 0) +
        (this.game.Quarter_2_Score_Team_2__c || 0) +
        (this.game.Quarter_3_Score_Team_2__c || 0) +
        (this.game.Quarter_4_Score_Team_2__c || 0)
      );
    }
  },
  methods: {
    submit: function() {
      this.$emit('submit-game', this.game);
      this.clean = true;
    }
  },
  template: `
  <div class="Game">  
  
      <div v-if="game">
        <h5>{{ game.Sport__r.Name }}</h5>
        <h2>Game: {{ game.Team_1__r.Name }} vs. {{ game.Team_2__r.Name }}</h2>

        <h4>Game Time: {{ dateTime }}</h4>
    
        
        <h2>{{ game.Team_1__r.Name }} at  {{ game.Team_2__r.Name }}</h2>
        
        <table>
          <thead>          
            <tr>
              <th></th>
              <th>Quarter 1</th>
              <th>Quarter 2</th>
              <th>Quarter 3</th>
              <th>Quarter 4</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody @change="clean = false">
            <tr>
                <td data-title="Team">{{ game.Team_1__r.Name }}</td>
                <td data-title="Quarter 1"><input type="number" v-model.number="game.Quarter_1_Score_Team_1__c"></td>
                <td data-title="Quarter 2"><input type="number" v-model.number="game.Quarter_2_Score_Team_1__c"></td>
                <td data-title="Quarter 3"><input type="number" v-model.number="game.Quarter_3_Score_Team_1__c"></td>
                <td data-title="Quarter 4"><input type="number" v-model.number="game.Quarter_4_Score_Team_1__c"></td>
                <td data-title="Total" class="total">{{ teamOneTotal }}</td>
            </tr>
            
            <tr>
                <td data-title="Team">{{ game.Team_2__r.Name }}</td>
                <td data-title="Quarter 1"><input type="number" v-model.number="game.Quarter_1_Score_Team_2__c"></td>
                <td data-title="Quarter 2"><input type="number" v-model.number="game.Quarter_2_Score_Team_2__c"></td>
                <td data-title="Quarter 3"><input type="number" v-model.number="game.Quarter_3_Score_Team_2__c"></td>
                <td data-title="Quarter 4"><input type="number" v-model.number="game.Quarter_4_Score_Team_2__c"></td>
                <td data-title="Total" class="total">{{ teamTwoTotal }}</td>
            </tr>
          
          </tbody>
                
        </table>
        
        <ScoreBoardButton label="Submit Score" :isDisabled="clean" @ScoreBoardButtonClick="submit" />
        
        <!--<GameHighlights :highlights="game.Highlights__r" />-->
      
      
      </div>
      
      <h2 v-if="!game">No Game Found</h2>
      
  </div>
  `
};

const User = {
  props: {
    name: String,
    email: String,
    sessionId: String
  },
  template: `
        <div class="User">
            <h2>User Info</h2>
            <div>
                <p><strong>Name: </strong>{{name}}</p>
                <p><strong>Email: </strong>{{email}}</p>
                <p><strong>Session Id: </strong>{{sessionId}}</p>
            </div>
        </div>
  `
};

const Login = {
  data() {
    return {
      email: 'danielle.nelson@outlook.com'
    };
  },
  methods: {
    login: function() {
      console.log('login', this.email);
      this.$emit('login', this.email);
    }
  },
  template: `
  <div>
    <h2>Login</h2>
    <label for="email">Email</label>
    <input 
        id="email" 
        type="text" 
        placeholder="Email Address" 
        @keypress.enter="login" 
        v-model="email" 
    />
    <button @click="login">Login</button>
  </div>
  `
};
