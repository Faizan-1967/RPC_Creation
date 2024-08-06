interface IauthRes extends Iresponse{
    userId: string,
    data?:any
}

interface IauthReq
{
    email:string
    username:string
    password:string
}