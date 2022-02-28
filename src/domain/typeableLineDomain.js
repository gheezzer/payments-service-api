import BadRequestError from '../errors/bad-request';
class typeableLineDomain {
  getBankSlipData(typeableLine) {
    const recipientFinancialInstitutionCode = typeableLine.slice(0, 3).join('');
    const currencyCode = typeableLine.slice(3, 4).join('');
    const firstBlockOfBarcode = typeableLine.slice(4, 9).join('');
    const digitCheckerField_1 = typeableLine.slice(9, 10).join('');
    const secondBlockOfBarcode = typeableLine.slice(10, 20).join('');
    const digitCheckerField_2 = typeableLine.slice(20, 21).join('');
    const thirdBlockOfBarcode = typeableLine.slice(21, 31).join('');
    const digitCheckerField_3 = typeableLine.slice(31, 32).join('');
    const barcodeCheckeDigit = typeableLine.slice(32, 33).join('');
    const expirationFactor = typeableLine.slice(33, 37).join('');
    const paymentSlipValue = typeableLine.slice(37).join('');

    return {
      recipientFinancialInstitutionCode,
      currencyCode,
      firstBlockOfBarcode,
      digitCheckerField_1,
      secondBlockOfBarcode,
      digitCheckerField_2,
      thirdBlockOfBarcode,
      digitCheckerField_3,
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
    const multiplierNumber_1 = 1;
    const multiplierNumber_2 = 2;
    return barCodeBlocks.map(block => {
      return block.split('').map(number => {
        if (control) {
          control = false;
          return this.multipliedNumbers(number, multiplierNumber_2);
        } else {
          control = true;
          return this.multipliedNumbers(number, multiplierNumber_1);
        }
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

  validateTypeAbleLineDigits(bankSlipData) {
    const {
      recipientFinancialInstitutionCode,
      currencyCode,
      firstBlockOfBarcode,
      digitCheckerField_1,
      secondBlockOfBarcode,
      digitCheckerField_2,
      thirdBlockOfBarcode,
      digitCheckerField_3,
    } = bankSlipData;

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

    const digitCheckerField_1_2_3 = parseInt(
      [
        digitCheckerField_1,
        ...digitCheckerField_2,
        ...digitCheckerField_3,
      ].join(''),
      10,
    );

    const digitsChecked = parseInt(checkDigits.join(''), 10);

    return digitCheckerField_1_2_3 === digitsChecked ? true : false;
  }

  validateBarcodeDigit(bankSlipData) {
    const {
      recipientFinancialInstitutionCode,
      currencyCode,
      expirationFactor,
      paymentSlipValue,
      firstBlockOfBarcode,
      secondBlockOfBarcode,
      thirdBlockOfBarcode,
      barcodeCheckeDigit,
    } = bankSlipData;

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
      parseInt(remainingValueWithCalculation) + 1;

    let verifyingDigit =
      numberReferenceForCalculation - calculationRoundedUpAfterPoint;

    const exceptions = [0, 10, 11];

    if (exceptions.includes(verifyingDigit)) {
      verifyingDigit = 1;
    }
    return parseInt(barcodeCheckeDigit, 10) === verifyingDigit ? true : false;
  }

  getExpiryData({ expirationFactor }) {
    const dataBase = '10-07-1997';
    const date = new Date(dataBase);
    const day = date.getDate();
    date.setDate(day + parseInt(expirationFactor, 10));
    const formattedDate = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    return formattedDate;
  }

  BankSlip(typeableLine) {
    const bankSlipData = this.getBankSlipData(typeableLine);
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
        amount: 'paymentSlipValue',
        expirationDate: expiryData,
      };
    }

    throw new BadRequestError(
      'Invalid line value entered, check digits do not match',
    );
  }
}

export default new typeableLineDomain();
