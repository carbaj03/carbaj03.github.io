document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeButton = document.getElementById('mobile-menu-close');

    // Toggle mobile menu visibility when hamburger button is clicked
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden'); // Prevent scrolling when menu is open
        });
    }

    // Close mobile menu when close button is clicked
    if (closeButton && mobileMenu) {
        closeButton.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = mobileMenu ? mobileMenu.contains(event.target) : false;
        const isClickOnMenuButton = menuButton ? menuButton.contains(event.target) : false;

        if (mobileMenu && !mobileMenu.classList.contains('hidden') && !isClickInsideMenu && !isClickOnMenuButton) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    });
});