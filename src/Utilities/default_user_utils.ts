class defaultUtils{

    constructor(){
    }
     public setUserState(nk:nkruntime.Nakama ,userId:string, userState:IUStates ):void{
       if(!userState.coins){
        userState.coins = Default_COINS;
       }
       if(!userState.xp){
        userState.xp = Default_xp;
       }
       if(!userState.level){
        userState.level = Default_level;
       }
       if(!userState.health){
        userState.health = Default_health;
       }
       try{
        new storageUtils().writeObject(nk,USER_COLLECTION,USER_STATE_KEY,userId,userState)
       }catch(e:any){
        throw e
       }
     }
}