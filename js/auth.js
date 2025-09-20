/// filename: js/auth.js
// Auth module: supports multiple demo users + remember me + session expiry
const Auth = (function(){
  const SESSION_KEY = 'miniShop_session';
  // demo users - can add more if needed
  const demoUsers = [
    { email: 'user@example.com', pass: '123456', name: 'Demo User' },
    { email: 'admin@example.com', pass: 'admin123', name: 'Admin' }
  ];

  function _saveSession(obj, remember = false){
    // if remember true, set far expiry (30 days), else session short (2 hours)
    const now = Date.now();
    const ttl = remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 2;
    const payload = { ...obj, expiresAt: now + ttl };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  }

  function login(email, pass, remember = false){
    const matched = demoUsers.find(u => u.email === email && u.pass === pass);
    if (matched) {
      _saveSession({ email: matched.email, name: matched.name }, remember);
      if (remember) localStorage.setItem('miniShop_remember_email', matched.email);
      else localStorage.removeItem('miniShop_remember_email');

      Swal.fire({
        icon: 'success',
        title: `Welcome, ${matched.name}`,
        showConfirmButton: false,
        timer: 900
      }).then(() => {
        window.location.href = 'home.html'; // ← direct to root home.html
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Invalid credentials' });
    }
  }

  function logout(){
    localStorage.removeItem(SESSION_KEY);
    // leave remember email intact
    Swal.fire({
      icon: 'success',
      title: 'Logged out',
      timer: 800,
      showConfirmButton: false
    }).then(() => {
      window.location.href = 'index.html'; // ← always root
    });
  }

  function isLoggedIn(){
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    try {
      const obj = JSON.parse(raw);
      if (!obj.expiresAt || Date.now() > obj.expiresAt) {
        localStorage.removeItem(SESSION_KEY);
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
  }

  function currentUser(){
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (!obj.expiresAt || Date.now() > obj.expiresAt) return null;
      return { email: obj.email, name: obj.name };
    } catch { return null; }
  }

  function requireAuth(){
    if (!isLoggedIn()) {
      window.location.href = 'index.html'; // ← always root
    }
  }

  return { login, logout, isLoggedIn, currentUser, requireAuth };
})();