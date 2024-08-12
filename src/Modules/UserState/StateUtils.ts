class StateUtils{

    constructor(){
    }
     public SetUserState(nk:nkruntime.Nakama ,userId:string, userState:IuserState ):nkruntime.StorageWriteAck[]{
       if(!userState.coins){
        userState.coins = DEFAULT_COINS;
       }
       if(!userState.xp){
        userState.xp = DEFAULT_XP;
       }
       if(!userState.level){
        userState.level = DEFAULT_LEVEL;
       }
       if(!userState.health){
        userState.health = DEFAULT_HEALTH;
       }
       if(!userState.games){
        userState.games = DEFAULT_HEALTH;
       }

       try{
        const defaultState = new StorageUtils().WriteObject(nk,PLAYER_COLLECTION,PLAYER_STATE_KEY,userId,userState)
         return defaultState;
       }catch(e:any){
        throw e
       }
     }
}