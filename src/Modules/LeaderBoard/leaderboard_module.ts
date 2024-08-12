class LeaderBoard{

    public CreateLeaderBoard(nk:nkruntime.Nakama){

        let id = GLOBAL_LEADERBOARD;
        let order = nkruntime.SortOrder.DESCENDING;
        let operator = nkruntime.Operator.BEST;
        let authoritative = false; 
        let resetSchedule = null;
        let metaData = {weather:"Sunny"};

        try{
        nk.leaderboardCreate(id , authoritative , order , operator , resetSchedule , metaData);
        }catch(error:any){
            return JSON.stringify({
                "Error":error.message
            })
        }
    }
}