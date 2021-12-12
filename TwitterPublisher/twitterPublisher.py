import platform
import io
import os
import sys
import pika
import json
import requests
import tweepy


apiKeys = {
    "key":"TN9GlXlkLoJll32iFnbBKtnNP",
    "secret":"v3q1kdMHmMiBRyNkSFL6ukV5GDj31QthGwD8chtUdcl5550cyI",
    "bearerToken":"AAAAAAAAAAAAAAAAAAAAAGPhVwEAAAAApoqF4mZUjQFKbR77sqN%2FVnEFIBY%3Dx5sCD2IF3wpXENuWYeLZSdOATNobCD5aEXW5oRHOA9ejn0kQWH",
    "accessToken":"1461724023759380485-SUeIVKPvFT2EluJIz3gKa0Zf267cg3",
    "accessTokenSecret":"cQCTJAivKFZnmi7KoIOOiUhmzRA4A75jrYk6zOaTZuYkW"
}
rabbitMQHost = "localhost"

print(f"Connecting to rabbitmq({rabbitMQHost})")
rabbitMQ = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitMQHost))
rabbitMQChannel = rabbitMQ.channel()
rabbitMQChannel.queue_declare(queue='toWorker')
rabbitMQChannel.exchange_declare(exchange='logs', exchange_type='topic')
infoKey = f"{platform.node()}.worker.info"
debugKey = f"{platform.node()}.worker.debug"


def log_debug(message, key=debugKey):
    print("DEBUG:", message, file=sys.stdout)
    rabbitMQChannel.basic_publish(
        exchange='logs', routing_key=key, body=message)
def log_info(message, key=infoKey):
    print("INFO:", message, file=sys.stdout)
    rabbitMQChannel.basic_publish(
        exchange='logs', routing_key=key, body=message)

try:
    tweepyClient = tweepy.Client(bearer_token=apiKeys["bearerToken"], 
    consumer_key=apiKeys["key"], 
    consumer_secret=apiKeys["secret"], 
    access_token=apiKeys["accessToken"], 
    access_token_secret=apiKeys["accessTokenSecret"])
    log_info("Twitter authentication successful")
except Exception as e:
    log_info("Error during Twitter authentication: " + e)
    quit()

def callback(ch, method, properties, body):
    data = json.loads(body)
    tweetBody = data['tweetBody']
    print("here")
    #truncate stories that are too long for twitter
    tweetBody = tweetBody[:280]
    ch.basic_ack(delivery_tag = method.delivery_tag)
    try:
        tweepyClient.create_tweet(text=tweetBody)
    except Exception as e:
        print(e)
rabbitMQChannel.basic_consume(queue='toWorker', on_message_callback=callback)
rabbitMQChannel.start_consuming()