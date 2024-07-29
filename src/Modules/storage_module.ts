class storageUtils{

 // to give values to new user
    public writeObject(nk:nkruntime.Nakama, collection:string, key:string, userID:string ,value:any):nkruntime.StorageWriteAck[]{
        const writer:nkruntime.StorageWriteRequest ={
            collection:collection,
            key:key,
            userId:userID,
            value:value
        }
    return nk.storageWrite([writer])
    }
    
// to read values of stored user
    public readObject(nk:nkruntime.Nakama, collection:string, key:string,userId:string ):nkruntime.StorageObject[]{
        let reader:nkruntime.StorageReadRequest ={
            collection:collection,
            key:key,
            userId:userId
        }
       return nk.storageRead([reader]);
    }
}