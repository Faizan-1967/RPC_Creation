function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
   logger.debug("Init module startup");
   initializer.registerRpc("authEmail", emailAuthRpc);
   initializer.registerRpc("setDefaultState", storageRpc );
   initializer.registerRpc("getLeaderBoard", fetchLeaderBoardRpc );
   initializer.registerRpc("postLeaderBoard", postMatchRpc);

   new leaderBoardCreation().createGlobalLeaderBoard(nk);

    logger.debug("Hello World!");
}