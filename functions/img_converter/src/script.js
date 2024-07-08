const themeToggleBtn = document.getElementById("theme-toggle");

function updateIcons() {
  const isDarkMode = document.documentElement.classList.contains("dark");
  document.getElementById("theme-toggle-light-icon").style.display = isDarkMode
    ? "none"
    : "block";
  document.getElementById("theme-toggle-dark-icon").style.display = isDarkMode
    ? "block"
    : "none";
}

themeToggleBtn.addEventListener("click", function () {
  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
  updateIcons();
});

document.addEventListener("DOMContentLoaded", function () {
  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!localStorage.getItem("color-theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  updateIcons();
});

const form = document.getElementById("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  // Get File
  const file = document.getElementById("image").files[0];

  // Get Format
  const format = document.getElementById("format").value;

  // Get Quality
  const quality = document.getElementById("quality").value || 95;

  document.getElementById("convert").hidden = true;
  document.getElementById("loader").hidden = false;
  document.getElementById("download").hidden = true;
  document.getElementById("alert").hidden = true;

  if (file) {
    // Get the base64 data
    const encodedImage = await toBase64(file);
    const convertedImage = await convertImage(
      encodedImage,
      format,
      quality
    ).catch((err) => {
      console.error(err);
      document.getElementById("alert").hidden = false;
      const errorTitle = document.getElementById("error-title");
      errorTitle.innerHTML = `${err.error}`;
      if ("cause" in err) {
        document.getElementById("error").innerHTML = `${err.cause}`;
      }
      return;
    });

    if (convertImage) {
      const img = document.createElement("img");
      img.src = convertedImage;
      console.log(img.src);
      img.style.width = "40%";
      img.style.height = "auto";
      // Replace input element of id "output" to img of id "output"
      document.getElementById("output").innerHTML = "";
      document.getElementById("output").appendChild(img);
      // Show Download Button
      document.getElementById("download").hidden = false;
    }
  }
  document.getElementById("convert").hidden = false;
  document.getElementById("loader").hidden = true;
});

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

async function convertImage(image, format, quality) {
  const data = {
    file: image,
    convert: format,
    quality: quality,
  };
  // Testing Purposes
  // const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  // await delay(4000);
  // throw new Error("Internal Server Error", { cause: "Server is down" });
  const response = await fetch("/", {
    mode: "same-origin",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (response.ok) {
    return await response.json()["image"];
  } else {
    // check if the status code is 400, 500 or 404 in the response.status
    const error = await response.json();
    if (response.status === 500) {
      throw new Error(error.error, { cause: error.message });
    }
    throw new Error(error.error);
  }
}

function saveImage() {
  const img = document.getElementById("output").querySelector("img");
  const a = document.createElement("a");
  a.href = img.src;
  a.download = "image.jpg";
  a.click();
}
