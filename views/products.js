document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch products with pagination
  async function fetchProducts(page = 1, limit = 5) {
      try {
          console.log(`Fetching products for page ${page}...`);
          const response = await fetch(`http://localhost:3000/products?page=${page}&limit=${limit}`);
          
          // Check if the response is ok before parsing
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Response data:', data);

          // Ensure the data structure matches expected format
          if (data && data.products && Array.isArray(data.products)) {
              displayProducts(data.products);
              updatePagination(data.currentPage, data.totalPages);
          } else {
              throw new Error('Unexpected data format');
          }
      } catch (error) {
          console.error('Error fetching products:', error);
          alert('An error occurred while fetching products. Please try again.');
      }
  }

  // Function to display products in the UI
  function displayProducts(products) {
      const productsList = document.getElementById('products');
      productsList.innerHTML = '';

      products.forEach(product => {
          const li = document.createElement('li');
          li.classList.add('d-flex', 'align-items-start');

          li.innerHTML = `
              <div class="product-image">
                  <img src="${product.image}" alt="${product.name}" style="max-width: 150px; height: auto; border-radius: 8px;">
              </div>
              <div class="product-details">
                  <div class="product-name"><strong>${product.name}</strong></div>
                  <div class="product-price">$${product.price}</div>
                  <div class="product-description">${product.description}</div>
              </div>
          `;

          productsList.appendChild(li);
      });
  }

  // Function to update pagination controls
  function updatePagination(currentPage, totalPages) {
      const pageInfo = document.getElementById('page-info');
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      document.getElementById('prev').disabled = currentPage === 1;
      document.getElementById('next').disabled = currentPage === totalPages;
  }

  // Event listeners for pagination buttons
  document.getElementById('prev').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('page-info').textContent.split(' ')[1], 10);
      if (currentPage > 1) {
          fetchProducts(currentPage - 1);
      }
  });

  document.getElementById('next').addEventListener('click', () => {
      const currentPage = parseInt(document.getElementById('page-info').textContent.split(' ')[1], 10);
      const totalPages = parseInt(document.getElementById('page-info').textContent.split(' ')[3], 10);
      if (currentPage < totalPages) {
          fetchProducts(currentPage + 1);
      }
  });

  // Initial fetch to load products when the page loads
  fetchProducts();
});
