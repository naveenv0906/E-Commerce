async function fetchProducts(page, limit) {
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
    const col = document.createElement('div');
    col.classList.add('col-md-4', 'mb-4'); // Adjust column width based on screen size

    const card = document.createElement('div');
    card.classList.add('card', 'h-100'); // Card component for consistent styling

    card.innerHTML = `
      <img src="${product.image}" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">$${product.price}</p>
        <p class="card-text">${product.description}</p>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${product._id}">Delete</button>
      </div>
    `;

    col.appendChild(card);
    productsList.appendChild(col);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      deleteProduct(productId);
    });
  });
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('Product deleted successfully');
      fetchProducts();  // Refresh the product list
    } else {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
  }
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
