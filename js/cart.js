/// filename: js/cart.js
// Cart module: handles cart storage, rendering, and operations
const Cart = (function(){
  const KEY = 'miniShop_cart';
  let cfg = { container: '#cartContainer', totalEl: '#cartTotal' };

  function loadCart(){
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveCart(arr){
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function addItem(item, qty = 1) {
    const cart = loadCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) existing.qty += qty;
    else cart.push({ ...item, qty });
    saveCart(cart);
  }

  function removeItem(id) {
    const updated = loadCart().filter(i => i.id !== id);
    saveCart(updated);
  }

  function clearCart() {
    saveCart([]);
  }

  function updateCountBadge(selector) {
    const badge = document.querySelector(selector);
    if (!badge) return;
    const count = loadCart().reduce((s, i) => s + i.qty, 0);
    badge.textContent = count;
    if (count === 0) badge.style.display = 'inline-block';
  }

  function render(){
    const container = document.querySelector(cfg.container);
    const totalEl = document.querySelector(cfg.totalEl);
    if (!container || !totalEl) return;

    const cart = loadCart();
    container.innerHTML = '';
    if (cart.length === 0) {
      container.innerHTML = '<div class="alert alert-info">سلة التسوق فارغة.</div>';
      totalEl.textContent = '0';
      updateCountBadge('#cartCountBadge');
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'd-flex align-items-center gap-3 mb-3 p-3 border rounded';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;object-fit:contain;background:#fff;padding:6px;border:1px solid #eee;">
        <div class="flex-grow-1">
          <div class="fw-semibold">${item.name}</div>
          <div class="small text-muted">${item.price} EGP x ${item.qty}</div>
        </div>
        <div class="text-end">
          <div class="fw-bold">${item.price * item.qty} EGP</div>
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-danger btn-remove-item" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
      // attach remove handler
      row.querySelector('.btn-remove-item').addEventListener('click', () => {
        Swal.fire({ title: 'Remove item?', showCancelButton:true }).then(res => {
          if (res.isConfirmed) {
            removeItem(item.id);
            render();
            updateCountBadge('#cartCountBadge');
          }
        });
      });

      container.appendChild(row);
    });

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    totalEl.textContent = total;
    updateCountBadge('#cartCountBadge');
  }

  function init(options = {}) {
    cfg = Object.assign(cfg, options);

    // clear cart button
    const clearBtn = document.querySelector(cfg.clearBtn);
    const checkoutBtn = document.querySelector(cfg.checkoutBtn);

    // wire clear if provided globally via init caller
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#clearCartBtn');
      if (btn) {
        Swal.fire({ title: 'Clear cart?', showCancelButton:true }).then(res => {
          if (res.isConfirmed) {
            clearCart();
            render();
            updateCountBadge('#cartCountBadge');
          }
        });
      }
      const ch = e.target.closest('#checkoutBtn');
      if (ch) {
        const cart = loadCart();
        if (cart.length === 0) {
          Swal.fire('Cart empty', 'Add products before checkout', 'info');
          return;
        }
        Swal.fire({ icon:'success', title: 'Order placed', text: 'Thank you!', timer:1200, showConfirmButton:false })
          .then(() => {
            clearCart();
            render();
            updateCountBadge('#cartCountBadge');
          });
      }
    });

    render();
  }

  return { init, render, addItem, removeItem, clearCart, updateCountBadge };
})();