(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('_ct_q');

  if (query) {
    const searchInput = document.getElementById('searchParam');
    if (searchInput) {
      searchInput.value = query;
      // Trigger input event so any listeners (like React/Vue) pick up the change
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Click the search button
      const searchContainer = searchInput.closest('.c-search');
      if (searchContainer) {
        const searchButton = searchContainer.querySelector('.c-search__button');
        if (searchButton) {
          searchButton.click();
          console.log('Comic Track: Clicked search button');
        }
      }
      
      console.log('Comic Track: Populated search with', query);
    } else {
      // If the input isn't available immediately, we might want to wait for it
      const observer = new MutationObserver((mutations, obs) => {
        const input = document.getElementById('searchParam');
        if (input) {
          input.value = query;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          
          const searchContainer = input.closest('.c-search');
          if (searchContainer) {
            const searchButton = searchContainer.querySelector('.c-search__button');
            if (searchButton) {
              searchButton.click();
              console.log('Comic Track: Clicked search button (after mutation)');
            }
          }
          
          console.log('Comic Track: Populated search (after mutation) with', query);
          obs.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      
      // Timeout to stop observing after 5 seconds
      setTimeout(() => observer.disconnect(), 5000);
    }
  }
})();
