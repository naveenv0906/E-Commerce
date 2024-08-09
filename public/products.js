document.addEventListener('DOMContentLoaded', () => {
  async function fetchProducts(page = 1, limit = 3) {
    try {
      console.log(`Fetching products for page ${page}...`);
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', response.status, response.statusText, errorText);
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      displayProducts(data.products);
      updatePagination(data.currentPage, data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      document.getElementById('error-message').classList.remove('d-none');
    }
  }

  function displayProducts(products) {
    const productsList = document.getElementById('products');
    productsList.innerHTML = '';

    products.forEach(product => {
      const col = document.createElement('div');
      col.classList.add('col-md-4');

      const card = document.createElement('div');
      card.classList.add('card', 'h-100');

      card.innerHTML = `
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">$${product.price}</p>
          <p class="card-text">${product.description}</p>
          <button class="btn btn-primary update-product" data-id="${product._id}" data-toggle="modal" data-target="#updateProductModal">Update</button>
          <button class="btn btn-danger delete-product" data-id="${product._id}">Delete</button>
        </div>
      `;

      col.appendChild(card);
      productsList.appendChild(col);
    });

    // Attach event listeners to all delete buttons
    document.querySelectorAll('.delete-product').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.getAttribute('data-id');
        try {
          const response = await fetch(`/api/products/${productId}`, { 
            method: 'DELETE' 
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to delete product:', response.status, response.statusText, errorText);
            throw new Error('Failed to delete product');
          }

          // Re-fetch products after deletion
          const currentPage = parseInt(document.getElementById('page-info').textContent.split(' ')[1], 10);
          fetchProducts(currentPage);

        } catch (error) {
          console.error('Error deleting product:', error);
          alert('Failed to delete product.');
        }
      });
    });

    // Attach event listeners to all update buttons
    document.querySelectorAll('.update-product').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        const product = products.find(p => p._id === productId);

        document.getElementById('updateProductId').value = product._id;
        document.getElementById('updateProductName').value = product.name;
        document.getElementById('updateProductPrice').value = product.price;
        document.getElementById('updateProductDescription').value = product.description;
      });
    });

    document.getElementById('saveProductChanges').addEventListener('click', async () => {
      const productId = document.getElementById('updateProductId').value;
      const formData = new FormData();
      formData.append('name', document.getElementById('updateProductName').value);
      formData.append('price', document.getElementById('updateProductPrice').value);
      formData.append('description', document.getElementById('updateProductDescription').value);

      const imageFile = document.getElementById('updateProductImage').files[0];
      if (imageFile) {
        formData.append('image', imageFile);
      }

      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'PUT',
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to update product:', response.status, response.statusText, errorText);
          throw new Error('Failed to update product');
        }

        // Close the modal
        $('#updateProductModal').modal('hide');

        // Re-fetch products after update
        const currentPage = parseInt(document.getElementById('page-info').textContent.split(' ')[1], 10);
        fetchProducts(currentPage);

      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
      }
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

  // Initial fetch
  fetchProducts();
});
