// module.exports = async function fetchCatApi() {
//   try {
//     const response = await axios.get(
//       "https://api.thecatapi.com/v1/images/search"
//     );
//     return response.data[0].url;
//   } catch (error) {
//     console.error("Error fetching API data:", error);
//     throw error;
//   }
// };

document.addEventListener("DOMContentLoaded", () => {
  async function loadDataAndSetImage() {
    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );
      const imgUrl = response.data[0].url;
      const imgElement = document.getElementById("cat-api-image");
      imgElement.src = imgUrl;
    } catch (error) {
      console.log("Error fetching cat data! : ", error);
    }
  }
  loadDataAndSetImage();

  const imgElement = document.getElementById("cat-api-image");
  imgElement.addEventListener("click", loadDataAndSetImage);
});
