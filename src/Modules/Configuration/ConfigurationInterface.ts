interface IGetConfigurationsRequest{
    configuration?:string
}

interface IConfigurations{
    globalLeaderBoardId:string
    globalChatRoomId:string
}

interface IGetConfigurationsResponse extends IResponse{
    configurations?:IConfigurations
}