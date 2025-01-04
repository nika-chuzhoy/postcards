/**
  Name: Nika Chuzhoy
  CS 132 Spring 2024
  Date: June 13, 2024
  JS to control main page of ecommerce website.
*/
(function() {
    "use strict";

    const BASE_URL = "/";
    const CARDS_EP = BASE_URL + "cards";
    const CARD_EP = BASE_URL + "card";
    const SMALL_PRICE = 1;
    const LARGE_PRICE = 2;

    // Init function to initialize event listeners and main page
    async function init() {
        qsa(".card").forEach(card => card.addEventListener("click", function(event) {showPopup(event);}));
        id("exit").addEventListener("click", hidePopup);
        id("quantity").addEventListener("change", setPrice);
        id("size-1").addEventListener("change", setPrice);
        id("size-2").addEventListener("change", setPrice);
        document.getElementById("order-form").addEventListener("submit",  function(event) {
            event.preventDefault();
            addToCart();
        });

        const categorySelect = id("country-filter");
        categorySelect.addEventListener("change", () => {populatePostcards(categorySelect.value)});
        populatePostcards(categorySelect.value);
    }

    /**
     * Updates the price display given the user's customizations. 
     * @returns {Integer} priceVal - the calculated price.
     */
    function setPrice() {
        const quant = id("quantity").value;
        const price = id("total-price");
        let priceVal;
        if (id("size-1").checked) {
            priceVal = quant * SMALL_PRICE;
            price.textContent = `$${priceVal}.00`
        }
        else {
            priceVal = quant * LARGE_PRICE;
            price.textContent = `$${priceVal}.00`
        }
        return priceVal;
    }

    /**
     * Shows the single-view mode for a product.
     * @param {String} cardID - the UID of the card.
     */
    function showPopup(cardID) {
        const popup = id("card-popup");
        if (!popup.classList.contains("hidden")) {return;}
        const cardContainer = id("card-container");
        fetchCardInfo(cardID).then(cardData => {
            cardContainer.appendChild(genPostcard(cardData));
        });
        popup.classList.remove("hidden");
    }

     /**
     * Hides the single-view mode for a product.
     */
    function hidePopup() {
        const cardContainer = id("card-container");
        const card = cardContainer.querySelector(".card");
        cardContainer.removeChild(card);
        id("card-popup").classList.add("hidden");
    }

     /**
     * Adds an item to cart (localStorage).
     * Includes selected size and quantity.
     */
    function addToCart() {
        const quantity = id("quantity").value;
        const card =  id("card-container").querySelector("div.card");
        const title = card.querySelector("h3").textContent;
        let selectedSize;

        if (id("size-1").checked) {
            selectedSize = "small";
        }
        else {
            selectedSize = "large";
        }
      
        const item = {
            id: card.id,
            name: title,
            quantity: quantity,
            size: selectedSize,
            price: setPrice(),
        };
      
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
      
        alert("Added to cart!");
    }

     /**
     * Retrieves all postcards from a given country.
     * Displays an error if none are available.
     * @param {String} country - the country to get cards from
     * @returns {JSON} information about all cards matching country
     */
    async function fetchPostcards(country) {
        const url = CARDS_EP + "/" + country;
        try {
            let resp = await fetch(url);
            resp = checkStatus(resp);
            return await resp.json();
        }
        catch (err) {
            handleError(id("product-cards"));
        }
    }

     /**
     * Retrieves the posctcard matching a UID,
     * @param {String} cardID - the UID of the card
     * @returns {JSON} information about the card 
     */
    async function fetchCardInfo(uid) {
        try {
            let resp = await fetch(CARD_EP + "/" + uid);
            resp = checkStatus(resp);
            return await resp.json();
        }
        catch (err) {
            handleError(id("card-container"));
        }
    }

    /**
     * Displays all postcards for current selected country on main page.
     * @param {String} country - country to populate cards for
     */
    function populatePostcards(country) {
        fetchPostcards(country).then(cardData => {
            if (cardData) {
                const prodSection = id("product-cards");
                prodSection.innerHTML = "";
                cardData.forEach(cardInfo => {
                    const newCard = genPostcard(cardInfo);
                    prodSection.appendChild(newCard);
                    newCard.addEventListener("click", () => {showPopup(cardInfo.id)});
            });
            }
        });
    }

    /**
     * Creates a postcard element
     * @param {Object} cardInfo - information about the postcard
     * @returns {Element} constructed card
     */
    function genPostcard(cardInfo) {
        const card = gen("div");
        card.classList.add("card");
        card.id = cardInfo.id;

        const img = gen("img");
        img.src = cardInfo.url;
        img.alt = cardInfo.title;
        card.appendChild(img);

        const title = gen("h3");
        title.textContent = cardInfo.title;
        card.appendChild(title);

        const date = gen("div");
        date.classList.add("date");
        date.textContent = cardInfo.year;
        card.appendChild(date);

        const author = gen("p");
        author.textContent = "Author: " + cardInfo.artist;
        card.appendChild(author);

        const credit = gen("p");
        credit.textContent = "Source: " + cardInfo.credit;
        card.appendChild(credit);

        const purchase = gen("section");
        purchase.classList.add("purchase-info");
        card.appendChild(purchase);

        const newTag = gen("div");
        newTag.classList.add("new");
        newTag.textContent = "New!";
        purchase.appendChild(newTag);

        const quant = gen("div");
        quant.classList.add("quantity");
        quant.textContent = "| In Stock";
        purchase.appendChild(quant);

        return card;
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