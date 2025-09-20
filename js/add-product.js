// js/add-product.js
const Products = (function() {
  let products = [];

  function load() {
    const stored = localStorage.getItem('products');
    products = stored ? JSON.parse(stored) : [];
  }

  function save() {
    localStorage.setItem('products', JSON.stringify(products));
  }

  function render(selector = '#productList') {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">$${p.price}</p>
            <button class="btn btn-danger mt-auto remove-btn" data-id="${p.id}">Remove</button>
          </div>
        </div>`;
      container.appendChild(card);
    });

    // Remove handler
    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        remove(id);
      });
    });
  }

  function add(product) {
    products.push(product); // previous behavior
    save();
  }

  function addToStart(product) {
    products.unshift(product); // new: add to start
    save();
  }

  function remove(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if(result.isConfirmed){
        products = products.filter(p => p.id !== id);
        save();
        render();
      }
    });
  }

  function getAll() {
    return [...products];
  }

  load();

  return { render, add, addToStart, remove, getAll };
})();