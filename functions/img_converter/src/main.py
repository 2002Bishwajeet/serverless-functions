from io import BytesIO
import os
from PIL import Image
from pillow_heif import register_heif_opener
import base64

register_heif_opener()

static_path: str = "src/functions/src"

supported_types = ["jpeg", "jpg", "png", "webp", "bmp", "heif", "ico",]


def image_convertor(image_encoded: str, image_format: str = "jpeg", quality: int = 95):
    # Decode the base64 image
    image_data = base64.b64decode(image_encoded.encode("utf-8"))
    image_format = 'jpeg' if image_format.lower() == "jpg" else image_format

    try:
        image = Image.open(BytesIO(image_data))

        if image_format in ["jpeg", "jpg"] and image.mode != "RGB":
            image = image.convert("RGB")
        tmp_name = "temp." + image_format
        image.save(tmp_name, image_format, quality=quality)
        with open(tmp_name, "rb") as f:
            encoded_image = base64.b64encode(f.read())
            if os.path.exists(tmp_name):
                os.remove(tmp_name)
            return {
                "image": encoded_image.decode("utf-8"),
            }
    except Exception as e:
        if os.path.exists(tmp_name):
            os.remove(tmp_name)
        return {
            "error": "Something went wrong",
            "message": str(e)
        }


def main(context):
    # client = (
    #     Client()
    #     .set_endpoint("https://cloud.appwrite.io/v1")
    #     .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
    #     .set_key(os.environ["APPWRITE_API_KEY"])
    # )

    if context.req.method == "GET":
        # Load webpage
        path = context.req.path
        # REFER: https://github.com/dishwasher-detergent/screenshot/blob/main/functions/screenshot/src/pages/home.ts
        if path == "/":
            html_file = open(f"{static_path}/index.html", "r").read()
            return context.res.send(html_file, 200, {
                "content-type": "text/html"
            })
        elif path == "/styles.css":
            css_file = open(f"{static_path}/styles.css", "r").read()
            return context.res.send(css_file, 200, {
                "content-type": "text/css"
            })
        elif path == "/script.js":
            js_file = open(f"{static_path}/script.js", "r").read()
            return context.res.send(js_file, 200, {
                "content-type": "text/javascript"
            })
        elif path == "/image.svg":
            svg_file = open(f"{static_path}/image.svg", "r").read()
            return context.res.send(svg_file, 200, {
                "content-type": "image/svg+xml"
            })
        else:
            return context.res.send("Not Found", 404)

    if context.req.method == "POST":

        # Currently Blocked to not receive bytedata https://github.com/open-runtimes/open-runtimes/pull/263
        # Workaround to receive a base64 encoded image. Set the limit to max 5MB for now
        if (not context.req.body):
            return context.res.json({
                "error": "Missing Body Data"
            }, 422)

        encoded_image: str | None = context.req.body["file"]
        convert_to: str = context.req.body["format"]
        quality: int = int(context.req.body["quality"])
        context.log(f"quality: {quality} convert_to: {convert_to}")

        if encoded_image is None:
            return context.res.json({
                "error": "No image data found. Ensure you are sending a base64 encoded image"
            }, 404)

        # data:image/jpeg;base64,/9j/4QEWRXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAA.... and more data
        if encoded_image.startswith("data:image"):
            image_data = encoded_image.split(",")[1]
            img_format = encoded_image.split(";")[0].split("/")[1]
            if (img_format == convert_to):
                return context.res.json({
                    "error": "Image is already in the requested format"
                }, 400)
            if convert_to not in supported_types:
                return context.res.json({
                    "error": "Image format not supported"
                }, 400)

            # Convert the image
            converted_image = image_convertor(
                image_encoded=image_data, image_format=convert_to, quality=quality)

            if converted_image is not None and "error" in converted_image:
                context.error(converted_image["message"])
                return context.res.json(converted_image, 500)

            return context.res.json(converted_image, 200)
