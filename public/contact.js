/**
  Name: Nika Chuzhoy
  CS 132 Spring 2024
  Date: June 13, 2024
  JS to control cintact page of ecommerce website.
*/

(function() {
    "use strict";
  
    const BASE_URL = "/";
    const CONTACT_EP = BASE_URL + "contact";
  
    // Initialize event listeners
    function init() {
        id("contact-form").addEventListener("submit", (event) => {
            event.preventDefault();
            submitFeedback();
        });
    }

    /**
     * Sends feedback to backend
     */
    function submitFeedback() {
        let feedback = new FormData(id("contact-form"));
        
        fetch(CONTACT_EP, {
            method: 'POST',
            body: feedback
        })
        .then(checkStatus)
        .then(response => response.text())
        .then(text => handleResponse(text))
        .catch(handleError);
    }

    /**
     * Updates the page to display success message
     */
    function handleResponse(response) {
        const responseDisplay = id("feedback-response");
        responseDisplay.textContent = response;
        id("contact-form").classList.add("hidden");
        responseDisplay.classList.remove("hidden");
    }

    /**
     * Updates the page to display generic failure message
     */
    function handleError() {
        const responseDisplay = id("feedback-response");
        responseDisplay.textContent = 
        "Oh no! Something has gone wrong on our end. Please refresh or try again later.";
        id("contact-form").classList.add("hidden");
        responseDisplay.classList.remove("hidden");
    }
  
    init();
  
})();