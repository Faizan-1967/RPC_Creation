let postMatchRpc:nkruntime.RpcFunction = function(ct:nkruntime.Context , logger:nkruntime.Logger , nk:nkruntime.Nakama , payload:string):string{
   
    const jsonPayload:ImatchReq = JSON.parse(payload);
    var response:ImatchResponse;

    try{
        const leaderBoardId:string = GLOBAL_LEADERBOARD.toString();
        let  metaData = {"Hello":"nothing"}

        const resp:nkruntime.LeaderboardRecord =  nk.leaderboardRecordWrite(leaderBoardId,ct.userId , ct.username , jsonPayload.userState.coins ,0 , metaData);  
        response = {
            success:true,
            message:"Record entered successfully in the leaderboard",
            data:resp
        }
    }catch(error:any){
        response = {
            message:error.message,
            success:false
        }
    }
    return JSON.stringify(response);
}