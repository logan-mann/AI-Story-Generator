const amqp = require('amqplib/callback_api');

module.exports = {
    sendTweet: async function(tweetBody) {
        const message_body = JSON.stringify({
            tweetBody: tweetBody
        })
        amqp.connect('amqp://'+process.env.RABBITMQ_HOST, function(error0, connection) {
            if(error0) {
                return new Promise(function(resolve, reject) {
                    reject(error0);
                })
            }
    
            connection.createChannel(function(error1, channel) {
                const queue = 'toWorker'
                channel.assertQueue(queue, {
                    durable: false
                });
                channel.sendToQueue(queue, Buffer.from(message_body));
                console.log("[x] Sent %s", message_body);
            });
            setTimeout(function() {
                connection.close()
                return new Promise(function(resolve, reject) {
                    resolve({success:"Tweet Sent!"})
                })
            }, 500)
        });
    }

}
