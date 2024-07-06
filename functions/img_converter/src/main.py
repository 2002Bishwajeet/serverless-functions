from io import BytesIO
import os
from PIL import Image
from pillow_heif import register_heif_opener
import base64

register_heif_opener()

supported_types = ["jpeg", "jgp", "png", "webp", "bmp", "heif"]


def image_convertor(image_encoded: str, image_format: str, isHeif: bool = False, quality: int = 95):
    # Decode the base64 image
    image_data = base64.b64decode(image_encoded)
    image = Image.open(BytesIO(image_data))
    tmp_name = "temp." + image_format
    try:
        if isHeif:
            image.save(tmp_name, quality, format=image_format)
        else:
            image.save(tmp_name, quality, format=image_format)
        encoded_image = base64.b64encode(open(tmp_name, "rb").read())
        return {
            "image": encoded_image.decode("utf-8"),
        }
    except Exception as e:
        return {
            "error": "Error converting the image",
            "message": str(e)
        }

    return


def main(context):
    # client = (
    #     Client()
    #     .set_endpoint("https://cloud.appwrite.io/v1")
    #     .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
    #     .set_key(os.environ["APPWRITE_API_KEY"])
    # )

    # context.log("Hello, Logs!")
    # context.error("Hello, Errors!")

    # The `ctx.req` object contains the request data
    if context.req.method == "GET":
        # Send a response with the res object helpers
        # `ctx.res.send()` dispatches a string back to the client
        # Load webpage
        context.log(os.listdir())
        context.log(os.getcwd())
        html_file = open("src/index.html", "r").read()
        return context.res.send(html_file)

    if context.req.method == "POST":

        # Currently Blocked to not receive bytedata https://github.com/open-runtimes/open-runtimes/pull/263
        # Workaround to receive a base64 encoded image. Set the limit to max 5MB for now
        encoded_image: str | None = context.req.body["file"]
        convert_to: str = context.req.body["convert"] if "convert" in context.req.body else "jpeg"
        quality: int = context.req.body["quality"]

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
            if img_format not in supported_types:
                return context.res.json({
                    "error": "Image format not supported"
                }, 400)

            # Convert the image
            converted_image = image_convertor(
                image_data, convert_to, quality, isHeif=img_format == "heif")
            if "error" in converted_image:
                context.error(converted_image["message"])
                return context.res.json(converted_image, 500)
            return context.res.json(converted_image, 200)
