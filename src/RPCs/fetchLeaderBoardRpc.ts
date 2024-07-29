let fetchLeaderBoardRpc:nkruntime.RpcFunction = function(ctx:nkruntime.Context , logger:nkruntime.Logger , nk:nkruntime.Nakama , payload:string):string{
    let request:GetLeaderBoardRequest = JSON.parse(payload);
 
    try{
        // this wil return the leader board by id provided in body
        // You can also acces the specific record
        let leaderBoardData:nkruntime.LeaderboardRecordList = nk.leaderboardRecordsList(request.leaderBoardId,request.ownerIds,100);
        return JSON.stringify({
            success:true,
            leaderBoardData:leaderBoardData,
            successMessage:"leader boards fetched successfuly",
        })

    }catch(err:any){
       return JSON.stringify({
            success:false,
            inputData:request,
            successMessage:"No Leader board exist with this ID",
            errorMessage:err.message
        })
    }    
}