import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  const mockProdutoService = {
    create: jest.fn().mockResolvedValue({
      id: 1,
      nome: 'Produto Teste',
      descricao: 'Descrição teste',
      preco: 100.0,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        nome: 'Produto A',
        descricao: 'Descrição A',
        preco: 50.0,
      },
      {
        id: 2,
        nome: 'Produto B',
        descricao: 'Descrição B',
        preco: 75.0,
      },
    ]),
    findOne: jest.fn().mockImplementation((id: number) =>
      id === 1
        ? Promise.resolve({
            id: 1,
            nome: 'Produto A',
            descricao: 'Descrição A',
            preco: 50.0,
          })
        : Promise.resolve(null),
    ),
    findByName: jest.fn().mockResolvedValue([
      {
        id: 2,
        nome: 'Anel de Prata',
        descricao: 'Bonito',
        preco: 90.0,
      },
    ]),
    update: jest.fn().mockImplementation((id: number, data: any) =>
      Promise.resolve({
        id,
        ...data,
      }),
    ),
    remove: jest.fn().mockImplementation((id: number) =>
      Promise.resolve({
        id,
        nome: 'Removido',
        descricao: 'Produto removido',
        preco: 0,
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [
        {
          provide: ProdutoService,
          useValue: mockProdutoService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('criar - cria um produto', async () => {
    const dto = { nome: 'Produto Teste', descricao: 'Descrição teste', preco: 100.0 };
    const resultado = await controller.create(dto);
    expect(resultado).toHaveProperty('id');
    expect(resultado.nome).toBe(dto.nome);
  });

  it('listar - retorna todos os produtos', async () => {
    const resultado = await controller.findAll();
    expect(resultado.length).toBeGreaterThan(0);
  });

  it('listar - retorna um produto pelo id', async () => {
    const resultado = await controller.findOne('1');
    expect(resultado).toHaveProperty('id');
    expect(resultado?.id).toBe(1);
  });

  it('listar - retorna null para produto inexistente', async () => {
    const resultado = await controller.findOne('999');
    expect(resultado).toBeNull();
  });

  it('listar - encontra produtos pelo nome', async () => {
    const resultado = await controller.findByName('anel');
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado[0].nome.toLowerCase()).toContain('anel');
  });

  it('atualizar - atualiza um produto', async () => {
    const dto = { preco: 120.0 };
    const resultado = await controller.update('1', dto);
    expect(resultado.preco).toBe(120.0);
  });

  it('remover - remove um produto', async () => {
    const resultado = await controller.remove('1');
    expect(resultado.id).toBe(1);
  });
});
