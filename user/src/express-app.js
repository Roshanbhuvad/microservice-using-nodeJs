const express = require("express");

const cors = require("cors");

const {user} = require("./api");

const HandleErros = require("./utils/error-handler");

module.exports = async (app, channel) => {
    app.use(express.json({limit: "1mb"}));

    app.use(express.urlencoded({extended: true, limit: "1mb"}));

    app.use(cors());
    app.use(express.static(__dirname + "/public"));

    user(app, channel)

    app.use(HandleErros)
};