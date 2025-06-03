import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoService } from './produto.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProdutoController } from './produto.controller';

describe('ProdutoService', () => {
  let service: ProdutoService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [ProdutoService, PrismaService],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('criar', () => {
    it('criar - cria produto com sucesso', async () => {
      const produto = await service.create({
        nome: 'Colar Teste',
        descricao: 'Colar lindo',
        preco: 250.5,
      });
      expect(produto).toHaveProperty('id');
      expect(produto.nome).toBe('Colar Teste');
    });

    it('criar - falha com campos obrigatórios ausentes', async () => {
      await expect(
        service.create({
          nome: '',
          preco: 0,
          descricao: '',
        } as any),
      ).rejects.toThrow();
    });
  });

  describe('listar', () => {
    it('listar - retorna array de produtos', async () => {
      const produtos = await service.findAll();
      expect(Array.isArray(produtos)).toBe(true);
    });
  });

  describe('buscar por id', () => {
    it('buscar por id - retorna produto existente', async () => {
      const created = await service.create({
        nome: 'Anel de Ouro',
        descricao: 'Anel de ouro 18k',
        preco: 500.0,
      });

      const produto = await service.findOne(created.id);
      expect(produto).not.toBeNull();
      expect(produto?.id).toBe(created.id);
    });

    it('buscar por id - retorna null para id inexistente', async () => {
      const produto = await service.findOne(999999);
      expect(produto).toBeNull();
    });
  });

  describe('buscar por nome', () => {
    it('buscar por nome - encontra produtos por substring', async () => {
      const nome = 'anel';
      const produtos = await service.findByName(nome);
      expect(produtos.length).toBeGreaterThanOrEqual(0);
      if (produtos.length > 0) {
        expect(produtos[0].nome.toLowerCase()).toContain(nome);
      }
    });
  });

  describe('atualizar', () => {
    it('atualizar - atualiza produto existente', async () => {
      const created = await service.create({
        nome: 'Pulseira Prata',
        descricao: 'Pulseira fina',
        preco: 120.0,
      });

      const updated = await service.update(created.id, {
        preco: 150.0,
      });
      expect(updated.preco).toBe(150.0);
    });

    it('atualizar - lança erro para produto inexistente', async () => {
      await expect(
        service.update(999999, { preco: 100 }),
      ).rejects.toThrow();
    });
  });

  describe('remover', () => {
    it('remover - remove produto existente', async () => {
      const created = await service.create({
        nome: 'Brinco de Pérola',
        descricao: 'Brinco elegante',
        preco: 300.0,
      });

      const removed = await service.remove(created.id);
      expect(removed.id).toBe(created.id);

      const shouldBeNull = await service.findOne(created.id);
      expect(shouldBeNull).toBeNull();
    });

    it('remover - lança erro para produto inexistente', async () => {
      await expect(service.remove(999999)).rejects.toThrow();
    });
  });
});
