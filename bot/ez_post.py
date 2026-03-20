"""
EZ Post - Dead simple auto-poster
Opens Twitter in YOUR default browser with tweet pre-loaded via intent URL.
No Selenium. No new profiles. No BS.

Usage:
  python ez_post.py twitter     # Opens Twitter with tweet ready to post
  python ez_post.py reddit      # Copies post + opens Reddit submit page
  python ez_post.py all          # Both
"""

import sys
import json
import webbrowser
import urllib.parse
from pathlib import Path
from datetime import datetime

from posts import TWEETS, HASHTAG_SETS

STATE_FILE = Path(__file__).parent / "bot_state.json"


def load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"next_tweet_index": 0, "next_hashtag_index": 0, "posts_log": []}


def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def get_next_tweet():
    state = load_state()
    idx = state["next_tweet_index"] % len(TWEETS)
    hidx = state["next_hashtag_index"] % len(HASHTAG_SETS)
    tweet = TWEETS[idx]
    hashtags = HASHTAG_SETS[hidx]
    full = f"{tweet}\n\n{hashtags}"
    if len(full) > 280:
        full = tweet
    return full, idx


def advance_state(platform):
    state = load_state()
    state["next_tweet_index"] = (state["next_tweet_index"] + 1) % len(TWEETS)
    state["next_hashtag_index"] = (state["next_hashtag_index"] + 1) % len(HASHTAG_SETS)
    state["posts_log"].append({
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "platform": platform,
    })
    state["posts_log"] = state["posts_log"][-100:]
    save_state(state)


def post_twitter():
    tweet, idx = get_next_tweet()

    # Twitter intent URL - opens Twitter compose with text pre-filled
    encoded = urllib.parse.quote(tweet)
    url = f"https://x.com/intent/post?text={encoded}"

    print(f"Opening tweet #{idx + 1} in your browser...")
    webbrowser.open(url)

    advance_state("twitter")
    print("Done! Just click POST in the browser tab that opened.")


def post_reddit():
    state = load_state()
    idx = state["next_tweet_index"] % len(TWEETS)

    subreddits = ["NewTubers", "youtube", "SideHustle", "SmallYTChannel", "contentcreation"]
    sub = subreddits[idx % len(subreddits)]

    title = "I built a free AI tool that generates complete viral video scripts + visual prompts + captions"
    body = """Hey! I built a free tool called ProfitPath for content creators.

Type any topic and get a complete video package:
- Clip-by-clip scripts with voiceover narration
- AI visual prompts (paste into Kling AI / Runway / Pika)
- YouTube title + description + tags
- TikTok & Instagram captions
- CapCut editing steps + text overlays

20 visual styles, 5 languages. Free: https://profitpath.online

Would love your feedback!"""

    # Reddit submit URL with pre-filled title
    encoded_title = urllib.parse.quote(title)
    encoded_body = urllib.parse.quote(body)
    url = f"https://www.reddit.com/r/{sub}/submit?type=TEXT&title={encoded_title}&text={encoded_body}"

    print(f"Opening Reddit r/{sub} in your browser...")
    webbrowser.open(url)

    print("Done! Just click POST in the browser tab that opened.")


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python ez_post.py twitter   - Open Twitter with tweet ready")
        print("  python ez_post.py reddit    - Open Reddit with post ready")
        print("  python ez_post.py all       - Open both")
        return

    platform = sys.argv[1].lower()

    if platform == "twitter":
        post_twitter()
    elif platform == "reddit":
        post_reddit()
    elif platform == "all":
        post_twitter()
        post_reddit()
    else:
        print(f"Unknown: {platform}")


if __name__ == "__main__":
    main()
