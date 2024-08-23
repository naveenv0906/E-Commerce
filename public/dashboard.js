$(document).ready(function () {
    // Fetch data from the dashboard API
    fetch('/api/dashboard')
        .then(response => response.json())
        .then(data => {
            animateValue("total-products", 0, data.totalProducts, 2000);
            animateValue("total-price", 0, data.totalPrice, 2000);
        })
        .catch(error => console.error('Error fetching dashboard data:', error));
});

// Function to animate the number increase
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
