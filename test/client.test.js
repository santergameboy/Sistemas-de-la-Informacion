const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const clientService = require('../src/clientUser/client.db'); 
const Client = require('../src/clientUser/client.schema'); 
const errorBuilder = require('../src/commons/error-builder'); 

describe('Client Service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('save()', () => {
    it('debería guardar un cliente y devolver el cliente creado', async () => {
      const mockData = { name: 'Empresa X', nit: '123456789' };
      const mockResponse = { id: 1, ...mockData };

      sandbox.stub(Client, 'create').resolves(mockResponse);

      const result = await clientService.save(mockData);

      expect(result).to.deep.equal(mockResponse);
      expect(Client.create.calledOnceWith(mockData)).to.be.true;
    });

    it('debería lanzar un error si falla la operación', async () => {
      const mockError = new Error('Database error');
      sandbox.stub(Client, 'create').rejects(mockError);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await clientService.save({});
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getAll()', () => {
    it('debería devolver una lista de clientes', async () => {
      const mockClients = [
        { id: 1, name: 'Empresa X', nit: '123456789' },
        { id: 2, name: 'Empresa Y', nit: '987654321' }
      ];
      sandbox.stub(Client, 'findAll').resolves(mockClients);

      const result = await clientService.getAll();

      expect(result).to.deep.equal(mockClients);
      expect(Client.findAll.calledOnce).to.be.true;
    });

    it('debería lanzar un error si falla la operación', async () => {
      const mockError = new Error('Database error');
      sandbox.stub(Client, 'findAll').rejects(mockError);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await clientService.getAll();
      } catch (error) {
        expect(error).to.equal(mockError);
      }
    });
  });

  describe('getById()', () => {
    it('debería devolver un cliente si existe', async () => {
      const mockClient = { id: 1, name: 'Empresa X', nit: '123456789' };
      sandbox.stub(Client, 'findByPk').resolves(mockClient);

      const result = await clientService.getById(1);

      expect(result).to.deep.equal(mockClient);
      expect(Client.findByPk.calledOnceWith(1)).to.be.true;
    });

    it('debería lanzar un error si el cliente no existe', async () => {
      const mockError = new Error('not found client id');
      sandbox.stub(Client, 'findByPk').resolves(null);
      sandbox.stub(errorBuilder, 'build').returns(mockError);

      try {
        await clientService.getById(999);
      } catch (error) {
        expect(error.message).to.equal('not found client id');
      }
    });
  });

  describe('put()', () => {
    it('debería actualizar un cliente existente', async () => {
      const mockData = { name: 'Empresa Actualizada' };
      const mockUpdatedClient = { id: 1, ...mockData };

      sandbox.stub(Client, 'update').resolves([1]);
      sandbox.stub(Client, 'findByPk').resolves(mockUpdatedClient);

      const result = await clientService.put(1, mockData);

      expect(result).to.deep.equal(mockUpdatedClient);
      expect(Client.update.calledOnceWith(mockData, { where: { id: 1 } })).to.be.true;
    });

    it('debería lanzar un error si el cliente no existe', async () => {
      sandbox.stub(Client, 'update').resolves([0]);
      sandbox.stub(errorBuilder, 'build').returns(new Error('not found client id'));

      try {
        await clientService.put(999, {});
      } catch (error) {
        expect(error.message).to.equal('not found client id');
      }
    });
  });

  describe('remove()', () => {
    it('debería eliminar un cliente si existe', async () => {
      sandbox.stub(Client, 'destroy').resolves(1);

      const result = await clientService.remove(1);

      expect(result).to.be.true;
      expect(Client.destroy.calledOnceWith({ where: { id: 1 } })).to.be.true;
    });

    it('debería lanzar un error si el cliente no existe', async () => {
      sandbox.stub(Client, 'destroy').resolves(0);
      sandbox.stub(errorBuilder, 'build').returns(new Error('not found client id'));

      try {
        await clientService.remove(999);
      } catch (error) {
        expect(error.message).to.equal('not found client id');
      }
    });
  });

  describe('save()', () => {
    it('debería lanzar un error si el nombre o nit están vacíos', async () => {
      const mockData = { name: '', nit: '123456789' }; // Nombre vacío
  
      try {
        await clientService.save(mockData);
      } catch (error) {
        expect(error.body.message).to.equal('Validation error');
      }
  
      const mockData2 = { name: 'Empresa X', nit: '' }; // NIT vacío
      try {
        await clientService.save(mockData2);
      } catch (error) {
        expect(error.body.message).to.equal('Validation error');
      }
    });
  
    it('debería lanzar un error si el NIT ya está registrado', async () => {
      const mockData = { name: 'Empresa X', nit: '123456789' };
      const mockError = new Error('SequelizeUniqueConstraintError: nit must be unique');
  
      sandbox.stub(Client, 'create').rejects(mockError);
  
      try {
        await clientService.save(mockData);
      } catch (error) {
        expect(error.body.message).to.include('SequelizeUniqueConstraintError: nit must be unique');
      }
    });
  });

  describe('save() - Concurrency', () => {
    it('debería manejar múltiples solicitudes de creación de cliente correctamente', async () => {
      const mockData1 = { name: 'Empresa X', nit: '123456789' };
      const mockData2 = { name: 'Empresa Y', nit: '987654321' };
      const mockResponse1 = { id: 1, ...mockData1 };
      const mockResponse2 = { id: 2, ...mockData2 };
  
      sandbox.stub(Client, 'create')
        .onFirstCall().resolves(mockResponse1)
        .onSecondCall().resolves(mockResponse2);
  
      const promises = [
        clientService.save(mockData1),
        clientService.save(mockData2)
      ];
  
      const results = await Promise.all(promises);
  
      expect(results[0]).to.deep.equal(mockResponse1);
      expect(results[1]).to.deep.equal(mockResponse2);
      expect(Client.create.callCount).to.equal(2);
    });
  });

  describe('getById() - Interacciones con dependencias', () => {
    const mockError = {
      name: 'error',
      message: 'not found client id'
    };
    it('debería interactuar correctamente con errorBuilder cuando no se encuentra un cliente', async () => {
      sandbox.stub(Client, 'findByPk').resolves(null);
      const errorStub = sandbox.stub(errorBuilder, 'build').returns(mockError);
  
      try {
        await clientService.getById(999);
      } catch (error) {
        expect(error.message).to.equal('not found client id');
        expect(errorBuilder.build.calledWith('configure-status', {
          name: 'database - findById',
          message: 'not found client id',
          status: 404
        })).to.be.true;
      }
    });
  
    it('debería asegurar que se utiliza el build correctamente para un error de actualización', async () => {
      sandbox.stub(Client, 'update').resolves([0]);
      const errorStub = sandbox.stub(errorBuilder, 'build').returns(mockError);
  
      try {
        await clientService.put(999, {});
      } catch (error) {
        expect(error.message).to.equal('not found client id');
      }
    });
  });

  describe('save() - Validación de NIT', () => {
    it('debería lanzar un error si el NIT tiene un formato incorrecto', async () => {
      const mockData = { name: 'Empresa X', nit: '12345' }; // NIT incorrecto
  
      try {
        await clientService.save(mockData);
      } catch (error) {
        expect(error.body.message).to.equal('Validation error');
      }
    });
  
    it('debería guardar correctamente un cliente si el NIT es válido', async () => {
      const mockData = { name: 'Empresa X', nit: '123456789' }; // NIT válido
      const mockResponse = { id: 1, ...mockData };
  
      sandbox.stub(Client, 'create').resolves(mockResponse);
  
      const result = await clientService.save(mockData);
  
      expect(result).to.deep.equal(mockResponse);
      expect(Client.create.calledOnceWith(mockData)).to.be.true;
    });
  });

  describe('put() - Error Handling in Update', () => {
    it('debería lanzar un error si la base de datos falla al actualizar el cliente', async () => {
      const mockData = { name: 'Empresa X Actualizada' };
      const mockError = new Error('Database update failed');
  
      sandbox.stub(Client, 'update').rejects(mockError);
  
      try {
        await clientService.put(1, mockData);
      } catch (error) {
        expect(error.body.message).to.equal('Database update failed');
      }
    });
  });
  
  describe('remove() - Error Handling in Deletion', () => {
    it('debería lanzar un error si la base de datos falla al eliminar el cliente', async () => {
      const mockError = new Error('Database delete failed');
  
      sandbox.stub(Client, 'destroy').rejects(mockError);
  
      try {
        await clientService.remove(1);
      } catch (error) {
        expect(error.body.message).to.equal('Database delete failed');
      }
    });
  });
});
