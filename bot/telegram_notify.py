"""
Sends next tweet to Telegram with "Post on Twitter" button.
Runs via GitHub Actions on schedule.
"""

import os
import json
import urllib.parse
import urllib.request
from pathlib import Path

# Import tweets
import sys
sys.path.insert(0, str(Path(__file__).parent))
from posts import TWEETS

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")
STATE_FILE = Path(__file__).parent / "bot_state.json"


def load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"next_tweet_index": 0}


def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def send_telegram(tweet, idx):
    encoded_tweet = urllib.parse.quote(tweet)
    twitter_url = f"https://x.com/intent/post?text={encoded_tweet}"

    message = f"Tweet #{idx + 1} ready!\n\n{tweet}"

    payload = json.dumps({
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "reply_markup": {
            "inline_keyboard": [[
                {"text": "Post on Twitter", "url": twitter_url}
            ]]
        }
    }).encode("utf-8")

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
    )

    try:
        resp = urllib.request.urlopen(req)
        print(f"Sent tweet #{idx + 1} to Telegram!")
    except Exception as e:
        print(f"Error: {e}")


def main():
    state = load_state()
    idx = state.get("next_tweet_index", 0) % len(TWEETS)
    tweet = TWEETS[idx]

    send_telegram(tweet, idx)

    state["next_tweet_index"] = (idx + 1) % len(TWEETS)
    save_state(state)


if __name__ == "__main__":
    main()
