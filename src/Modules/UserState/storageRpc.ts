function storageRpc(ct:nkruntime.Context, logger:nkruntime.Logger, nk:nkruntime.Nakama, payload:string ):string{
  
   let value:any={
    coins:DEFAULT_COINS,
    xp:DEFAULT_XP,
    health:DEFAULT_HEALTH,
    level:DEFAULT_LEVEL

   }

 try{
      new StorageUtils().WriteObject(nk,PLAYER_COLLECTION,PLAYER_STATE_KEY,ct.userId,value);{
      return JSON.stringify({
        "messege": "Data Stored Successfully"
      })
    }
 }catch(e:any){
    return JSON.stringify({
        "messege":e.message
    })
 }
}