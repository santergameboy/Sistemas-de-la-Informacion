const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const productService = require('../src/product/product.db'); 
const Product = require('../src/product/product.schema'); 
const errorBuilder = require('../src/commons/error-builder'); 

describe('Product Service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('save()', () => {
    it('debería guardar un producto y devolverlo', async () => {
      const mockData = {
        name: 'Producto A',
        details: 'Detalles del producto A',
        image: 'image_url',
        category: 'Categoría A',
        price: 100.0,
        salePrice: 90.0,
        stock: 50,
      };
      const mockResponse = { id: 1, ...mockData };

      sandbox.stub(Product, 'create').resolves(mockResponse);

      const result = await productService.save(mockData);

      expect(result).to.deep.equal(mockResponse);
      expect(Product.create.calledOnceWith(mockData)).to.be.true;
    });

    it('debería lanzar un error si falla la operación', async () => {
      const mockError = new Error('Database error');
      sandbox.stub(Product, 'create').rejects(mockError);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await productService.save({});
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getAll()', () => {
    it('debería devolver una lista de productos', async () => {
      const mockProducts = [
        { id: 1, name: 'Producto A', price: 100.0 },
        { id: 2, name: 'Producto B', price: 200.0 },
      ];
      sandbox.stub(Product, 'findAll').resolves(mockProducts);

      const result = await productService.getAll();

      expect(result).to.deep.equal(mockProducts);
      expect(Product.findAll.calledOnce).to.be.true;
    });

    it('debería lanzar un error si falla la operación', async () => {
      const mockError = new Error('Database error');
      sandbox.stub(Product, 'findAll').rejects(mockError);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await productService.getAll();
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getById()', () => {
    it('debería devolver un producto si existe', async () => {
      const mockProduct = { id: 1, name: 'Producto A', price: 100.0 };
      sandbox.stub(Product, 'findByPk').resolves(mockProduct);

      const result = await productService.getById(1);

      expect(result).to.deep.equal(mockProduct);
      expect(Product.findByPk.calledOnceWith(1)).to.be.true;
    });

    it('debería lanzar un error si el producto no existe', async () => {
      const mockError = new Error('not found product id');
      sandbox.stub(Product, 'findByPk').resolves(null);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await productService.getById(999);
      } catch (error) {
        expect(error.message).to.equal('not found product id');
      }
    });
  });

  describe('put()', () => {
    it('debería actualizar un producto existente', async () => {
      const mockData = { name: 'Producto Actualizado' };
      const mockUpdatedProduct = { id: 1, ...mockData };

      sandbox.stub(Product, 'update').resolves([1]);
      sandbox.stub(Product, 'findByPk').resolves(mockUpdatedProduct);

      const result = await productService.put(1, mockData);

      expect(result).to.deep.equal(mockUpdatedProduct);
      expect(Product.update.calledOnceWith(mockData, { where: { id: 1 } })).to.be.true;
    });

    it('debería lanzar un error si el producto no existe', async () => {
      sandbox.stub(Product, 'update').resolves([0]);
      sandbox.stub(errorBuilder, 'build').returns(new Error('not found product id'));

      try {
        await productService.put(999, {});
      } catch (error) {
        expect(error.message).to.equal('not found product id');
      }
    });
  });

  describe('remove()', () => {
    it('debería eliminar un producto si existe', async () => {
      sandbox.stub(Product, 'destroy').resolves(1);

      const result = await productService.remove(1);

      expect(result).to.be.true;
      expect(Product.destroy.calledOnceWith({ where: { id: 1 } })).to.be.true;
    });

    it('debería lanzar un error si el producto no existe', async () => {
      sandbox.stub(Product, 'destroy').resolves(0);
      sandbox.stub(errorBuilder, 'build').returns(new Error('not found product id'));

      try {
        await productService.remove(999);
      } catch (error) {
        expect(error.message).to.equal('not found product id');
      }
    });
  });
});
