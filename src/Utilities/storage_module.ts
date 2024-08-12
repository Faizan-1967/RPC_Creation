class StorageUtils{

 // to give values to new user
    public WriteObject(nk:nkruntime.Nakama, collection:string, key:string, userID:string ,value:any):nkruntime.StorageWriteAck[]{
        const dataToWrite:nkruntime.StorageWriteRequest ={
            collection:collection,
            key:key,
            userId:userID,
            value:value
        }
    return nk.storageWrite([dataToWrite])
    }
    
// to read values of stored user
    public ReadObject(nk:nkruntime.Nakama, collection:string, key:string,userId:string ):nkruntime.StorageObject[]{
        let dataToRead:nkruntime.StorageReadRequest ={
            collection:collection,
            key:key,
            userId:userId
        }
       return nk.storageRead([dataToRead]);
    }
}