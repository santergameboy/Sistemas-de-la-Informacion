const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const saleService = require('../src/sale/sale.db'); 
const Sale = require('../src/sale/sale.schema'); 
const errorBuilder = require('../src/commons/error-builder'); 

describe('Sale Service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('save()', () => {
    it('debería guardar una venta y devolverlo', async () => {
      const mockData = {
        quantity: '10',
        date: '10-10-2024',
        userId: 1,
        productId: 1,
        clientId: 1,
      };
      const mockResponse = { id: 1, ...mockData };

      sandbox.stub(Sale, 'create').resolves(mockResponse);

      const result = await saleService.save(mockData);

      expect(result).to.deep.equal(mockResponse);
      expect(Sale.create.calledOnceWith(mockData)).to.be.true;
    });

    it('debería lanzar un error si falla la operación', async () => {
      const mockError = new Error('Database error');
      sandbox.stub(Sale, 'create').rejects(mockError);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await saleService.save({});
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getAll()', () => {
    it('debería devolver una lista de ventas', async () => {
      const mockSale = [
        { id: 1, quantity: '10', date: '12-12-2024', userId: 1, productId: 1, clientId: 1 },
        { id: 2, quantity: '20', date: '12-12-2024', userId: 1, productId: 1, clientId: 1},
      ];
      sandbox.stub(Sale, 'findAll').resolves(mockSale);

      const result = await saleService.getAll();

      expect(result).to.deep.equal(mockSale);
      expect(Sale.findAll.calledOnce).to.be.true;
    });

    it('debería lanzar un error si falla la operación', async () => {
      const mockError = new Error('Database error');
      sandbox.stub(Sale, 'findAll').rejects(mockError);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await saleService.getAll();
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getById()', () => {
    it('debería devolver una venta si existe', async () => {
      const mockSale = { id: 1, quantity: '10', date: '12-12-2024', userId: 1, productId: 1, clientId: 1 };
      sandbox.stub(Sale, 'findByPk').resolves(mockSale);

      const result = await saleService.getById(1);

      expect(result).to.deep.equal(mockSale);
      expect(Sale.findByPk.calledOnceWith(1)).to.be.true;
    });

    it('debería lanzar un error si la venta no existe', async () => {
      const mockError = new Error('not found sale id');
      sandbox.stub(Sale, 'findByPk').resolves(null);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await saleService.getById(999);
      } catch (error) {
        expect(error.message).to.equal('not found sale id');
      }
    });
  });

  describe('put()', () => {
    it('debería actualizar una venta si existente', async () => {
      const mockData = { quantity: '10', date: '12-12-2024', userId: 1, productId: 1, clientId: 1 };
      const mockUpdatedSale = { id: 1, ...mockData };

      sandbox.stub(Sale, 'update').resolves([1]);
      sandbox.stub(Sale, 'findByPk').resolves(mockUpdatedSale);

      const result = await saleService.put(1, mockData);

      expect(result).to.deep.equal(mockUpdatedSale);
      expect(Sale.update.calledOnceWith(mockData, { where: { id: 1 } })).to.be.true;
    });

    it('debería lanzar un error si la denta no existe', async () => {
      sandbox.stub(Sale, 'update').resolves([0]);
      sandbox.stub(errorBuilder, 'build').returns(new Error('not found sale id'));

      try {
        await saleService.put(999, {});
      } catch (error) {
        expect(error.message).to.equal('not found sale id');
      }
    });
  });

  describe('remove()', () => {
    it('debería eliminar una venta si existe', async () => {
      sandbox.stub(Sale, 'destroy').resolves(1);

      const result = await saleService.remove(1);

      expect(result).to.be.true;
      expect(Sale.destroy.calledOnceWith({ where: { id: 1 } })).to.be.true;
    });

    it('debería lanzar un error si la venta no existe', async () => {
      sandbox.stub(Sale, 'destroy').resolves(0);
      sandbox.stub(errorBuilder, 'build').returns(new Error('not found sale id'));

      try {
        await saleService.remove(999);
      } catch (error) {
        expect(error.message).to.equal('not found sale id');
      }
    });
  });
});
