document.addEventListener('DOMContentLoaded', function() {
  const twitterTL = Array.from(document.querySelectorAll('a[href="/home"], a[role="tab"]'))
      .filter(tab => 
        tab.textContent.toLowerCase().includes('for you') || 
        tab.getAttribute('aria-label')?.toLowerCase().includes('for you')
      )[0];
  deleteNode = forYouTabs.parentNode
  deleteNode.remove()
});

// Create a page loader with multiple detection methods
function createLoader() {
  // Create a promise that will resolve when the page is loaded
  let resolvePageLoaded;
  const pageLoaded = new Promise(resolve => {
    // Store the resolve function so we can call it from different places
    resolvePageLoaded = resolve;
  });

  // Function to check if the page is fully loaded
  function checkPageLoaded() {
    // Multiple conditions to determine if the page is ready
    if (
      // Check if document is fully loaded
      document.readyState === 'complete' || 
      
      // Twitter/X specific check - look for a key page element
      document.querySelector('body') !== null
    ) {
      // If conditions are met, resolve the promise
      resolvePageLoaded();
    }
  }

  // Add event listeners to catch different load events
  // DOMContentLoaded fires when initial HTML is loaded
  document.addEventListener('DOMContentLoaded', checkPageLoaded);
  
  // window load event fires when all resources are loaded
  window.addEventListener('load', checkPageLoaded);

  // Fallback timeout to ensure the promise resolves 
  // even if other methods fail
  setTimeout(resolvePageLoaded, 5000);

  // Return the promise that resolves when page is loaded
  return pageLoaded;
}

// Main extension initialization function
async function initializeExtension() {
  // Wait for page to load using our custom loader
  await createLoader();

  // Function to hide the "For You" tab
  function hideForYouTab() {
    // Find all tabs and filter for "For You" tabs
    const forYouTabs = Array.from(document.querySelectorAll('a[role="tab"]'))
      .filter(tab => 
        tab.textContent.toLowerCase().includes('for you') ||
        tab.getAttribute('aria-label')?.toLowerCase().includes('for you')
      )[0];
      // Try to hide parent navigation item if exists
      const parentNode = forYouTabs.parentNode;
      parentNode.remove();
  }

  // Create a MutationObserver to handle dynamic content
  const observer = new MutationObserver((mutations) => {
    // Re-run hide function on each mutation
    // This catches dynamically loaded content
    hideForYouTab();
  });

  // Configure the observer to watch for changes
  observer.observe(document.body, { 
    // Watch for changes to direct children
    childList: true, 
    // Also watch nested descendants
    subtree: true 
  });

  // Initial call to hide "For You" tab
  // Run immediately after page load
  hideForYouTab();
}

// Start the extension
initializeExtension();
