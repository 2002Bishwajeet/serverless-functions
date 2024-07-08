# 🏞️ Image Convertor

A cloud function that converts your images to different formats. It accepts a base64 encoded image and converts your image into a different format and doesn't store the image anywhere.

## 🧰 Usage

### Base URL

[`img.cloudx.run`](https://img.cloudx.run/)

### GET/

HTML Form for interacting with the function

### POST/

**Parameters**

| Name         | Description                 | Location | type             | Sample Value                                                                             |
| ------------ | --------------------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------- |
| content-type | Content type of the request | Header   | application/json |                                                                                          |
| file         | Base64 encoded image        | Body     | string           | "image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIS+2VvUoDQRSGv" |
| format       | Image format to convert to  | Body     | string           | "jpeg"                                                                                   |
| quality      | Quality of the image        | Body     | int/string       | 95                                                                                       |

> [!IMPORTANT]
>
> - The `file` parameter should be a base64 encoded image.
> - The `format` parameter should be one of the following: `jpeg`, `png`, `webp`, `tiff`, `ico`,.
> - The `quality` parameter should be an integer between 0 and 95.

_Sample request:_

```curl
curl --request POST \
  --url https://img.cloudx.run/ \
  --header 'content-type: application/json' \
  --data '{
  "file": "data:image/jpeg;base64,/9j/4QEWRXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAA....",
  "convert": "png",
  "quality": "69"
}'
```

### Example output:

#### Sample `200` Response

```json
{
  "image": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABjElEQVRIS+2VvUoDQRSGv"
}
```

> [!NOTE]
> For web this the image string needs to appended with `data:image/{format};base64,` to display the image.

#### Sample `400` Response

```json
{
  "error": "Image already in requested format"
}
```

## ⚙️ Configuration

| Setting           | Value                             |
| ----------------- | --------------------------------- |
| Runtime           | Python (3.9)                      |
| Entrypoint        | `src/main.py`                     |
| Build Commands    | `pip install -r requirements.txt` |
| Permissions       | `any`                             |
| Timeout (Seconds) | 15                                |
