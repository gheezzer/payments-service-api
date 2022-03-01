import BadRequestError from '../errors/bad-request';
import BankSlipDomain from '../domain/bankSlipDomain';
import DealershipDomain from '../domain/dealershipDomain';

export default class TypeableLineController {
  async getBankSlipAndDealershipData(req, res, next) {
    try {
      const numberOfBankSlipDigits = 47;
      const numberOfDealershipDigits = 48;
      const { digits } = req.params;
      const regex = /\d/g;
      const arrayOfTypeableLineDigits = digits.match(regex);
      const numberOfTypeableLineDigits = arrayOfTypeableLineDigits.length;

      if (numberOfTypeableLineDigits === numberOfBankSlipDigits) {
        const slipData = BankSlipDomain.bankSlip(arrayOfTypeableLineDigits);
        res.send(slipData);
        next();
      } else if (numberOfTypeableLineDigits <= numberOfDealershipDigits) {
        const dealerPayment = DealershipDomain.dealership(
          arrayOfTypeableLineDigits,
        );
        res.send(dealerPayment);
        next();
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
