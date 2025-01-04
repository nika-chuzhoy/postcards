/**
  Name: Nika Chuzhoy
  CS 132 Spring 2024
  Date: June 13, 2024
  JS to control cart page of ecommerce website.
*/
(function() {
    "use strict";
  
    // Populate cart
    function init() {
       populateSummary();
       populateCardView();
    }

    const SIZES = {"small": "4.25\"x6\"", "large": "9\"x12\""};
    const BASE_URL = "/";
    const CARD_EP = BASE_URL + "card";

     /**
     * Shows a summary in all items in cart, retrieved from LocalStorage.
     * Shows quantity, and size requested for each item.
     * Displays total price of all items.
     */
    function populateSummary() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const summary = id("items");
        summary.innerHTML = "";
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemElement = gen("div");
            itemElement.classList.add("item");

            const name = gen("span");
            name.classList.add("item-name");
            const size = gen("span");
            size.classList.add("item-size");
            const quant = gen("span");
            quant.classList.add("item-quantity");
            const price = gen("span");
            price.classList.add("item-price");

            name.textContent = item.name;
            size.textContent = SIZES[item.size];
            quant.textContent = `Quantity: ${item.quantity}`;
            price.textContent = `$${item.price}.00`;

            itemElement.appendChild(name);
            itemElement.appendChild(size);
            itemElement.appendChild(quant);
            itemElement.appendChild(price);

            summary.appendChild(itemElement);
            totalPrice += item.price;
        });
        
        if(cart.length === 0) {
            const p = gen("div");
            p.textContent = "Nothing in cart.";
            summary.appendChild(p);
        }

        const priceSection = id("total");
        priceSection.textContent = `Total: $${totalPrice}.00`;
    }

     /**
     * Shows all the cards in cart, with images.
     */
    function populateCardView() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const prodSection = id("display-cards");
        prodSection.innerHTML = "";

        cart.forEach(item => {
            fetchCardInfo(item.id).then(cardInfo => {
                if (cardInfo) {
                    const newCard = genPostcard(cardInfo, item.size, item.quantity);
                    prodSection.appendChild(newCard);
                }
            });
        });
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
            handleError(id("display-cards"));
        }
    }

     /**
     * Removes an item from the cart.
     * Updates both display and LocalStorage.
     * @param {String} cardID - the UID of the card
     * @param {String} itemQuantity - the quantity in cart
     * @param {String} itemSize - the size of the card in cart
     */
    function removeItem(cardID, itemQuantity, itemSize) {
        const items = JSON.parse(localStorage.getItem('cart'));
        // Femove first item matching description
        const indexToRemove = 
            items.findIndex(
                item => (item.id == cardID && item.quantity == itemQuantity) && item.size === itemSize
            );
        if (indexToRemove !== -1) {
            items.splice(indexToRemove, 1);
        }
    
        localStorage.setItem('cart', JSON.stringify(items));
        populateSummary();
        populateCardView();
    }

    /**
     * Creates a postcard element. Includes element that enables 
     * card deletion from card.
     * @param {Object} cardInfo - information about the postcard
     * @returns {Element} constructed card
     */
    function genPostcard(cardInfo, size, quantity) {
        const card = gen("div");
        card.classList.add("card");
        card.id = cardInfo.id;

        const remove = gen("div");
        remove.classList.add("delete");
        remove.textContent = '-Remove-';
        card.appendChild(remove);
        remove.addEventListener("click", () => removeItem(cardInfo.id, quantity, size));

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
        newTag.textContent = SIZES[size];
        purchase.appendChild(newTag);

        const quantSection = gen("div");
        quantSection.classList.add("quantity");
        quantSection.textContent = "| Quantity: " + quantity;
        purchase.appendChild(quantSection);

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