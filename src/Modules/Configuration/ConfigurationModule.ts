class ConfigurationModule{
    public saveConfigurations(nk:nkruntime.Nakama){
        try{
        
            let configs:IConfigurations = {
                globalChatRoomId:GLOBAL_CHAT_ROOM,
                globalLeaderBoardId:GLOBAL_LEADERBOARD
            }
    
            let storageUtil = new StorageUtils();
            storageUtil.WriteObject(nk,CONFIG_COLLECTION,CONFIG_KEY,ADMIN_ID,configs);
            
        }catch(error:any){
            throw error;
        }
    }
}