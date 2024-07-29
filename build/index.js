"use strict";
function InitModule(ctx, logger, nk, initializer) {
    logger.debug("Init module startup");
    initializer.registerRpc("sayhelloRpc", SayHelloRpc);
    initializer.registerRpc("Email Authorization", EmailAuthRpc);
    initializer.registerRpc("DEfault_State", storageRpc);
    initializer.registerRpc("Leader_board_creation", getLeaderBoardRpc);
    new LeaderBoardUtils().createGlobalLeaderBoard(nk);
    initializer.registerRpc("match_end", matchEndRpc);
    logger.debug("Hello World!");
}
var getLeaderBoardRpc = function (ctx, logger, nk, payload) {
    var request = JSON.parse(payload);
    var response;
    try {
        // fetch the leaderboards using provided ids
        var _leaderBoardData = nk.leaderboardRecordsList(request.leaderBoardId, request.ownerIds, 100);
        logger.debug(JSON.stringify(_leaderBoardData));
        response = {
            success: true,
            leaderBoardData: _leaderBoardData,
            successMessage: "leader boards fetched successfuly",
            errorMessage: ""
        };
    }
    catch (error) {
        logger.debug(error.message);
        response = {
            success: false,
            leaderBoardData: {},
            successMessage: "",
            errorMessage: error.message
        };
    }
    return JSON.stringify(response);
};
var matchEndRpc = function (ctx, logger, nk, payload) {
    var request = JSON.parse(payload);
    var finalScore = new LeaderBoardUtils().scoreCalculation(request.score, request.finalHealth);
    var response;
    // now store the final score in leaderboard
    try {
        var leaderBoardId = GameConsts.GLOBAL_LEADERBOARD.toString();
        var metaData = {
            "name": "nothing now"
        };
        logger.debug("start writing");
        var resp = nk.leaderboardRecordWrite(leaderBoardId, ctx.userId, ctx.username, finalScore, 0, metaData);
        response = {
            success: true,
            record: resp,
            successMessage: "score is updated successfully",
            errorMessage: ""
        };
    }
    catch (error) {
        logger.debug(error.message);
        response = {
            success: false,
            record: null,
            successMessage: "",
            errorMessage: error
        };
    }
    return JSON.stringify(response);
};
var EmailAuthRpc = function authEmail(ctx, logger, nk, payload) {
    try {
        var obj = new AuthUtils();
        var payloadJson = JSON.parse(payload);
        if (!(obj.isValidEmail(payloadJson.email))) {
            return JSON.stringify({
                "message": "Invalid Email"
            });
        }
        if (!(obj.isValidPassword(payloadJson.password))) {
            return JSON.stringify({
                "message": "Invalid password length 8 and has upper , lower char and a number and a special character"
            });
        }
        if (payloadJson.username === "" || payloadJson.username.length < 3) {
            return JSON.stringify({
                "message": "Enter User name and length should be 3 or greater than 3"
            });
        }
        var response = nk.authenticateEmail(payloadJson.email, payloadJson.password, payloadJson.username);
        var storageObjects = new Storage_Utils().readObject(nk, Storage_Utils.PLAYER_Collection, Storage_Utils.PLAYER_STATE_KEY, response.userId);
        if (storageObjects.length <= 0) {
            new defaultUtils().setUserState(nk, response.userId, {});
        }
        return JSON.stringify({
            "message": "Success",
            "user ID": response.userId,
        });
    }
    catch (e) {
        return JSON.stringify({
            "message": e.message,
            "payload": JSON.parse(payload)
        });
    }
};
var SayHelloRpc = function SayHello(ctx, logger, nk, payload) {
    logger.info("Hello i am RPC");
    return JSON.stringify({
        "message": "HEllO world"
    });
};
function storageRpc(ctx, logger, nk, payload) {
    var rpcResponse = "";
    var _value = {
        coins: defaultUtils.USER_Default_COINS,
        xp: defaultUtils.USER_Default_xp,
        health: defaultUtils.USER_Default_health,
        games: defaultUtils.USER_Default_games
    };
    try {
        new Storage_Utils().WriteObject(nk, Storage_Utils.PLAYER_Collection, Storage_Utils.PLAYER_STATE_KEY, ctx.userId, _value);
        {
            return JSON.stringify({
                "messege": "Success"
            });
        }
    }
    catch (e) {
        return JSON.stringify({
            "messege": e.message
        });
    }
}
var AuthUtils = /** @class */ (function () {
    function AuthUtils() {
    }
    AuthUtils.prototype.isValidEmail = function (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    AuthUtils.prototype.isValidPassword = function (password) {
        var minLength = 8;
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasDigit = /\d/.test(password);
        var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        var isLengthValid = password.length >= minLength;
        var isComplexEnough = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
        return isLengthValid && isComplexEnough;
    };
    return AuthUtils;
}());
var defaultUtils = /** @class */ (function () {
    function defaultUtils() {
    }
    defaultUtils.prototype.setUserState = function (nk, userId, userState) {
        if (!userState.coins) {
            userState.coins = defaultUtils.USER_Default_COINS;
        }
        if (!userState.xp) {
            userState.xp = defaultUtils.USER_Default_xp;
        }
        if (!userState.games) {
            userState.games = defaultUtils.USER_Default_health;
        }
        if (!userState.health) {
            userState.health = defaultUtils.USER_Default_games;
        }
        try {
            new Storage_Utils().WriteObject(nk, Storage_Utils.PLAYER_Collection, Storage_Utils.PLAYER_STATE_KEY, userId, userState);
        }
        catch (e) {
            throw e;
        }
    };
    defaultUtils.USER_Default_COINS = 100;
    defaultUtils.USER_Default_xp = 0;
    defaultUtils.USER_Default_health = 0;
    defaultUtils.USER_Default_games = 0;
    return defaultUtils;
}());
var Storage_Utils = /** @class */ (function () {
    function Storage_Utils() {
    }
    Storage_Utils.prototype.WriteObject = function (nk, _collection, _key, _userID, _value) {
        var writer = {
            collection: _collection,
            key: _key,
            userId: _userID,
            value: _value
        };
        return nk.storageWrite([writer]);
    };
    Storage_Utils.prototype.readObject = function (nk, _collection, _key, userId) {
        var reader = {
            collection: _collection,
            key: _key,
            userId: userId
        };
        return nk.storageRead([reader]);
    };
    Storage_Utils.PLAYER_Collection = "players";
    Storage_Utils.PLAYER_STATE_KEY = "user states";
    return Storage_Utils;
}());
var GameConsts;
(function (GameConsts) {
    GameConsts["GLOBAL_LEADERBOARD"] = "hexa_b457";
})(GameConsts || (GameConsts = {}));
var LeaderBoardUtils = /** @class */ (function () {
    function LeaderBoardUtils() {
    }
    LeaderBoardUtils.prototype.createGlobalLeaderBoard = function (nk) {
        var id = GameConsts.GLOBAL_LEADERBOARD;
        var order = "descending" /* nkruntime.SortOrder.DESCENDING */;
        var operator = "best" /* nkruntime.Operator.BEST */;
        var authoritative = false;
        var resetSchedule = null;
        var metaData = {};
        try {
            nk.leaderboardCreate(id, authoritative, order, operator, resetSchedule, metaData);
        }
        catch (error) {
            throw error;
        }
    };
    LeaderBoardUtils.prototype.scoreCalculation = function (score, health) {
        return Math.max(10, (Math.ceil((score - 100 + health) * 1.24)) % 100);
    };
    LeaderBoardUtils.GLOBAL_LEADERBOARD = "hexa_b457";
    return LeaderBoardUtils;
}());
