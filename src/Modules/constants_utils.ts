//default values for new user

// some constant variable to be used across files
/*      USER STATE VARIABLES        */
const DEFAULT_COINS = 100;
const DEFAULT_LEVEL = 1;
const DEFAULT_XP = 100;
const DEFAULT_HEALTH = 100;
const DEFAULT_GAMES = 0;
/*      STORAGE VARIABLES       */
const PLAYER_COLLECTION = "players";
const PLAYER_STATE_KEY = "player_state";
const CONFIG_COLLECTION = "configcollection";
const ADMIN_ID = "00000000-0000-0000-0000-000000000000";
const CONFIG_KEY = "configkey"
/*      LEADER BOARD VARIABLES       */
const GLOBAL_LEADERBOARD = "Faiz_2010";
const GLOBAL_CHAT_ROOM = "global";



interface IResponse 
{
   success:boolean
   errorCode?:string
   message:string
}