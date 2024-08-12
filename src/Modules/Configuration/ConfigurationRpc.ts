let getConfigRpc = function(ctx:nkruntime.Context , logger:nkruntime.Logger , nk:nkruntime.Nakama , payload:string):string{
   
    
    let response:IGetConfigurationsResponse;
    try{
        let jsonPayload:IGetConfigurationsRequest = JSON.parse(payload);
        let configResponse = new StorageUtils().ReadObject(nk,CONFIG_COLLECTION,CONFIG_KEY,ctx.userId);
        logger.debug(JSON.stringify(configResponse));
        response = {
            configurations: JSON.parse(JSON.stringify(configResponse[0].value)),
            success:true,
            message:"configs are fetched"
        }
    }catch(error:any){
        logger.debug(error.message);
        response = {
            success:false,
            message:error.message
        }
    }

    return JSON.stringify(response);
}