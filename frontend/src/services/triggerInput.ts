  // triggers an input event on the first textarea of the element
  // used to trigger inputs on delete (e.g., for courseSchedule)
  export const triggerInput = () => {
    const textarea = document.querySelector('textarea');


    // Create and dispatch an input event
    if (textarea) {
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }
  }