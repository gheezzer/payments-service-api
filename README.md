# Payments Service API

This API aims to receive a typeable line of bank slip or payment from concessionaires and return if it is valid. In case it is valid and has a value and/or expiration date, return the data together with a barcode

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

To consult the bank slip data, go to:

Exemplo de resquest:

`GET/ http://localhost:8080/boleto/00190500954014481606906809350314337370000000100`

Exemplo de response:

status 200

`{
  "barCode": "00193373700000001000500940144816060680935031",
  "amount": "10,000",
  "expirationDate": "31/12/2007"
}`

[GET - Slip Bank](http://localhost:3000/boleto/00190500954014481606906809350314337370000000100)

---

