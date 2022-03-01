import utils from '../utils/utils';
import BadRequestError from '../errors/bad-request';

class DealershipDomain {
  getDealershipData(digits) {
    const productIdentification = digits.slice(0, 1).join('');
    const segmentIdentification = digits.slice(1, 2).join('');
    const identificationOfActualValueOrReference = digits.slice(2, 3).join('');
    const generalCheckDigit = digits.slice(3, 4).join('');
    const firstBlock = digits.slice(4, 11).join('');
    const checkDigitOfFirst = digits.slice(11, 12).join('');
    const secondBlock = digits.slice(12, 23).join('');
    const checkDigitOfSecond = digits.slice(23, 24).join('');
    const thirdBlock = digits.slice(24, 35).join('');
    const checkDigitOfThird = digits.slice(35, 36).join('');
    const fourthBlock = digits.slice(36, 47).join('');
    const checkDigitOfFourth = digits.slice(47).join('');

    return {
      productIdentification,
      segmentIdentification,
      identificationOfActualValueOrReference,
      generalCheckDigit,
      firstBlock,
      checkDigitOfFirst,
      secondBlock,
      checkDigitOfSecond,
      thirdBlock,
      checkDigitOfThird,
      fourthBlock,
      checkDigitOfFourth,
    };
  }

  dealershipModule10(digits) {
    let control = true;
    const multiplierNumberOne = 1;
    const multiplierNumberTwo = 2;
    let sumOfDigits = 0;
    const numberReference = 10;
    const baseDecimal = 10;

    for (let i = digits.length - 1; i >= 0; i--) {
      if (control) {
        sumOfDigits += utils.getMultipliedNumbers(
          digits[i],
          multiplierNumberTwo,
        );
        control = false;
      } else {
        sumOfDigits += utils.getMultipliedNumbers(
          digits[i],
          multiplierNumberOne,
        );
        control = true;
      }
    }

    const divisionValue = sumOfDigits / numberReference;

    const remainderOfDivision = parseInt(
      divisionValue.toString().split('.')[1],
      baseDecimal,
    );

    if (remainderOfDivision !== 0) {
      return numberReference - remainderOfDivision;
    }
    return remainderOfDivision;
  }

  dealershipModule11(digits) {
    let control = 2;
    let sumOfDigits = 0;
    const numberReference = 11;

    for (let i = digits.length - 1; i >= 0; i--) {
      if (control < 9) {
        sumOfDigits += digits[i] * control;
        control++;
      } else {
        sumOfDigits += digits[i] * control;
        control = 2;
      }
    }

    const remainingValue = (sumOfDigits / numberReference)
      .toFixed(1)
      .toString()
      .split('.')[1];

    let verifyingDigit = remainingValue - numberReference;

    const ruleOne = [0, 1];

    if (ruleOne.includes(verifyingDigit)) {
      verifyingDigit = 0;
    }

    const ruleOTwo = [10];

    if (ruleOTwo.includes(verifyingDigit)) {
      verifyingDigit = 1;
    }
  }

  dealershipGeneralModule11(digits) {
    let control = 2;
    let sumOfDigits = 0;
    const numberReference = 11;

    for (let i = digits.length - 1; i >= 0; i--) {
      if (control < 9) {
        sumOfDigits += digits[i] * control;
        control++;
      } else {
        sumOfDigits += digits[i] * control;
        control = 2;
      }
    }

    const remainderOfDivision = (sumOfDigits / numberReference)
      .toFixed(1)
      .toString()
      .split('.')[1];

    let remainingValue = parseInt(remainderOfDivision, 10);

    const ruleOne = [0, 1];

    if (ruleOne.includes(remainingValue)) {
      remainingValue = 0;
    }

    const ruleOTwo = [10];

    if (ruleOTwo.includes(remainingValue)) {
      remainingValue = 1;
    }
    return remainingValue;
  }

  getValue(digits) {
    const firstPartOfTheValue = digits.slice(5, 11).join('');
    const fsecondPartOfTheValue = digits.slice(12, 16).join('');
    const value = firstPartOfTheValue + fsecondPartOfTheValue;
    return (value / 100).toString();
  }

  valdateFourthPositionCheckerDigit({
    productIdentification,
    segmentIdentification,
    identificationOfActualValueOrReference,
    generalCheckDigit,
    firstBlock,
    secondBlock,
    thirdBlock,
    fourthBlock,
  }) {
    if (
      parseInt(identificationOfActualValueOrReference, 10) === 6 ||
      parseInt(identificationOfActualValueOrReference, 10) === 7
    ) {
      const fourthPositionCheckerDigit = this.dealershipModule10(
        [
          productIdentification,
          ...segmentIdentification,
          ...identificationOfActualValueOrReference,
          ...firstBlock,
          ...secondBlock,
          ...thirdBlock,
          ...fourthBlock,
        ].join(''),
      );
      return parseInt(generalCheckDigit, 10) === fourthPositionCheckerDigit;
    }
    if (
      parseInt(identificationOfActualValueOrReference, 10) === 8 ||
      parseInt(identificationOfActualValueOrReference, 10) === 9
    ) {
      const fourthPositionCheckerDigit = this.dealershipGeneralModule11(
        [
          productIdentification,
          ...segmentIdentification,
          ...identificationOfActualValueOrReference,
          ...firstBlock,
          ...secondBlock,
          ...thirdBlock,
          ...fourthBlock,
        ].join(''),
      );
      return parseInt(generalCheckDigit, 10) === fourthPositionCheckerDigit;
    }
    return false;
  }

  validateTheBlocks(block, verifyingDigit) {
    const checkerDigit = this.dealershipModule10(block);
    return parseInt(verifyingDigit, 10) === checkerDigit;
  }

  dealership(digits) {
    const dealershipData = this.getDealershipData(digits);
    const slipValue = this.getValue(digits);

    const {
      productIdentification,
      segmentIdentification,
      identificationOfActualValueOrReference,
      generalCheckDigit,
      firstBlock,
      secondBlock,
      checkDigitOfSecond,
      thirdBlock,
      checkDigitOfThird,
      fourthBlock,
      checkDigitOfFourth,
    } = dealershipData;

    if (
      (this.valdateFourthPositionCheckerDigit(dealershipData),
      this.validateTheBlocks(secondBlock, checkDigitOfSecond),
      this.validateTheBlocks(thirdBlock, checkDigitOfThird),
      this.validateTheBlocks(fourthBlock, checkDigitOfFourth))
    ) {
      return {
        barCode: [
          productIdentification,
          ...segmentIdentification,
          ...identificationOfActualValueOrReference,
          ...generalCheckDigit,
          ...firstBlock,
          ...secondBlock,
          ...thirdBlock,
          ...fourthBlock,
        ].join(''),
        amount: slipValue,
        expirationDate: '',
      };
    }
    throw new BadRequestError('Invalid line value entered');
  }
}

export default new DealershipDomain();
