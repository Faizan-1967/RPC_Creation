"use strict";
function InitModule(ctx, logger, nk, initializer) {
    logger.debug("Init module startup");
    initializer.registerRpc("authEmail", emailAuthRpc);
    initializer.registerRpc("setDefaultState", storageRpc);
    initializer.registerRpc("getLeaderBoard", fetchLeaderBoardRpc);
    initializer.registerRpc("postLeaderBoard", postMatchRpc);
    new leaderBoardCreation().createGlobalLeaderBoard(nk);
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
        var obj = new authUtils();
        var payloadJson = JSON.parse(payload);
        //to validate email
        if (!(obj.isValidEmail(payloadJson.email))) {
            return JSON.stringify({
                "message": "Invalid Email"
            });
        }
        //to valid password
        if (!(obj.isValidPassword(payloadJson.password))) {
            return JSON.stringify({
                "message": "Invalid password length 8 and has upper , lower char and a number and a special character"
            });
        }
        //to valid username
        if (!obj.isValidUsername(payloadJson.username)) {
            return JSON.stringify({
                "message": "Enter User name and length should be 3 or greater than 3"
            });
        }
        // Nakama built in function to authenticate user on the basis of email
        var res = nk.authenticateEmail(payloadJson.email, payloadJson.password, payloadJson.username);
        // this will read the user state if user is new it will set its default state
        var storageObj = new storageUtils().readObject(nk, USER_COLLECTION, USER_STATE_KEY, res.userId);
        if (storageObj.length <= 0) {
            new defaultUtils().setUserState(nk, res.userId, { coins: 100, xp: 20, level: 1, health: 100 });
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
        coins: Default_COINS,
        xp: Default_xp,
        health: Default_health,
        level: Default_level
    };
    try {
        new storageUtils().writeObject(nk, USER_COLLECTION, USER_STATE_KEY, ct.userId, value);
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
var defaultUtils = /** @class */ (function () {
    function defaultUtils() {
    }
    defaultUtils.prototype.setUserState = function (nk, userId, userState) {
        if (!userState.coins) {
            userState.coins = Default_COINS;
        }
        if (!userState.xp) {
            userState.xp = Default_xp;
        }
        if (!userState.level) {
            userState.level = Default_level;
        }
        if (!userState.health) {
            userState.health = Default_health;
        }
        try {
            new storageUtils().writeObject(nk, USER_COLLECTION, USER_STATE_KEY, userId, userState);
        }
        catch (e) {
            throw e;
        }
    };
    return defaultUtils;
}());
var GLOBAL_LEADERBOARD = "Faiz_2010";
//default values for new user
var Default_COINS = 100;
var Default_xp = 0;
var Default_health = 0;
var Default_level = 1;
var USER_COLLECTION = "July_Tournament";
var USER_STATE_KEY = "J_123";
var storageUtils = /** @class */ (function () {
    function storageUtils() {
    }
    // to give values to new user
    storageUtils.prototype.writeObject = function (nk, collection, key, userID, value) {
        var writer = {
            collection: collection,
            key: key,
            userId: userID,
            value: value
        };
        return nk.storageWrite([writer]);
    };
    // to read values of stored user
    storageUtils.prototype.readObject = function (nk, collection, key, userId) {
        var reader = {
            collection: collection,
            key: key,
            userId: userId
        };
        return nk.storageRead([reader]);
    };
    return storageUtils;
}());
var leaderBoardCreation = /** @class */ (function () {
    function leaderBoardCreation() {
    }
    leaderBoardCreation.prototype.createGlobalLeaderBoard = function (nk) {
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
    return leaderBoardCreation;
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
                data: leaderBoardData
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
