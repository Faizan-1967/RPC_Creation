function storageRpc(ct:nkruntime.Context, logger:nkruntime.Logger, nk:nkruntime.Nakama, payload:string ):string{
  
   let value:any={
    coins:Default_COINS,
    xp:Default_xp,
    health:Default_health,
    level:Default_level
   }

 try{
      new storageUtils().writeObject(nk,USER_COLLECTION,USER_STATE_KEY,ct.userId,value);{
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