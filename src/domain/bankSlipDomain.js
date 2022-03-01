import utils from '../utils/utils';
import BadRequestError from '../errors/bad-request';

class BankSlipDomain {
  getBankSlipData(digits) {
    const recipientFinancialInstitutionCode = digits.slice(0, 3).join('');
    const currencyCode = digits.slice(3, 4).join('');
    const firstBlock = digits.slice(4, 9).join('');
    const digitCheckerFieldOne = digits.slice(9, 10).join('');
    const secondBlock = digits.slice(10, 20).join('');
    const digitCheckerFieldTwo = digits.slice(20, 21).join('');
    const thirdBlock = digits.slice(21, 31).join('');
    const digitCheckerFieldThree = digits.slice(31, 32).join('');
    const barcodeCheckeDigit = digits.slice(32, 33).join('');
    const expirationFactor = digits.slice(33, 37).join('');
    const paymentSlipValue = digits.slice(37).join('');

    return {
      recipientFinancialInstitutionCode,
      currencyCode,
      firstBlock,
      digitCheckerFieldOne,
      secondBlock,
      digitCheckerFieldTwo,
      thirdBlock,
      digitCheckerFieldThree,
      barcodeCheckeDigit,
      expirationFactor,
      paymentSlipValue,
    };
  }

  bankSlipModule10(digits) {
    const {
      recipientFinancialInstitutionCode,
      currencyCode,
      firstBlock,
      secondBlock,
      thirdBlock,
    } = digits;

    const newFirstBlock = [
      recipientFinancialInstitutionCode,
      ...currencyCode,
      ...firstBlock,
    ].join('');

    const blocks = [newFirstBlock, secondBlock, thirdBlock];
    const numberReference = 10;
    const baseDecimal = 10;

    return blocks.map(block => {
      const value = utils.getSumOfNumbers(block);
      const dividedValue = value / numberReference;

      const remainderOfDivision = parseInt(
        dividedValue.toString().split('.')[1],
        baseDecimal,
      );

      if (remainderOfDivision !== 0) {
        return numberReference - remainderOfDivision;
      }
      return remainderOfDivision;
    });
  }

  bankSlipModule11({
    recipientFinancialInstitutionCode,
    currencyCode,
    expirationFactor,
    paymentSlipValue,
    firstBlock,
    secondBlock,
    thirdBlock,
    barcodeCheckeDigit,
  }) {
    const barCodeDigits = [
      recipientFinancialInstitutionCode,
      ...currencyCode,
      ...expirationFactor,
      ...paymentSlipValue,
      ...firstBlock,
      ...secondBlock,
      ...thirdBlock,
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

  getExpiryData(expirationFactor) {
    const { DATABASE } = process.env;
    const date = new Date(DATABASE);
    const day = date.getDate();
    date.setDate(day + parseInt(expirationFactor, 10));
    const formattedDate = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    return formattedDate;
  }

  bankSlip(digits) {
    const bankSlipData = this.getBankSlipData(digits);
    const {
      recipientFinancialInstitutionCode,
      currencyCode,
      firstBlock,
      digitCheckerFieldOne,
      secondBlock,
      digitCheckerFieldTwo,
      thirdBlock,
      digitCheckerFieldThree,
      barcodeCheckeDigit,
      expirationFactor,
      paymentSlipValue,
    } = bankSlipData;

    const checkedDigits = this.bankSlipModule10(bankSlipData);
    const digitsTocheck = [
      digitCheckerFieldOne,
      digitCheckerFieldTwo,
      digitCheckerFieldThree,
    ];
    const expiryData = this.getExpiryData(expirationFactor);
    if (
      parseInt(digitsTocheck.join(''), 10) ===
        parseInt(checkedDigits.join(''), 10) &&
      this.bankSlipModule11(bankSlipData)
    ) {
      return {
        barCode: [
          recipientFinancialInstitutionCode,
          ...currencyCode,
          ...barcodeCheckeDigit,
          ...expirationFactor,
          ...paymentSlipValue,
          ...firstBlock,
          ...secondBlock,
          ...thirdBlock,
        ].join(''),
        amount: (paymentSlipValue / 100).toFixed(2),
        expirationDate: expiryData,
      };
    }

    throw new BadRequestError(
      'Invalid line value entered, check digits do not match',
    );
  }
}

export default new BankSlipDomain();
