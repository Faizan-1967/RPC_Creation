let emailAuthRpc: nkruntime.RpcFunction = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
    try {
        var obj = new authUtils();
        const payloadJson = JSON.parse(payload);
       //to validate email
       if( !(obj.isValidEmail(payloadJson.email))){
        return JSON.stringify({
            "message": "Invalid Email"
        });
       }
       //to valid password
       if( !(obj.isValidPassword(payloadJson.password))){
        return JSON.stringify({
            "message": "Invalid password length 8 and has upper , lower char and a number and a special character"
        });
       }
       //to valid username
       if(!obj.isValidUsername(payloadJson.username)){
        return JSON.stringify({
            "message": "Enter User name and length should be 3 or greater than 3"
        });
       }
       // Nakama built in function to authenticate user on the basis of email
        const res = nk.authenticateEmail(payloadJson.email, payloadJson.password, payloadJson.username); 
        
        // this will read the user state if user is new it will set its default state
        const storageObj:nkruntime.StorageObject[] =new storageUtils().readObject(nk,USER_COLLECTION,USER_STATE_KEY,res.userId);

        if(storageObj.length <=0){
            new defaultUtils().setUserState(nk,res.userId,{});
        }
        
        return JSON.stringify({
            "message":"User Authenticated",
            "user": JSON.parse(payload)
        });
    
    } catch (e:any) {
        return JSON.stringify({
            "errorMessage": e.message,
            "payload": JSON.parse(payload)
        });
}
};

