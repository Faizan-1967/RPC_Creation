let postMatchRpc:nkruntime.RpcFunction = function(ct:nkruntime.Context , logger:nkruntime.Logger , nk:nkruntime.Nakama , payload:string):string{
   
    const jsonPayload = JSON.parse(payload);
   
    try{
        const leaderBoardId:string = GLOBAL_LEADERBOARD.toString();
        let  metaData = {"Hello":"nothing"}

        const resp:nkruntime.LeaderboardRecord =  nk.leaderboardRecordWrite(leaderBoardId,ct.userId , ct.username , jsonPayload.finalScore ,0 , metaData);
        
        return JSON.stringify({
            success:true,
            record:resp,
            successMessage:"score is updated successfully"
        })

    }catch(error:any){
        return JSON.stringify( {
            success:false,
            record:null,
            successMessage:"",
            errorMessage:error
        })
    }
}