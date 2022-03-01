import TypeableLineController from '../../controllers/typeableLineController';

const typeableLineController = new TypeableLineController();

export default [
  {
    method: 'GET',
    path: '/boleto/:digits',
    handler: typeableLineController.getBankSlipAndDealershipData,
  },
];
