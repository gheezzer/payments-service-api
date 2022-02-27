import BadRequestError from '../errors/bad-request';
import typeableLineDomain from '../domain/typeableLineDomain';

export default class TypeableLineController {
  async getBankSlipDataAndPaymentOfConcessionaires(req, res, next) {
    try {
      const numberOfBankSlipDigits = 47;
      const numberOfDealerPaymentsDigits = 44;
      const { digits } = req.params;
      const regex = /\d/g;
      const arrayOfTypeableLineDigits = digits.match(regex);
      const numberOfTypeableLineDigits = arrayOfTypeableLineDigits.length;

      if (numberOfTypeableLineDigits === numberOfBankSlipDigits) {
        const slipData = typeableLineDomain.BankSlip(arrayOfTypeableLineDigits);
        res.send(slipData);
      } else if (numberOfTypeableLineDigits === numberOfDealerPaymentsDigits) {
        res.send({
          type: 'Dealer Payments',
        });
      } else {
        throw new BadRequestError(
          'Invalid line value entered, only numbers with 44 or 47 digits are accepted',
        );
      }
    } catch (error) {
      next(error);
    }
  }
}
