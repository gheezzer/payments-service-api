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

  getSumOfNumbers(digits) {
    let control = true;
    const multiplierNumberOne = 1;
    const multiplierNumberTwo = 2;
    let sumOfDigits = 0;

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
}

export default new CheckDigits();
