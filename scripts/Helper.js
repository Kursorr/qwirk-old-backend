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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatas = exports.randomText = exports.imgPath = exports.decodeBase64Image = exports.randomTag = exports.isEmpty = void 0;
const isEmpty = (field) => {
    return (field === undefined || field === null || field === '' || field === [] || field === false);
};
exports.isEmpty = isEmpty;
const randomTag = (min = 1000, max = 9999) => {
    return (Math.random() * (max - min + 1) | 0) + min;
};
exports.randomTag = randomTag;
const decodeBase64Image = (data) => {
    if (!data)
        return '';
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let response = {};
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    return response;
};
exports.decodeBase64Image = decodeBase64Image;
const imgPath = (result) => {
    if (!result)
        return 'anonym.jpg';
    const imgTypeRegularExpression = /\/(.*?)$/;
    const imgType = result.type.match(imgTypeRegularExpression);
    const imgName = randomText(14);
    const uploadedImgPath = imgName + '.' + imgType[1];
    return uploadedImgPath;
};
exports.imgPath = imgPath;
function randomText(value) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567';
    for (let i = 0; i < value; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
exports.randomText = randomText;
function getDatas(ids, specificDataCallback) {
    var ids_1, ids_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let results = [];
        try {
            for (ids_1 = __asyncValues(ids); ids_1_1 = yield ids_1.next(), !ids_1_1.done;) {
                const id = ids_1_1.value;
                const data = yield specificDataCallback(id);
                results.push(data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) yield _a.call(ids_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return results;
    });
}
exports.getDatas = getDatas;
