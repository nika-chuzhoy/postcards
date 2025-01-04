# Nika Chuzhoy API Documentation
*This API provides functionality to maintain an ecommerce website selling postcards. It provides information on available products and manages feedback.*

Summary of endpoints:
* GET /cards
* GET /cards/:country
* GET /card/:id
* GET /faq
* POST /contact

## *GET/cards*

**Returned Data Format**: JSON

**Description:** *Returns a JSON containing all cards stored in the database sorted country-first. Each card contains information including title, author, source, year, UID, and image link.*

**Supported Parameters** 
* None

**Example Request:** `cards`

**Example Response:**
``` json
{
  "Australia": [
    {
      "id": "6ec80146-af4f-421d-8a93-042911fa8d68",
      "title": "'Over the Top' near Katoomba",
      "url": "https://upload.wikimedia.org/wikipedia/commons/2/2c/%27Over_the_Top%27_near_Katoomba.jpg",
      "year": "1940",
      "artist": "W. H. Green (Wally)",
      "credit": "Wikimedia"
    },
  ],
  "Belgium": [
    {
      "id": "deca1bf0-961e-47d2-99a0-68ec5cfccdeb",
      "title": "Achterkant Belgische briefkaart zonder boodschapruimte",
      "url": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Achterkant_Belgische_briefkaart_zonder_boodschapruimte.jpg",
      "year": "2022",
      "artist": "Unknown Author",
      "credit": "Backside Belgian postcard"
    }
  ]
}

```
**Error Handling:**
* 500: Internal Server Error

## *GET/cards/:country*

**Returned Data Format**: JSON

**Description:** *Returns a JSON containing all cards matching the couontry. Each card contains information including title, author, source, year, UID, and image link.*

**Supported Parameters** 
* /:country (required)
  * The requested country.

**Example Request:** `cards/Australia`

**Example Response:**
``` json
[
  {
    "id": "6ec80146-af4f-421d-8a93-042911fa8d68",
    "title": "'Over the Top' near Katoomba",
    "url": "https://upload.wikimedia.org/wikipedia/commons/2/2c/%27Over_the_Top%27_near_Katoomba.jpg",
    "year": "1940",
    "artist": "W. H. Green (Wally)",
    "credit": "Wikimedia"
  },
  {
    "id": "ce6318a3-80f4-441a-8a45-649048710e86",
    "title": "'Well Done Australia' postcard",
    "url": "https://upload.wikimedia.org/wikipedia/commons/c/c3/%27Well_Done_Australia%27_postcard.jpg",
    "year": "1918",
    "artist": "Unknown Author",
    "credit": "Wikimedia"
  }
]
```

**Error Handling:**
* 404: Not found if given a country that does not currently exist in the dataset.
* 500: Internal Server Error


## *GET/card/:id*

**Returned Data Format**: JSON

**Description:** *Returns a JSON containing the card matching the UID. Contains information including title, author, source, year, and image link.*

**Supported Parameters** 
* /:id (required)
  * The requested UID.

**Example Request:** `card/ce6318a3-80f4-441a-8a45-649048710e86`

**Example Response:**
``` json
{
  "id": "ce6318a3-80f4-441a-8a45-649048710e86",
  "title": "'Well Done Australia' postcard",
  "url": "https://upload.wikimedia.org/wikipedia/commons/c/c3/%27Well_Done_Australia%27_postcard.jpg",
  "year": "1918",
  "artist": "Unknown Author",
  "credit": "Wikimedia"
}
```

**Error Handling:**
* 404: Not found if given a UID that does not currently exist in the dataset.
* 500: Internal Server Error


## *GET/faq*

**Returned Data Format**: JSON

**Description:** *Returns a JSON containing all frequently asked questions.*

**Supported Parameters** 
* None

**Example Request:** `faq`

**Example Response:**
``` json
[
  {
    "question": "How long does shipping take?",
    "answer": "Shipping takes 5-7 business days."
  },
  {
    "question": "Do you ship internationally?",
    "answer": "Yes, we ship everywhere."
  }
]
```

**Error Handling:**
* 500: Internal Server Error



## *POST/contact*

**Returned Data Format**: Plain Text

**Description:** *Updates database with new feedback message, including source email, whether a response is acceptable, timestamp, and message. Sends response indicating whether update was successful.*

**Supported Parameters** 
* POST body parameters: 
  * `email` (required) - email of customer
  * `responseOK` (required) - whether customer is willing to be contacted
  * `message` (required) - feedback message

**Example Request:** `contact`
* POST body parameters: 
  * `email` = 'testy@mctestface.com'
  * `responseOK` = 'No'
  * `message` = 'I love your postcards'

**Example Response:**
``` "Thank you for your feedback! ```

**Error Handling:**
* 400: Bad Request - missing email, contactOK, or message
* 500: Internal Server Error