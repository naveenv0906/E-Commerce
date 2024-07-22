async function fetchProducts(page = 1, limit = 5) {
  try {
      console.log(`Fetching products for page ${page}...`);
      const response = await fetch(`http://localhost:3000/products?page=${page}&limit=${limit}`);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
          displayProducts(data.products);
          updatePagination(data.currentPage, data.totalPages);
      } else {
          throw new Error('Failed to fetch products');
      }
  } catch (error) {
      console.error('Error fetching products:', error);
  }
}

function displayProducts(products) {
  const productsList = document.getElementById('products');
  productsList.innerHTML = '';

  products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
          <strong>${product.name}</strong> - $${product.price}<br>
          <img src="${product.image}" alt="${product.name}" style="max-width: 50%; height: 150px;"><br>
          <em>${product.description}</em>
      `;
      productsList.appendChild(li);
  });
}

function updatePagination(currentPage, totalPages) {
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('prev').disabled = currentPage === 1;
  document.getElementById('next').disabled = currentPage === totalPages;
}

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

fetchProducts();
