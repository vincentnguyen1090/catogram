function toggleLike(catId, heartIcon) {
  axios
    .put(`/cats/${catId}/like`)
    .then((response) => {
      const data = response.data; // Access the data returned from the server

      // Update the UI with the new like count
      const likesCount = document.querySelector(`#likes-count-${catId}`);
      likesCount.textContent = `${data.likes} likes`;

      heartIcon.classList.toggle("liked");
    })
    .catch((error) => {
      if (
        (error.response && error.response.status === 401) ||
        (error.response && error.response.status == 404)
      ) {
        console.log("in if statement");
        window.location.href = "/login";
      } else {
        console.log("in else statement");
        console.error("Error:", error);
      }
    });
}
