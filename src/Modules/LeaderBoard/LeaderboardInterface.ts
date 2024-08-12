interface ILeaderBoardResponse  extends IResponse {
    data?: any
}

interface ILeaderBoardReq
{
    leaderBoardId:string
    ownerIds?:string[]
}