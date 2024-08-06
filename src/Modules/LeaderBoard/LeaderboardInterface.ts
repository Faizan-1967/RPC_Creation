interface ILeaderBoardResponse  extends Iresponse {
    data?: any
}

interface ILeaderBoardReq
{
    leaderBoardId:string
    ownerIds?:string[]
}