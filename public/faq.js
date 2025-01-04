/**
  Name: Nika Chuzhoy
  CS 132 Spring 2024
  Date: June 13, 2024
  JS to control FAQ page of ecommerce website.
*/

(function() {
    "use strict";
  
    const BASE_URL = "/";
    const FAQ_EP = BASE_URL + "faq";
  
    // Initialize FAQ display
    function init() {
        displayFAQ()
    }

    /**
     * Fetch FAQs from backend
     * Display error if none found
     */
    async function fetchFAQ() {
        try {
            let resp = await fetch(FAQ_EP);
            resp = checkStatus(resp);
            return await resp.json();
        } 
        catch (error) {
            handleError(id("faq-container"));
        }
    }

    /**
     * Displays the FAQs on page
     */
    function displayFAQ() {
        fetchFAQ().then(faq => {
            if (!faq) {return;}
            const container = id("faq-container");
            container.innerHTML = '';
        
            faq.forEach(faq => {
                const faqElement = gen("section");
                faqElement.classList.add("faq");

                const question = gen("p");
                question.id = "question";
                question.textContent = faq.question;
                faqElement.appendChild(question);

                const answer = gen("p");
                answer.textContent = faq.answer;
                faqElement.appendChild(answer);

                container.appendChild(faqElement);
            });
        })
    }

    /**
     * Displays a generic error message
     * @param {Element} errDisplay - where to display the message
     */
    function handleError(errDisplay) {
        const errMsg = gen("p");
        errMsg.textContent = 
        "Oh no! Something has gone wrong on our end. Please refresh or try again later.";
        errDisplay.appendChild(errMsg);
    }

    init();
  
})();