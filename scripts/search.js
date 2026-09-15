const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');

if (searchInput && searchButton) {

function searchProducts() {
  const searchText = searchInput.value.trim();
  const query = searchText ? `?search=${encodeURIComponent(searchText)}` : '';
  window.location.href = `amazon.html${query}`;
}

searchButton.addEventListener('click', searchProducts);
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    searchProducts();
  }
});
}