document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-product-form');
  const productsList = document.getElementById('products');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form); 

    // Log the form data for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Product added successfully');
        form.reset();
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
});