import BadRequestError from '../errors/bad-request';
import typeableLineDomain from '../domain/typeableLineDomain';

export default class TypeableLineController {
  async getBankSlipDataAndPaymentOfConcessionaires(req, res, next) {
    try {
      const numberOfBankSlipDigits = 47;
      const { digits } = req.params;
      const regex = /\d/g;
      const arrayOfTypeableLineDigits = digits.match(regex);
      const numberOfTypeableLineDigits = arrayOfTypeableLineDigits.length;

      if (
        numberOfTypeableLineDigits === numberOfBankSlipDigits ||
        numberOfTypeableLineDigits === numberOfBankSlipDigits + 1
      ) {
        const slipData = typeableLineDomain.BankSlip(arrayOfTypeableLineDigits);
        res.send(slipData);
      } else {
        throw new BadRequestError(
          'Invalid line value entered, only numbers are accepted',
        );
      }
    } catch (error) {
      next(error);
    }
  }
}
