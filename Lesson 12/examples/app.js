/**
 * Lesson 12: DOM Manipulation & Events
 * External JavaScript file example.
 * 
 * You can link this file in your HTML like this:
 * <script src="app.js" defer></script>
 */

// WARNING: Making sure the DOM has loaded!
// Wrapping everything inside 'DOMContentLoaded' ensures the HTML elements
// actually exist before we try to select them. (Alternatively, just use <script defer>)

document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM fully loaded and parsed!");

    // 1. SELECTING ELEMENTS
    // ---------------------
    // Use document.querySelector to select the first matching element
    const mainHeading = document.querySelector('h1');
    
    // Use getElementById for ID selectors
    const btnAction = document.getElementById('my-action-btn');

    // 2. MODIFYING CONTENT & STYLES
    // -----------------------------
    if (mainHeading) {
        // Change text
        mainHeading.textContent = "Welcome to DOM Mastery!";
        
        // Change inline style
        mainHeading.style.color = "#34d399"; 
    }

    // 3. EVENT LISTENERS
    // ------------------
    if (btnAction) {
        btnAction.addEventListener('click', function(event) {
            
            // Log the event object
            console.log("Button clicked!", event);

            // Toggle a class on the body (useful for Dark Mode!)
            document.body.classList.toggle('dark-mode');
            
            // Check if class exists and update text
            if (document.body.classList.contains('dark-mode')) {
                btnAction.textContent = "Disable Dark Mode";
            } else {
                btnAction.textContent = "Enable Dark Mode";
            }
        });
    }

    // EXAMPLE: MOUSE EVENTS
    const productCard = document.querySelector('.card');
    if(productCard) {
        productCard.addEventListener('mouseenter', () => {
            productCard.style.boxShadow = "0 0 15px rgba(52,211,153, 0.5)";
        });

        productCard.addEventListener('mouseleave', () => {
            productCard.style.boxShadow = "none";
        });
    }

});
