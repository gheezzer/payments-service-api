import BadRequestError from '../errors/bad-request';
import BankSlipDomain from '../domain/bankSlipDomain';
import DealershipDomain from '../domain/dealershipDomain';

export default class TypeableLineController {
  async getBankSlipAndDealershipData(req, res, next) {
    try {
      const { digits } = req.params;
      const sizeOfBankSlipDigits = 47;
      const sizeOfDealershipDigits = 48;
      const regex = /\d/g;
      const typeableLineDigits = digits.match(regex);
      const sizeOfTypeableLineDigits = typeableLineDigits.length;

      if (sizeOfTypeableLineDigits === sizeOfBankSlipDigits) {
        const slipData = BankSlipDomain.bankSlip(typeableLineDigits);
        res.send(slipData);
        next();
      } else if (sizeOfTypeableLineDigits === sizeOfDealershipDigits) {
        const dealershipData = DealershipDomain.dealership(typeableLineDigits);
        res.send(dealershipData);
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
