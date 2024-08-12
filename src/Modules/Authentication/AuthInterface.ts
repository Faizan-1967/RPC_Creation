interface IauthRes extends IResponse{
    userId: string,
    data?:any
}

interface IauthReq
{
    email:string
    username:string
    password:string
}