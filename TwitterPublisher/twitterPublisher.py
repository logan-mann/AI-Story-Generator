import tweepy
apiKeys = {
    "key":"TN9GlXlkLoJll32iFnbBKtnNP",
    "secret":"v3q1kdMHmMiBRyNkSFL6ukV5GDj31QthGwD8chtUdcl5550cyI",
    "bearerToken":"AAAAAAAAAAAAAAAAAAAAAGPhVwEAAAAApoqF4mZUjQFKbR77sqN%2FVnEFIBY%3Dx5sCD2IF3wpXENuWYeLZSdOATNobCD5aEXW5oRHOA9ejn0kQWH",
    "accessToken":"1461724023759380485-SUeIVKPvFT2EluJIz3gKa0Zf267cg3",
    "accessTokenSecret":"cQCTJAivKFZnmi7KoIOOiUhmzRA4A75jrYk6zOaTZuYkW"
}


try:
    tweepyClient = tweepy.Client(bearer_token=apiKeys["bearerToken"], 
    consumer_key=apiKeys["key"], 
    consumer_secret=apiKeys["secret"], 
    access_token=apiKeys["accessToken"], 
    access_token_secret=apiKeys["accessTokenSecret"])
    print("Authentication OK")
except Exception as e:
    print(e)
    print("Error during authentication.")
    quit()


try:
    tweepyClient.create_tweet(text="testTweet")
except Exception as e:
    print(e)
    print("Error trying to tweet.")