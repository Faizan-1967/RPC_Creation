let fetchLeaderBoardRpc:nkruntime.RpcFunction = function(ctx:nkruntime.Context , logger:nkruntime.Logger , nk:nkruntime.Nakama , payload:string):string{
    let request:ILeaderBoardReq = JSON.parse(payload);
    var response:ILeaderBoardResponse;
    try{

        if(request.leaderBoardId == " ") return "Enter  LeaderBoard ID";
        // this wil return the leader board by id provided in body
        // You can also acces the specific record
        let leaderBoardData:nkruntime.LeaderboardRecordList = nk.leaderboardRecordsList(request.leaderBoardId,request.ownerIds,100);
        response =
        {
            success: true,
            message:"Records fetched successfully",
            data:leaderBoardData
        }
      
    }catch(err:any){
        response = {
            success: false,
            message: err.message
        }
    }   
    return JSON.stringify(response); 
}