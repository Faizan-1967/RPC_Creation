let emailAuthRpc: nkruntime.RpcFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    try {
        var response:IauthRes;
        var authObj = new authUtils();
        const payloadJson:IauthReq = JSON.parse(payload);
       
        if(!payloadJson){
            return JSON.stringify({
                "message":"Payload Is empty"
            })
        }
       //to validate email
       if( !(authObj.isValidEmail(payloadJson.email))){
        return JSON.stringify({
            "message": "Invalid Email"
        });
       }
       //to valid password
       if( !(authObj.isValidPassword(payloadJson.password))){
        return JSON.stringify({
            "message": "Invalid password length 8 and has upper , lower char and a number and a special character"
        });
       }
       //to valid username
       if(!authObj.isValidUsername(payloadJson.username)){
        return JSON.stringify({
            "message": "Enter User name and length should be 3 or greater than 3"
        });
       }
       // Nakama built in function to authenticate user on the basis of email
        const res = nk.authenticateEmail(payloadJson.email, payloadJson.password, payloadJson.username); 
        
        // this will read the user state if user is new it will set its default state
        const storageObj:nkruntime.StorageObject[] =new StorageUtils().ReadObject(nk,PLAYER_COLLECTION,PLAYER_STATE_KEY,res.userId);

        if(storageObj.length <=0){
            new StateUtils().SetUserState(nk,res.userId,{coins:100,xp:20,level:1,health:100,games:0});
        }
        
        response =
        {
            success:true,
            message:"User has been authenticated",
            userId:res.userId,
            data: storageObj[0].value
        }
    } 
    catch (e:any) {
        response =
        {     
            success:false,
            message:e.message,
            userId:ctx.userId
        }
     }
     return JSON.stringify(response);
};

