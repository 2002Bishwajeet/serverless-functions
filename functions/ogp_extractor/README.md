#  🌐 OGP Extractor

A simple cloud function that extracts Open Graph Protocol [(ogp.me)](https://ogp.me) metadata from a given URL that can be used to generate link previews.

## 🧰  Usage

### Base URL
[```ogp.cloudx.run```](https://ogp.cloudx.run/)

### GET/

**Parameters**

| Name | Description                                        | Location | Sample Value                                |
|------|----------------------------------------------------|----------|---------------------------------------------|
| url  | Link of the page that you want to extract metadata | Query    | https://www.youtube.com/watch?v=dQw4w9WgXcQ |


_Sample request:_

```curl
curl --request GET \
  --url 'https://ogp.cloudx.run/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ'
```

### Example output:

#### Sample `200` Response


```json
{
  "og": {
    "og:site_name": "YouTube",
    "og:url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "og:title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    "og:image": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "og:image:width": "1280",
    "og:image:height": "720",
    "og:description": "The official video for “Never Gonna Give You Up” by Rick Astley. The new album 'Are We There Yet?' is out now: Download here: https://RickAstley.lnk.to/AreWe...",
    "og:type": "video.other",
    "og:video:url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "og:video:secure_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "og:video:type": "text/html",
    "og:video:width": "1280",
    "og:video:height": "720",
    "og:video:tag": "never gonna give you up karaoke"
  },
  "twitter": {
    "twitter:card": "player",
    "twitter:site": "@youtube",
    "twitter:url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "twitter:title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    "twitter:description": "The official video for “Never Gonna Give You Up” by Rick Astley. The new album 'Are We There Yet?' is out now: Download here: https://RickAstley.lnk.to/AreWe...",
    "twitter:image": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "twitter:app:name:iphone": "YouTube",
    "twitter:app:id:iphone": "544007664",
    "twitter:app:name:ipad": "YouTube",
    "twitter:app:id:ipad": "544007664",
    "twitter:app:url:iphone": "vnd.youtube://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=applinks",
    "twitter:app:url:ipad": "vnd.youtube://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=applinks",
    "twitter:app:name:googleplay": "YouTube",
    "twitter:app:id:googleplay": "com.google.android.youtube",
    "twitter:app:url:googleplay": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "twitter:player": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "twitter:player:width": "1280",
    "twitter:player:height": "720"
  },
  "oembed": {
    "jsonp": [
      "https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ"
    ],
    "xml": [
      "https://www.youtube.com/oembed?format=xml&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ"
    ]
  },
  "title": "Rick Astley - Never Gonna Give You Up (Official Music Video) - YouTube",
  "description": "The official video for “Never Gonna Give You Up” by Rick Astley. The new album 'Are We There Yet?' is out now: Download here: https://RickAstley.lnk.to/AreWe...",
  "keywords": "rick astley, Never Gonna Give You Up, nggyu, never gonna give you up lyrics, rick rolled, Rick Roll, rick astley official, rickrolled, Fortnite song, Fortnite event, Fortnite dance, fortnite never gonna give you up, rick roll, rickrolling, rick rolling, never gonna give you up, 80s music, rick astley new, animated video, rickroll, meme songs, never gonna give u up lyrics, Rick Astley 2022, never gonna let you down, animated, rick rolls 2022, never gonna give you up karaoke"
}
```

#### Sample `400` Response

```json
{
 "error": "url query parameter is required"
}
```

## ⚙️ Configuration

| Setting           | Value              |
| ----------------- | ------------------ |
| Runtime           | PHP (8.0)          |
| Entrypoint        | `src/index.php`    |
| Build Commands    | `composer install` |
| Permissions       | `any`              |
| Timeout (Seconds) | 15                 |

