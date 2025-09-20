/// filename: js/main.js
// Main UI helpers: year, active nav link, logout wiring, theme toggle
document.addEventListener('DOMContentLoaded', () => {
  // set year(s)
  document.querySelectorAll('#siteYear').forEach(el => el.textContent = new Date().getFullYear());

  // activate navbar link based on file name
  const links = document.querySelectorAll('.navbar .nav-link');
  const current = location.pathname.split('/').pop() || 'home.html';
  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.endsWith(current)) {
      link.classList.add('active');
    }
  });

  // logout link
  document.querySelectorAll('#logoutLink').forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      Swal.fire({
        title: 'تسجيل الخروج؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم',
        cancelButtonText: 'لا'
      }).then(res => {
        if (res.isConfirmed) Auth.logout();
      });
    });
  });

  // theme toggle: toggles html[data-theme]
  const themeBtn = document.querySelectorAll('#themeToggle');
  themeBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      // store preference
      localStorage.setItem('miniShop_theme', next);
    });
  });

  // apply stored theme
  const savedTheme = localStorage.getItem('miniShop_theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  // wire cart count updates (on page load)
  if (window.Cart && typeof Cart.updateCountBadge === 'function') {
    Cart.updateCountBadge('#cartCountBadge');
  }
});
// set footer year
  document.querySelectorAll('#siteYearFooter').forEach(el => el.textContent = new Date().getFullYear());

  // newsletter handler (client-side only)
  document.getElementById('footerNewsletter')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Swal.fire('Invalid email', 'Please enter a valid email address.', 'error');
      return;
    }
    // fake subscribe
    Swal.fire({ icon: 'success', title: 'Subscribed', text: 'You are now subscribed to our newsletter.', timer: 1200, showConfirmButton: false });
    this.reset();
  });

  // back to top
  document.getElementById('backToTop')?.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });