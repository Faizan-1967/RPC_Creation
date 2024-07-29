interface IUStates{
    coins?:number,
    xp?:number,
    health?:number,
    level?:number
}
interface MatchEndRequest{
    finalScore:number
}

interface MatchEndResponse{
    success:boolean
    record:nkruntime.LeaderboardRecord | null
    successMessage:string
    errorMessage:string
}
interface GetLeaderBoardRequest{
    leaderBoardId:string,
    ownerIds?:string[]
}


