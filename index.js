"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var express_1 = require("express");
var src_1 = require("./src");
var body_parser_1 = require("body-parser");
var multer_1 = require("multer");
var uuid_1 = require("uuid");
var auth_middleware_1 = require("./auth-middleware");
var cors_1 = require("cors");
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("./Utlis/config");
var storage_1 = require("firebase/storage");
var uploadMiddleware = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).array('images', 2);
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://futureblend.herokuapp.com');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.set("view engine", "ejs");
app.use(auth_middleware_1.default.decodeToken);
var payload = { userId: '4526821' };
var secretKey = 'letssee';
var token = jsonwebtoken_1.default.sign(payload, secretKey);
var client = new src_1.Midjourney({
    ServerId: process.env.SERVER_ID || "1091356628743360562",
    ChannelId: process.env.CHANNEL_ID || "1091356628743360565",
    SalaiToken: process.env.SALAI_TOKEN || "MTA2Mzg3NTg2NDA0OTI0MjEyMg.GKwb6x.YIJMGc-feZUPLvU1rtun6lwW4rfiZDB-b-BNBY",
    HuggingFaceToken: process.env.HUGGINGFACE_TOKEN,
    Debug: true,
    Ws: true,
});
var imageRequests = new Map();
var storedMsg = [];
function generateImage(description, imageBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt_1, msg, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, client.init()];
                case 1:
                    _a.sent();
                    prompt_1 = "".concat(imageBuffer[0], " ").concat(imageBuffer[1], " \"the future ").concat(description, " of those 2 persons. Ultra realistic, HD, 4K\"");
                    return [4 /*yield*/, client.Imagine(prompt_1, function (uri, progress) {
                            console.log("loading", uri, "progress", progress);
                        })];
                case 2:
                    msg = _a.sent();
                    storedMsg.push(msg);
                    console.log(msg);
                    return [2 /*return*/, msg]; // Return the response data
                case 3:
                    err_1 = _a.sent();
                    throw new Error("Error generating the image: " + err_1);
                case 4: return [2 /*return*/];
            }
        });
    });
}
app.get("/", function (req, res) {
    res.render("index");
});
app.get("/get-msg", function (req, res) {
    if (storedMsg) {
        res.status(200).json({ msg: storedMsg });
    }
    else {
        res.status(404).json({ message: "Msg not found." });
    }
});
app.post("/generate", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authToken, accessToken, decodedToken;
    return __generator(this, function (_a) {
        if (!req.headers.authorization) {
            res.status(401).send("Unauthorized");
            return [2 /*return*/];
        }
        authToken = req.headers.authorization;
        accessToken = authToken.split(' ')[1];
        decodedToken = jsonwebtoken_1.default.verify(accessToken, secretKey, { algorithms: ['RS256'] }, function (err, decoded) {
            console.log(err);
            console.log(decoded);
        });
        /*if (!decodedToken) {
          return res.status(401).send('Unauthorized');
        } */
        uploadMiddleware(req, res, function (err) { return __awaiter(void 0, void 0, void 0, function () {
            var description, imageUrls, i, file, fileRef, metadata, downloadURL, id, imageResults, msg, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err) {
                            res.status(400).send("Error uploading files.");
                            return [2 /*return*/];
                        }
                        description = req.body.description;
                        imageUrls = [];
                        if (!Array.isArray(req.files)) return [3 /*break*/, 5];
                        console.log("here");
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < req.files.length)) return [3 /*break*/, 5];
                        file = req.files[i];
                        fileRef = (0, storage_1.ref)(config_1.appli.storage().ref(), "".concat(file.fieldname, "-").concat(i));
                        metadata = { contentType: 'image/jpeg' };
                        return [4 /*yield*/, (0, storage_1.uploadBytes)(fileRef, file.buffer, metadata)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, storage_1.getDownloadURL)(fileRef)];
                    case 3:
                        downloadURL = _a.sent();
                        console.log("la");
                        imageUrls.push(downloadURL);
                        console.log(imageUrls);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        console.log(description);
                        console.log(imageUrls);
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        id = (0, uuid_1.v4)();
                        imageResults = [];
                        // Store the image generation request in the map
                        imageRequests.set(id, { description: description, imageUrls: imageUrls });
                        // Call generateImage function passing the image URLs
                        console.log("akii");
                        return [4 /*yield*/, generateImage(description, imageUrls)];
                    case 7:
                        msg = _a.sent();
                        imageRequests.delete(id);
                        res.status(200).json({ message: "Image generated successfully.", msg: msg });
                        return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        res.status(500).send("Error generating the image.");
                        console.log(err_2.message);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
app.get("/result/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, description, imageUrls, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                if (!imageRequests.has(id)) return [3 /*break*/, 5];
                _a = imageRequests.get(id), description = _a.description, imageUrls = _a.imageUrls;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, generateImage(description, imageUrls)];
            case 2:
                result = _b.sent();
                // Remove the image generation request from the map
                imageRequests.delete(id);
                res.status(200).json({ message: "Image generated successfully.", result: result });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                res.status(500).send("Error generating the image.");
                console.log(err_3.message);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(404).send("Image generation request not found.");
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT || 3001, function () {
    console.log("Server started on port 3000");
});
