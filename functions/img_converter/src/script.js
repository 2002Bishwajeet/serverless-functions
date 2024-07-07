var themeToggleBtn = document.getElementById("theme-toggle");

function updateIcons() {
  var isDarkMode = document.documentElement.classList.contains("dark");
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

var form = document.getElementById("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var file = document.getElementById("image").files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    var img = document.createElement("img");
    img.src = reader.result;
    console.log(img.src);
    img.style.width = "40%";
    img.style.height = "auto";
    // Replace input element of id "output" to img of id "output"
    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(img);
  };

  if (file) {
    // Get the base64 data
    reader.readAsDataURL(file);
  }
});
