// This file helps debug "Failed to fetch" errors by logging the URL of every fetch call.

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    let url = args[0] instanceof Request ? args[0].url : args[0];
    console.log(`[FETCH DEBUGGER] Requesting: ${url}`);
    try {
      const response = await originalFetch(...args);
      if (!response.ok) {
        console.error(`[FETCH DEBUGGER] Failed response for: ${url}`, response);
      }
      return response;
    } catch (error) {
      console.error(`[FETCH DEBUGGER] Network error for: ${url}`, error);
      throw error;
    }
  };
}
