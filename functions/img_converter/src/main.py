from appwrite.client import Client
import os
from PIL import Image
from pillow_heif import register_heif_opener

# register_heif_opener()

# def image_convertor(image_bytes: bytes, image_format: str):

# return
# This is your Appwrite function
# It's executed each time we get a request


def main(context):
    # Why not try the Appwrite SDK?
    # client = (
    #     Client()
    #     .set_endpoint("https://cloud.appwrite.io/v1")
    #     .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
    #     .set_key(os.environ["APPWRITE_API_KEY"])
    # )

    # # You can log messages to the console
    # context.log("Hello, Logs!")

    # # If something goes wrong, log an error
    # context.error("Hello, Errors!")

    # The `ctx.req` object contains the request data
    if context.req.method == "GET":
        # Send a response with the res object helpers
        # `ctx.res.send()` dispatches a string back to the client
        # TODO: Render Html
        return context.res.send("Hello, World!")

    if context.req.method == "POST":
        # Get the request body
        context.log(context.req.body_raw)

        # `ctx.res.json()` is a handy helper for sending JSON
    return context.res.json(
        {
            "motto": "Build like a team of hundreds_",
            "learn": "https://appwrite.io/docs",
            "connect": "https://appwrite.io/discord",
            "getInspired": "https://builtwith.appwrite.io",
        }
    )
