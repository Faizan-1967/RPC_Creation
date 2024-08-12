function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
   logger.debug("Init module startup");
   initializer.registerRpc("authEmail", emailAuthRpc);
   initializer.registerRpc("setDefaultState", storageRpc );
   initializer.registerRpc("getLeaderBoard", fetchLeaderBoardRpc );
   initializer.registerRpc("postLeaderBoard", postMatchRpc);
   initializer.registerRpc("configuration", getConfigRpc);
   try{
    new ConfigurationModule().saveConfigurations(nk);
   }
   catch(E:any){
      logger.debug("Configuration Issue");
   }
   new LeaderBoard().CreateLeaderBoard(nk);

    logger.debug("Hello World!");
}