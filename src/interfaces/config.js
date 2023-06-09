"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMidjourneyConfig = exports.DefaultMessageConfig = void 0;
exports.DefaultMessageConfig = {
    ChannelId: "",
    SalaiToken: "",
    ServerId: "",
    SessionId: "",
    Debug: false,
    Limit: 50,
    MaxWait: 100,
    DiscordBaseUrl: "https://discord.com",
    WsBaseUrl: "wss://gateway.discord.gg"
};
exports.DefaultMidjourneyConfig = __assign(__assign({}, exports.DefaultMessageConfig), { ServerId: "", SessionId: "8bb7f5b79c7a49f7d0824ab4b8773a81" });
