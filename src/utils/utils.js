class CheckDigits {
  getMultipliedNumbers(number, multiplierNumber) {
    let result = number * multiplierNumber;
    if (result > 9) {
      const arrayOfResult = result.toString().split('');
      result = parseInt(arrayOfResult[0], 10) + parseInt(arrayOfResult[1], 10);
      return result;
    }
    return result;
  }

  module10(digits) {
    let control = true;
    const multiplierNumberOne = 1;
    const multiplierNumberTwo = 2;
    let sumOfDigits = 0;
    const numberReference = 10;
    const baseDecimal = 10;

    for (let i = digits.length - 1; i >= 0; i--) {
      if (control) {
        sumOfDigits += this.getMultipliedNumbers(
          digits[i],
          multiplierNumberTwo,
        );
        control = false;
      } else {
        sumOfDigits += this.getMultipliedNumbers(
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

  module11(digits) {
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

  generalModule11(digits) {
    let control = 2;
    let sumOfDigits = 0;
    const numberReference = 11;

    for (let i = digits.length - 1; i >= 0; i--) {
      // quarta posição do Código de Barras
      // 43 digitos

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
}

export default new CheckDigits();
