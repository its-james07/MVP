/**
 * sidebar.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles all behaviour for the left-panel filter sidebar:
 *   1. Mobile drawer  – open / close / overlay / Escape key
 *   2. Accordion      – collapsible filter groups with animated max-height
 *   3. Price slider   – dual-thumb range with live track fill and price labels
 *   4. Apply filters  – reads all controls and fires a custom event
 *   5. Clear filters  – resets every control back to its default state
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────────────────────
   * DOM REFERENCES
   * Cache every element the sidebar needs so we never query the DOM twice.
   * ───────────────────────────────────────────────────────────────────────── */
  const sidebar         = document.getElementById('sidebar');
  const overlay         = document.getElementById('sidebarOverlay');
  const filterToggleBtn = document.getElementById('filterToggle');
  const sidebarCloseBtn = document.getElementById('sidebarClose');
  const applyBtn        = document.getElementById('applyFilters')  || document.querySelector('.apply-filters-btn');
  const clearBtn        = document.getElementById('clearFilters')  || document.querySelector('.clear-filters-btn');
  const rangeMin        = document.getElementById('rangeMin');
  const rangeMax        = document.getElementById('rangeMax');
  const priceMinLabel   = document.getElementById('priceMin');
  const priceMaxLabel   = document.getElementById('priceMax');
  const rangeTrack      = document.querySelector('.range-slider-wrap');


  /* ─────────────────────────────────────────────────────────────────────────
   * 1. MOBILE DRAWER
   * On screens ≤ 1024 px the sidebar slides in from the left.
   * The overlay behind it closes the drawer when clicked.
   * ───────────────────────────────────────────────────────────────────────── */

  /**
   * Opens the sidebar drawer.
   * Adds .open to the sidebar, .active to the overlay, and locks page scroll
   * so the background does not scroll while the panel is open.
   */
  const openSidebar = () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  /**
   * Closes the sidebar drawer.
   * Removes .open and .active, restores page scroll.
   */
  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Open when the mobile "Filters" toggle button is clicked
  filterToggleBtn?.addEventListener('click', openSidebar);

  // Close via the ✕ button inside the sidebar
  sidebarCloseBtn?.addEventListener('click', closeSidebar);

  // Close when clicking the dark overlay behind the sidebar
  overlay?.addEventListener('click', closeSidebar);

  // Close on Escape key – standard accessibility pattern for drawers
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });


  /* ─────────────────────────────────────────────────────────────────────────
   * 2. ACCORDION FILTER GROUPS
   * Each .filter-group contains a header button and a collapsible body.
   * Toggling adds/removes .collapsed on the group, which the CSS uses to
   * rotate the chevron icon. We animate max-height explicitly here because
   * CSS cannot transition from a fixed value to `auto`.
   * ───────────────────────────────────────────────────────────────────────── */

  /**
   * Toggles a single filter group open or closed.
   * @param {HTMLElement} header - The clicked .filter-group-header button
   */
  const toggleGroup = header => {
    const group = header.closest('.filter-group');
    const body  = group.querySelector('.filter-group-body');

    const isNowCollapsed = group.classList.toggle('collapsed');

    // aria-expanded reflects the visible state for screen readers
    header.setAttribute('aria-expanded', String(!isNowCollapsed));

    // Animate max-height: collapsed → 0, expanded → measured scrollHeight
    body.style.maxHeight = isNowCollapsed ? '0' : `${body.scrollHeight}px`;
  };

  // Set an explicit initial max-height on every group body so the CSS
  // transition has a concrete pixel value to animate from on first toggle
  document.querySelectorAll('.filter-group').forEach(group => {
    const header = group.querySelector('.filter-group-header');
    const body   = group.querySelector('.filter-group-body');

    // Start expanded
    body.style.maxHeight = `${body.scrollHeight}px`;
    header.setAttribute('aria-expanded', 'true');

    header.addEventListener('click', () => toggleGroup(header));
  });


  /* ─────────────────────────────────────────────────────────────────────────
   * 3. DUAL-THUMB PRICE RANGE SLIDER
   * Two overlapping <input type="range"> elements share the same track.
   * We repaint a CSS gradient on the track to fill only the selected segment,
   * and update the visible Rs labels on every input event.
   * ───────────────────────────────────────────────────────────────────────── */

  /**
   * Formats a number as a localised Indian-Rupee price string.
   * @param   {number} value
   * @returns {string}  e.g. "Rs 1,299"
   */
  const formatPrice = value =>
    'Rs\u00a0' + parseInt(value, 10).toLocaleString('en-IN');

  /**
   * Reads both range inputs, enforces a minimum gap between the thumbs,
   * updates the price labels, and repaints the coloured track segment.
   */
  const updateRangeSlider = () => {
    let minVal = parseInt(rangeMin.value, 10);
    let maxVal = parseInt(rangeMax.value, 10);
    const absMax = parseInt(rangeMax.max, 10);

    // Prevent the thumbs from crossing – maintain at least Rs 100 gap
    if (minVal > maxVal - 100) {
      minVal = maxVal - 100;
      rangeMin.value = minVal;
    }

    // Update the readable price labels above the slider
    priceMinLabel.textContent = formatPrice(minVal);
    priceMaxLabel.textContent = formatPrice(maxVal);

    // Compute percentage positions for the gradient breakpoints
    const toPercent = v => ((v / absMax) * 100).toFixed(2);
    const leftPct   = toPercent(minVal);
    const rightPct  = toPercent(maxVal);

    // Repaint: grey | accent colour between thumbs | grey
    rangeTrack.style.background =
      `linear-gradient(to right,
        var(--clr-border) ${leftPct}%,
        var(--clr-accent) ${leftPct}%,
        var(--clr-accent) ${rightPct}%,
        var(--clr-border) ${rightPct}%)`;
  };

  rangeMin?.addEventListener('input', updateRangeSlider);
  rangeMax?.addEventListener('input', updateRangeSlider);

  // Paint the initial state on page load
  updateRangeSlider();


  /* ─────────────────────────────────────────────────────────────────────────
   * 4. APPLY FILTERS
   * Reads all sidebar controls, packages the values into a plain object,
   * and dispatches a custom DOM event so the rest of your app can react
   * without sidebar.js needing to know anything about the product grid.
   * ───────────────────────────────────────────────────────────────────────── */

  /**
   * Reads the checked values from all checkboxes inside a named filter group.
   * @param   {string}   groupAttr  Value of the [data-group] attribute
   * @returns {string[]}            Array of checked checkbox values
   */
  const getCheckedValues = groupAttr =>
    [...document.querySelectorAll(`[data-group="${groupAttr}"] input[type="checkbox"]:checked`)]
      .map(cb => cb.value);

  /**
   * Reads the currently selected minimum star rating from the radio group.
   * Falls back to 0 if no radio is checked.
   * @returns {number}
   */
  const getMinRating = () =>
    parseFloat(
      document.querySelector('input[name="rating"]:checked')?.value ?? 0
    );

  /**
   * Collects all current filter values and dispatches a 'filtersApplied'
   * CustomEvent on the document. The product-grid module (or any other
   * listener) can handle it independently.
   *
   * Event detail shape:
   * {
   *   pets:       string[],  // e.g. ['dogs', 'cats']
   *   categories: string[],  // e.g. ['food', 'toys']
   *   minPrice:   number,
   *   maxPrice:   number,
   *   minRating:  number,
   * }
   */
  const applyFilters = () => {
    const filterData = {
      pets:       getCheckedValues('pet-type'),
      categories: getCheckedValues('category'),
      minPrice:   parseInt(rangeMin.value, 10),
      maxPrice:   parseInt(rangeMax.value, 10),
      minRating:  getMinRating(),
    };

    // Dispatch so the grid (or any other module) can listen and react
    document.dispatchEvent(
      new CustomEvent('filtersApplied', { detail: filterData, bubbles: true })
    );

    // Close the mobile drawer after applying
    closeSidebar();
  };

  applyBtn?.addEventListener('click', applyFilters);


  /* ─────────────────────────────────────────────────────────────────────────
   * 5. CLEAR FILTERS
   * Resets every control in the sidebar to its default state and fires a
   * 'filtersCleared' event so the product grid can restore its full list.
   * ───────────────────────────────────────────────────────────────────────── */

  /**
   * Resets all sidebar controls:
   *   - Re-checks all pet-type and category checkboxes
   *   - Resets the star-rating radio to "All"
   *   - Resets both range thumbs to their min/max extents
   *   - Repaints the slider track
   * Then dispatches 'filtersCleared' so the product grid can react.
   */
  const clearFilters = () => {
    // Re-check all checkboxes in the sidebar
    sidebar.querySelectorAll('input[type="checkbox"]')
      .forEach(cb => { cb.checked = true; });

    // Reset the minimum-rating radio back to "All" (value="0")
    const allRatingRadio = sidebar.querySelector('input[name="rating"][value="0"]');
    if (allRatingRadio) allRatingRadio.checked = true;

    // Reset both price thumbs to their full extents
    rangeMin.value = rangeMin.min;
    rangeMax.value = rangeMax.max;
    updateRangeSlider();

    // Notify the rest of the app
    document.dispatchEvent(
      new CustomEvent('filtersCleared', { bubbles: true })
    );
  };

  clearBtn?.addEventListener('click', clearFilters);

});