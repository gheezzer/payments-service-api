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
      const fourthPositionCheckerDigit = utils.module10(
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
      const fourthPositionCheckerDigit = utils.generalModule11(
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
    const checkerDigit = utils.module10(block);
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
