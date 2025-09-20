/// filename: js/products.js
// Products module: renders lists, featured, search/sort, event delegation for add/remove
const Products = (function(){
  let cfg = { gridSelector: '#productsGrid', searchInput: '#searchInput', sortSelect: '#sortSelect' };
  let products = [];

  function _loadLocal() {
    products = Data.load();
  }

  // generic product card renderer (Bootstrap)
  function _productCardHtml(p) {
    return `
      <div class="card product-card h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-2">${p.name}</h5>
          <div class="mb-3 fw-semibold">${p.price} EGP</div>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-sm btn-primary flex-grow-1" data-action="add" data-id="${p.id}"><i class="fas fa-cart-plus me-1"></i> Add to Cart</button>
            <button class="btn btn-sm btn-outline-danger" data-action="remove" data-id="${p.id}"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>`;
  }

  // Render products into provided container; accepts array to render
  function renderProducts(containerSelector, list = []) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';
    if (list.length === 0) {
      container.innerHTML = `<div class="col-12"><div class="alert alert-info">No products found.</div></div>`;
      return;
    }
    const fragment = document.createDocumentFragment();
    list.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-md-4 col-lg-3';
      col.innerHTML = _productCardHtml(p);
      fragment.appendChild(col);
    });
    container.appendChild(fragment);
  }

  // render featured products (first N)
  function renderFeatured(containerSelector, count = 4) {
    _loadLocal();
    const list = products.slice(0, count);
    renderProducts(containerSelector, list);
  }

  // Add a product (uses Data)
  function addProduct(product, { toStart = false } = {}) {
    Data.add(product, { toStart });
    _loadLocal();
  }

  // Remove a product by id (with confirmation)
  function removeProductById(id) {
    Swal.fire({
      title: 'هل تريد حذف المنتج؟',
      text: 'سيتم حذف المنتج نهائياً.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم احذف',
      cancelButtonText: 'إلغاء'
    }).then(res => {
      if (res.isConfirmed) {
        Data.removeById(id);
        _loadLocal();
        // re-render grid if exists
        const grid = document.querySelector(cfg.gridSelector);
        if (grid) applyFiltersAndRender();
        Swal.fire('تم', 'تم الحذف بنجاح', 'success');
      }
    });
  }

  // Search & sort support
  function applyFiltersAndRender() {
    _loadLocal();
    let list = [...products];
    const searchInput = document.querySelector(cfg.searchInput);
    const sortSelect = document.querySelector(cfg.sortSelect);
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const sortVal = sortSelect ? sortSelect.value : '';

    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
    if (sortVal === 'priceLow') list.sort((a,b) => a.price - b.price);
    if (sortVal === 'priceHigh') list.sort((a,b) => b.price - a.price);

    renderProducts(cfg.gridSelector, list);
  }

  // event delegation for add-to-cart and remove
  function _attachDelegation() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = Number(btn.dataset.id);
      if (action === 'add') {
        const prod = Data.getById(id);
        if (!prod) return;
        Cart.addItem({ id: prod.id, name: prod.name, price: prod.price, image: prod.image }, 1);
        Swal.fire({ icon: 'success', title: 'Added to cart', timer: 800, showConfirmButton: false });
        Cart.updateCountBadge('#cartCountBadge');
      } else if (action === 'remove') {
        removeProductById(id);
      }
    });
  }

  function init(options = {}) {
    cfg = Object.assign(cfg, options);
    _loadLocal();
    applyFiltersAndRender();

    // wire search + sort
    const searchInput = document.querySelector(cfg.searchInput);
    const sortSelect = document.querySelector(cfg.sortSelect);
    if (searchInput) {
      searchInput.addEventListener('input', debounce(applyFiltersAndRender, 250));
    }
    if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndRender);

    _attachDelegation();
  }

  // small debounce utility
  function debounce(fn, wait = 200) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  return { init, renderProducts, renderFeatured, addProduct };
})();