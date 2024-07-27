$(document).ready(function () {
    $('a.btn').click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 1000, function () {
            window.location.href = '/';
        });
    });
});
