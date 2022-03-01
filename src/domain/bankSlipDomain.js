import BadRequestError from '../errors/bad-request';

class BankSlipDomain {
  getBankSlipData(digits) {
    const recipientFinancialInstitutionCode = digits.slice(0, 3).join('');
    const currencyCode = digits.slice(3, 4).join('');
    const firstBlockOfBarcode = digits.slice(4, 9).join('');
    const digitCheckerFieldOne = digits.slice(9, 10).join('');
    const secondBlockOfBarcode = digits.slice(10, 20).join('');
    const digitCheckerFieldTwo = digits.slice(20, 21).join('');
    const thirdBlockOfBarcode = digits.slice(21, 31).join('');
    const digitCheckerFieldThree = digits.slice(31, 32).join('');
    const barcodeCheckeDigit = digits.slice(32, 33).join('');
    const expirationFactor = digits.slice(33, 37).join('');
    const paymentSlipValue = digits.slice(37).join('');

    return {
      recipientFinancialInstitutionCode,
      currencyCode,
      firstBlockOfBarcode,
      digitCheckerFieldOne,
      secondBlockOfBarcode,
      digitCheckerFieldTwo,
      thirdBlockOfBarcode,
      digitCheckerFieldThree,
      barcodeCheckeDigit,
      expirationFactor,
      paymentSlipValue,
    };
  }

  multipliedNumbers(number, multiplierNumber) {
    let result = number * multiplierNumber;
    if (result > 9) {
      const arrayOfResult = result.toString().split('');
      result = parseInt(arrayOfResult[0], 10) + parseInt(arrayOfResult[1], 10);
      return result;
    }
    return result;
  }

  getMultipliedNumbers(barCodeBlocks) {
    let control = true;
    const multiplierNumberOne = 1;
    const multiplierNumberTwo = 2;
    return barCodeBlocks.map(block => {
      return block.split('').map(number => {
        if (control) {
          control = false;
          return this.multipliedNumbers(number, multiplierNumberTwo);
        }
        control = true;
        return this.multipliedNumbers(number, multiplierNumberOne);
      });
    });
  }

  getBarcodeCheckDigits(multipliedNumbers) {
    const arrOfValues = multipliedNumbers.map(block => {
      const sum = block.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
      );
      return sum / 10;
    });

    return arrOfValues.map(value => {
      const floatingRemainderOfDivision = parseInt(
        value.toString().split('.')[1],
        10,
      );
      const immediatelyAfterTen = Math.round(value) * 10;

      const remainderOfSubtraction =
        immediatelyAfterTen - floatingRemainderOfDivision / 10;
      const result = parseInt(
        remainderOfSubtraction.toString().split('.')[1],
        10,
      );
      return result;
    });
  }

  validateTypeAbleLineDigits({
    recipientFinancialInstitutionCode,
    currencyCode,
    firstBlockOfBarcode,
    digitCheckerFieldOne,
    secondBlockOfBarcode,
    digitCheckerFieldTwo,
    thirdBlockOfBarcode,
    digitCheckerFieldThree,
  }) {
    const firstFieldOfTypeableLine = [
      recipientFinancialInstitutionCode,
      ...currencyCode,
      ...firstBlockOfBarcode,
    ].join('');

    const multipliedNumbers = this.getMultipliedNumbers([
      firstFieldOfTypeableLine,
      secondBlockOfBarcode,
      thirdBlockOfBarcode,
    ]);

    const checkDigits = this.getBarcodeCheckDigits(multipliedNumbers);

    const allDigitCheckerField = parseInt(
      [
        digitCheckerFieldOne,
        ...digitCheckerFieldTwo,
        ...digitCheckerFieldThree,
      ].join(''),
      10,
    );

    const digitsChecked = parseInt(checkDigits.join(''), 10);

    return allDigitCheckerField === digitsChecked;
  }

  validateBarcodeDigit({
    recipientFinancialInstitutionCode,
    currencyCode,
    expirationFactor,
    paymentSlipValue,
    firstBlockOfBarcode,
    secondBlockOfBarcode,
    thirdBlockOfBarcode,
    barcodeCheckeDigit,
  }) {
    const barCodeDigits = [
      recipientFinancialInstitutionCode,
      ...currencyCode,
      ...expirationFactor,
      ...paymentSlipValue,
      ...firstBlockOfBarcode,
      ...secondBlockOfBarcode,
      ...thirdBlockOfBarcode,
    ].join('');

    let control = 2;
    let sumOfDigits = 0;
    const numberReferenceForCalculation = 11;
    for (let i = barCodeDigits.length - 1; i >= 0; i--) {
      if (control < 9) {
        sumOfDigits += barCodeDigits[i] * control;
        control++;
      } else {
        sumOfDigits += barCodeDigits[i] * control;
        control = 2;
      }
    }
    const remainingValueWithCalculation = (
      sumOfDigits / numberReferenceForCalculation
    )
      .toFixed(1)
      .toString()
      .split('.')[1];
    const calculationRoundedUpAfterPoint =
      parseInt(remainingValueWithCalculation, 10) + 1;

    let verifyingDigit =
      numberReferenceForCalculation - calculationRoundedUpAfterPoint;

    const exceptions = [0, 10, 11];

    if (exceptions.includes(verifyingDigit)) {
      verifyingDigit = 1;
    }
    return parseInt(barcodeCheckeDigit, 10) === verifyingDigit;
  }

  getExpiryData({ expirationFactor }) {
    const { DATABASE } = process.env;
    const date = new Date(DATABASE);
    const day = date.getDate();
    date.setDate(day + parseInt(expirationFactor, 10));
    const formattedDate = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    return formattedDate;
  }

  bankSlip(digits) {
    const bankSlipData = this.getBankSlipData(digits);

    if (
      this.validateTypeAbleLineDigits(bankSlipData) &&
      this.validateBarcodeDigit(bankSlipData)
    ) {
      const {
        recipientFinancialInstitutionCode,
        currencyCode,
        firstBlockOfBarcode,
        secondBlockOfBarcode,
        thirdBlockOfBarcode,
        barcodeCheckeDigit,
        expirationFactor,
        paymentSlipValue,
      } = bankSlipData;
      const expiryData = this.getExpiryData(bankSlipData);

      return {
        barCode: [
          recipientFinancialInstitutionCode,
          ...currencyCode,
          ...barcodeCheckeDigit,
          ...expirationFactor,
          ...paymentSlipValue,
          ...firstBlockOfBarcode,
          ...secondBlockOfBarcode,
          ...thirdBlockOfBarcode,
        ].join(''),
        amount: (paymentSlipValue * 100).toLocaleString({
          style: 'currency',
          currency: 'BRL',
        }),
        expirationDate: expiryData,
      };
    }

    throw new BadRequestError(
      'Invalid line value entered, check digits do not match',
    );
  }
}

export default new BankSlipDomain();
