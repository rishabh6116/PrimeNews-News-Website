document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchBtn = document.querySelector('.search-btn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const closeSearch = document.getElementById('closeSearch');

  const subBtn = document.querySelector('.sub-btn');
  const mainModal = document.getElementById('mainModal');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.getElementById('closeModal');

  const catItems = document.querySelectorAll('.cat-item');
  const navLinks = document.querySelectorAll('.nav a');

  // All filterable news items
  const getNewsItems = () => {
    return [
      ...document.querySelectorAll('.card'),
      ...document.querySelectorAll('.side-story'),
      ...document.querySelectorAll('.trend-item'),
      ...document.querySelectorAll('.hero')
    ];
  };

  // 1. Search Logic
  searchBtn.onclick = () => searchOverlay.style.display = 'flex';
  closeSearch.onclick = () => {
    searchOverlay.style.display = 'none';
    searchInput.value = '';
    filterItems(); // Reset filters
  };

  searchInput.oninput = () => {
    const term = searchInput.value.toLowerCase();
    const items = getNewsItems();
    items.forEach(item => {
      const title = item.querySelector('.hero-title, .side-title, .card-title, .trend-title')?.innerText.toLowerCase() || '';
      item.style.display = title.includes(term) ? '' : 'none';
    });
  };

  // 2. Category Filtering
  const filterByCategory = (category) => {
    const items = getNewsItems();
    items.forEach(item => {
      const itemCat = item.querySelector('.cat-tag')?.innerText || 'ताज़ा खबरें';
      // "ताज़ा खबरें" shows everything
      if (category === 'ताज़ा खबरें' || itemCat === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    // Update active UI state for cat-items
    catItems.forEach(ci => ci.style.color = 'var(--color-text-secondary)');
    const active = Array.from(catItems).find(ci => ci.innerText === category);
    if (active) active.style.color = '#C0220A';
  };

  catItems.forEach(item => {
    item.onclick = () => filterByCategory(item.innerText);
  });

  navLinks.forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      filterByCategory(link.innerText);
    };
  });

  function filterItems() {
    getNewsItems().forEach(item => item.style.display = '');
  }

  // 3. Modal Management
  const openModal = (contentHTML) => {
    modalBody.innerHTML = contentHTML;
    mainModal.style.display = 'flex';
  };

  closeModal.onclick = () => mainModal.style.display = 'none';
  window.onclick = (e) => { if (e.target === mainModal) mainModal.style.display = 'none'; };

  // Article Reading Trigger
  document.addEventListener('click', (e) => {
    const titleEl = e.target.closest('.hero-title, .side-title, .card-title, .trend-title');
    if (titleEl) {
      const title = titleEl.innerText;
      const mockContent = `यह ${title} के बारे में एक विस्तृत समाचार रिपोर्ट है। यहाँ {Mock Content} लोड किया गया है जो लेख की पूरी जानकारी प्रदान करता है। प्राइम न्यूज़ आपको सटीक और निष्पक्ष खबरें देने के लिए प्रतिबद्ध है।`;
      openModal(`
        <h2 class="modal-body-title">${title}</h2>
        <div class="modal-body-text">${mockContent}</div>
      `);
    }
  });

  // 4. Subscription Logic
  subBtn.onclick = () => {
    openModal(`
      <div class="sub-form">
        <h2 class="modal-body-title">सदस्यता लें</h2>
        <p class="modal-body-text">सबसे ताज़ा खबरों के लिए अपना ईमेल दर्ज करें।</p>
        <input type="email" id="subEmail" class="sub-input" placeholder="email@example.com">
        <button id="confirmSub" class="sub-submit">सबमिट करें</button>
      </div>
    `);

    // Re-bind submit button since it's dynamic
    setTimeout(() => {
      document.getElementById('confirmSub')?.addEventListener('click', () => {
        const email = document.getElementById('subEmail').value;
        if(email) {
          alert('धन्यवाद! आप सफलतापूर्वक सब्सक्राइब हो गए हैं।');
          mainModal.style.display = 'none';
        } else {
          alert('कृपया एक मान्य ईमेल दर्ज करें।');
        }
      });
    }, 10);
  };
});