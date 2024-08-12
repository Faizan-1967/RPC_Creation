"use strict";
function InitModule(ctx, logger, nk, initializer) {
    logger.debug("Init module startup");
    initializer.registerRpc("authEmail", emailAuthRpc);
    initializer.registerRpc("setDefaultState", storageRpc);
    initializer.registerRpc("getLeaderBoard", fetchLeaderBoardRpc);
    initializer.registerRpc("postLeaderBoard", postMatchRpc);
    initializer.registerRpc("configuration", getConfigRpc);
    try {
        new ConfigurationModule().saveConfigurations(nk);
    }
    catch (E) {
        logger.debug("Configuration Issue");
    }
    new LeaderBoard().CreateLeaderBoard(nk);
    logger.debug("Hello World!");
}
var authUtils = /** @class */ (function () {
    function authUtils() {
    }
    authUtils.prototype.isValidEmail = function (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    authUtils.prototype.isValidPassword = function (password) {
        var minLength = 8;
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasDigit = /\d/.test(password);
        var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        var isLengthValid = password.length >= minLength;
        var isComplexEnough = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
        return isLengthValid && isComplexEnough;
    };
    authUtils.prototype.isValidUsername = function (username) {
        if (username === "" || username.length < 3) {
            return false;
        }
        else {
            return true;
        }
    };
    authUtils.prototype.isValueThere = function (value) {
        if (value = "") {
            return false;
        }
        else {
            return true;
        }
    };
    return authUtils;
}());
var emailAuthRpc = function (ctx, logger, nk, payload) {
    try {
        var response;
        var authObj = new authUtils();
        var payloadJson = JSON.parse(payload);
        if (!payloadJson) {
            return JSON.stringify({
                "message": "Payload Is empty"
            });
        }
        //to validate email
        if (!(authObj.isValidEmail(payloadJson.email))) {
            return JSON.stringify({
                "message": "Invalid Email"
            });
        }
        //to valid password
        if (!(authObj.isValidPassword(payloadJson.password))) {
            return JSON.stringify({
                "message": "Invalid password length 8 and has upper , lower char and a number and a special character"
            });
        }
        //to valid username
        if (!authObj.isValidUsername(payloadJson.username)) {
            return JSON.stringify({
                "message": "Enter User name and length should be 3 or greater than 3"
            });
        }
        // Nakama built in function to authenticate user on the basis of email
        var res = nk.authenticateEmail(payloadJson.email, payloadJson.password, payloadJson.username);
        // this will read the user state if user is new it will set its default state
        var storageObj = new StorageUtils().ReadObject(nk, PLAYER_COLLECTION, PLAYER_STATE_KEY, res.userId);
        if (storageObj.length <= 0) {
            new StateUtils().SetUserState(nk, res.userId, { coins: 100, xp: 20, level: 1, health: 100, games: 0 });
        }
        response =
            {
                success: true,
                message: "User has been authenticated",
                userId: res.userId,
                data: storageObj[0].value
            };
    }
    catch (e) {
        response =
            {
                success: false,
                message: e.message,
                userId: ctx.userId
            };
    }
    return JSON.stringify(response);
};
function storageRpc(ct, logger, nk, payload) {
    var value = {
        coins: DEFAULT_COINS,
        xp: DEFAULT_XP,
        health: DEFAULT_HEALTH,
        level: DEFAULT_LEVEL
    };
    try {
        new StorageUtils().WriteObject(nk, PLAYER_COLLECTION, PLAYER_STATE_KEY, ct.userId, value);
        {
            return JSON.stringify({
                "messege": "Data Stored Successfully"
            });
        }
    }
    catch (e) {
        return JSON.stringify({
            "messege": e.message
        });
    }
}
var StateUtils = /** @class */ (function () {
    function StateUtils() {
    }
    StateUtils.prototype.SetUserState = function (nk, userId, userState) {
        if (!userState.coins) {
            userState.coins = DEFAULT_COINS;
        }
        if (!userState.xp) {
            userState.xp = DEFAULT_XP;
        }
        if (!userState.level) {
            userState.level = DEFAULT_LEVEL;
        }
        if (!userState.health) {
            userState.health = DEFAULT_HEALTH;
        }
        if (!userState.games) {
            userState.games = DEFAULT_HEALTH;
        }
        try {
            var defaultState = new StorageUtils().WriteObject(nk, PLAYER_COLLECTION, PLAYER_STATE_KEY, userId, userState);
            return defaultState;
        }
        catch (e) {
            throw e;
        }
    };
    return StateUtils;
}());
//default values for new user
// some constant variable to be used across files
/*      USER STATE VARIABLES        */
var DEFAULT_COINS = 100;
var DEFAULT_LEVEL = 1;
var DEFAULT_XP = 100;
var DEFAULT_HEALTH = 100;
var DEFAULT_GAMES = 0;
/*      STORAGE VARIABLES       */
var PLAYER_COLLECTION = "players";
var PLAYER_STATE_KEY = "player_state";
var CONFIG_COLLECTION = "configcollection";
var ADMIN_ID = "00000000-0000-0000-0000-000000000000";
var CONFIG_KEY = "configkey";
/*      LEADER BOARD VARIABLES       */
var GLOBAL_LEADERBOARD = "Faiz_2010";
var GLOBAL_CHAT_ROOM = "global";
var StorageUtils = /** @class */ (function () {
    function StorageUtils() {
    }
    // to give values to new user
    StorageUtils.prototype.WriteObject = function (nk, collection, key, userID, value) {
        var dataToWrite = {
            collection: collection,
            key: key,
            userId: userID,
            value: value
        };
        return nk.storageWrite([dataToWrite]);
    };
    // to read values of stored user
    StorageUtils.prototype.ReadObject = function (nk, collection, key, userId) {
        var dataToRead = {
            collection: collection,
            key: key,
            userId: userId
        };
        return nk.storageRead([dataToRead]);
    };
    return StorageUtils;
}());
var LeaderBoard = /** @class */ (function () {
    function LeaderBoard() {
    }
    LeaderBoard.prototype.CreateLeaderBoard = function (nk) {
        var id = GLOBAL_LEADERBOARD;
        var order = "descending" /* nkruntime.SortOrder.DESCENDING */;
        var operator = "best" /* nkruntime.Operator.BEST */;
        var authoritative = false;
        var resetSchedule = null;
        var metaData = { weather: "Sunny" };
        try {
            nk.leaderboardCreate(id, authoritative, order, operator, resetSchedule, metaData);
        }
        catch (error) {
            return JSON.stringify({
                "Error": error.message
            });
        }
    };
    return LeaderBoard;
}());
var fetchLeaderBoardRpc = function (ctx, logger, nk, payload) {
    var request = JSON.parse(payload);
    var response;
    try {
        if (request.leaderBoardId == " ")
            return "Enter  LeaderBoard ID";
        // this wil return the leader board by id provided in body
        // You can also acces the specific record
        var leaderBoardData = nk.leaderboardRecordsList(request.leaderBoardId, request.ownerIds, 100);
        response =
            {
                success: true,
                message: "Records fetched successfully",
                data: leaderBoardData.records
            };
    }
    catch (err) {
        response = {
            success: false,
            message: err.message
        };
    }
    return JSON.stringify(response);
};
var postMatchRpc = function (ct, logger, nk, payload) {
    var jsonPayload = JSON.parse(payload);
    var response;
    try {
        var leaderBoardId = GLOBAL_LEADERBOARD.toString();
        var metaData = { "Hello": "nothing" };
        var resp = nk.leaderboardRecordWrite(leaderBoardId, ct.userId, ct.username, jsonPayload.userState.coins, 0, metaData);
        response = {
            success: true,
            message: "Record entered successfully",
            data: resp
        };
    }
    catch (error) {
        response = {
            message: error.message,
            success: false
        };
    }
    return JSON.stringify(response);
};
var getConfigRpc = function (ctx, logger, nk, payload) {
    var response;
    try {
        var jsonPayload = JSON.parse(payload);
        var configResponse = new StorageUtils().ReadObject(nk, CONFIG_COLLECTION, CONFIG_KEY, ctx.userId);
        logger.debug(JSON.stringify(configResponse));
        response = {
            configurations: JSON.parse(JSON.stringify(configResponse[0].value)),
            success: true,
            message: "configs are fetched"
        };
    }
    catch (error) {
        logger.debug(error.message);
        response = {
            success: false,
            message: error.message
        };
    }
    return JSON.stringify(response);
};
var ConfigurationModule = /** @class */ (function () {
    function ConfigurationModule() {
    }
    ConfigurationModule.prototype.saveConfigurations = function (nk) {
        try {
            var configs = {
                globalChatRoomId: GLOBAL_CHAT_ROOM,
                globalLeaderBoardId: GLOBAL_LEADERBOARD
            };
            var storageUtil = new StorageUtils();
            storageUtil.WriteObject(nk, CONFIG_COLLECTION, CONFIG_KEY, ADMIN_ID, configs);
        }
        catch (error) {
            throw error;
        }
    };
    return ConfigurationModule;
}());
