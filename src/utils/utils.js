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

  getSumOfNumbersModule10(digits) {
    let control = true;
    let sumOfDigits = 0;
    const multiplierNumberOne = 1;
    const multiplierNumberTwo = 2;

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
    return sumOfDigits;
  }

  getSumOfNumbersModule11(digits) {
    let control = 2;
    let sumOfDigits = 0;

    for (let i = digits.length - 1; i >= 0; i--) {
      if (control < 9) {
        sumOfDigits += digits[i] * control;
        control++;
      } else {
        sumOfDigits += digits[i] * control;
        control = 2;
      }
    }

    return sumOfDigits;
  }
}

export default new CheckDigits();
