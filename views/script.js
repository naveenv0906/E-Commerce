document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-product-form');
  const productsList = document.getElementById('products');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);  // Create FormData from the form

    // Log the form data for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Product added successfully');
        form.reset();
        fetchProducts();  // Fetch and display products after adding a new one
      } else {
        const errorText = await response.text();
        console.error('Failed to add product:', response.statusText, errorText);
        alert('Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });

  // Function to fetch and display products
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
    productsList.innerHTML = '';

    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${product.name}</strong> - $${product.price}<br>
        <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto;"><br>
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
});
