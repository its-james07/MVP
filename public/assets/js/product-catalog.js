document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.filter-group-header').forEach(header => {
    const group = header.closest('.filter-group');
    const body = group.querySelector('.filter-group-body');
    body.style.maxHeight = body.scrollHeight + 'px';

    header.addEventListener('click', () => {
      const isCollapsed = group.classList.toggle('collapsed');
      header.setAttribute('aria-expanded', String(!isCollapsed));

      if (isCollapsed) {
        body.style.maxHeight = '0';
      } else {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  const sidebar = document.getElementById('sidebar');
  const filterToggleBtn = document.getElementById('filterToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  filterToggleBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });

  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');

  function formatPrice(val) {
    return 'Rs ' + parseInt(val).toLocaleString('en-IN');
  }

  function updateRange() {
    let minVal = parseInt(rangeMin.value);
    let maxVal = parseInt(rangeMax.value);

    if (minVal > maxVal - 100) {
      minVal = maxVal - 100;
      rangeMin.value = minVal;
    }

    priceMin.textContent = formatPrice(minVal);
    priceMax.textContent = formatPrice(maxVal);

    const min = parseInt(rangeMin.min);
    const max = parseInt(rangeMax.max);
    const left = ((minVal - min) / (max - min)) * 100;
    const right = ((maxVal - min) / (max - min)) * 100;

    const wrap = document.querySelector('.range-slider-wrap');
    wrap.style.background = `linear-gradient(to right, #E8E1D9 ${left}%, #2D6A4F ${left}%, #2D6A4F ${right}%, #E8E1D9 ${right}%)`;
  }

  rangeMin.addEventListener('input', updateRange);
  rangeMax.addEventListener('input', updateRange);
  updateRange();

  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', () => {
    const grid = document.getElementById('productGrid');
    const cards = Array.from(grid.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.card-price').textContent.replace(/[^0-9.]/g, ''));
      const priceB = parseFloat(b.querySelector('.card-price').textContent.replace(/[^0-9.]/g, ''));

      if (sortSelect.value === 'low-high') return priceA - priceB;
      if (sortSelect.value === 'high-low') return priceB - priceA;
      return 0;
    });

    cards.forEach((card, i) => {
      card.style.animation = 'none';
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      grid.appendChild(card);
      setTimeout(() => {
        card.style.transition = 'opacity .3s ease, transform .3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    });

    showToast('Products sorted ✓', 'success');
  });

  document.querySelector('.apply-filters-btn').addEventListener('click', () => {
    closeSidebar();
    showToast('Filters applied ✓', 'success');
  });

  document.querySelector('.clear-filters-btn').addEventListener('click', () => {
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    rangeMin.value = 0;
    rangeMax.value = 5000;
    updateRange();
    showToast('Filters cleared', 'error');
  });

  const pageBtns = document.querySelectorAll('.page-btn');

  pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;

      if (page === 'prev' || page === 'next') {
        const active = document.querySelector('.page-btn.active');
        const pages = Array.from(document.querySelectorAll('.page-btn:not([data-page="prev"]):not([data-page="next"]):not(.page-ellipsis)'));
        const idx = pages.indexOf(active);

        if (page === 'prev' && idx > 0) pages[idx - 1].click();
        if (page === 'next' && idx < pages.length - 1) pages[idx + 1].click();
        return;
      }

      document.querySelector('.page-btn.active')?.classList.remove('active');
      btn.classList.add('active');

      const pages = Array.from(document.querySelectorAll('.page-btn[data-page]')).filter(b => !isNaN(b.dataset.page));
      const newIdx = pages.indexOf(btn);
      document.querySelector('[data-page="prev"]').disabled = (newIdx === 0);
      document.querySelector('[data-page="next"]').disabled = (newIdx === pages.length - 1);

      document.querySelector('.product-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  let toastTimer;

  function showToast(message, type = 'success', duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  window.showToast = showToast;

});