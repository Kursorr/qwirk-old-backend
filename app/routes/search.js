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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const ElasticSearch_1 = require("../../scripts/class/ElasticSearch");
const search = express.Router();
search.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = new ElasticSearch_1.ElasticSearch();
    const result = yield search.getText(req.query.term, req.query.offset);
    res.status(200).json({
        result
    });
}));
exports.default = search;
