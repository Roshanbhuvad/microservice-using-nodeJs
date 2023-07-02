const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib")
const {APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME} = require("../config");
const models = require("../database/models");

//Utility Functions
(module.exports.GenerateSalt = async () => {
    return await bcrypt.genSalt();
}),
(module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
});

module.exports.ValidatePassword = async(
    enteredPassword,
    savedPassword,
    salt
) => {
    return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
}

(module.exports.GenerateSignature = async(payload) => {
    return await jwt.sign(payload, APP_SECRET, {expiresIn:"2h"});
}),
(models.exports.ValidateSignature = async (req) => {
    const singature = req.get("Authorization");
    if(singature) {
        const payload = await jwt.verify(singature.split("")[1], APP_SECRET);
        req.user = payload
        return true;
    }
    return false;
});

module.exports.FormatData = (data) => {
    if(data) {
        return {data};
    } else {
        throw new Error("Data Not Found!")
    }
};


/* ---------------Message Broker Configs --------------------*/

//create a channel 
module.exports.CreateChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "direct", false);
        return channel;
    } catch (error) {
        throw error;
    }   
};

// Publish message to message broker 

module.exports.PublishMessage = async (channel, bindingKey, message) => {
    try {
        await channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(message));
        console.log("Message Sent! - From product Service");
    } catch (error) {
        throw error;
    }
};

// Subscribe to message broker 

module.exports.SubscribeToMessage = async (channel, bindingKey, callback) => {
    try {
        const appQueue = await channel.assertQueue(QUEUE_NAME);
        await channel.bindQueue(appQueue.queue, EXCHANGE_NAME, bindingKey);
        await channel.consume(appQueue.queue, (data) => {
            console.log("--- received data in product service-----");
            console.log(data.content.toString());
            channel.ack(data);
        })
    } catch(error) {
        throw error;
    }
}

