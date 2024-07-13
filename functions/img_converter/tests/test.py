import unittest
import base64
import os

from src.main import image_convertor, supported_types

path = os.path.dirname(os.path.abspath(__file__))


class TestImageConvertor(unittest.TestCase):
    def setUp(self):
        #    Load the images from the images folder, store it in a dictionary, with filetypes as keys
        # Dictionary to store the images, Key - filetype, Value - base64 encoded image
        self.images = {}

        for file in os.listdir(f"{path}/images"):
            with open(f"{path}/images/{file}", "rb") as f:
                self.images[file.split(".")[1]] = base64.b64encode(
                    f.read()).decode("utf-8")

    def test_jpeg_images(self):
        # Convert the jpg images to different types
        jpg_image = self.images["jpg"]
        # filter jpg and jpeg from supported types and use other formats to convert the image
        for image_format in filter(lambda x: x not in ["jpeg", "jpg"], supported_types):
            result = image_convertor(jpg_image, image_format=image_format)
            if result is not None:
                self.assertIn("image", result)
                self.assertNotIn("error", result)

    def test_png_images(self):

        png_image = self.images["png"]
        # filter png from supported types and use other formats to convert the image
        for image_format in filter(lambda x: x != "png", supported_types):
            result = image_convertor(png_image, image_format=image_format)
            if result is not None:
                self.assertIn("image", result)
                self.assertNotIn("error", result)

    def test_convert_to_webp(self):
        # Convert all images to webp except webp
        for image_format in self.images:
            if image_format != "webp":
                result = image_convertor(
                    self.images[image_format], image_format="webp")
                if result is not None:
                    self.assertIn("image", result)
                    self.assertNotIn("error", result)

    def test_invalid_format(self):
        result = image_convertor(self.images["jpg"], image_format="invalid")
        if result is not None:
            self.assertIn("error", result)
            self.assertIn("message", result)

    def test_quality_parameter(self):
        result = image_convertor(self.images["png"], quality=50)
        if result is not None:
            self.assertIn("image", result)
            self.assertNotIn("error", result)


if __name__ == '__main__':
    unittest.main()
