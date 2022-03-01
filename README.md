# Payments Service API

This API aims to receive a typeable line of bank slip or payment from concessionaires and return if it is valid or not. If valid and has value and/or expiration date, return the data along with a barcode.

---

### Run

To start the project run:

npm install

npm start

---

### Check local status of API

With the local server running, just access:

[Localhost status check](http://localhost:3000/v1)

---

### View local API documentation

With the local server running, just access:

[Localhost DOCS - Swagger](http://localhost:3000/swagger/)

---

### Service

Example of a bank slip request:

`GET/ http://localhost:8080/boleto/00190500954014481606906809350314337370000000100`

Response:

status 200

`{ "barCode": "00193373700000001000500940144816060680935031", "amount": "1.00", "expirationDate": "31/12/2007" }`

[GET - Slip Bank](http://localhost:3000/boleto/00190500954014481606906809350314337370000000100)

---

Example of a request for a dealership payment slip:

`GET/ http://localhost:3000/v1/boleto/846700000017435900240209024050002435842210108119`

Response:

status 200

`{ "barCode": "84670000001435900240200240500024384221010811", "amount": "143.59", "expirationDate": "" }`

[GET - Dealership](http://localhost:3000/v1/boleto/846700000017435900240209024050002435842210108119)

---
