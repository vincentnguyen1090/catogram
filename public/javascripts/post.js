const commentInput = document.getElementById("commentInput");
const submitButton = document.getElementById("submitButton");

if (commentInput && submitButton) {
  commentInput.addEventListener("input", function () {
    if (commentInput.value.trim() !== "") {
      submitButton.disabled = false;
      submitButton.classList.add("commented");
    } else {
      submitButton.disabled = true;
      submitButton.classList.remove("commented");
    }
  });
}
