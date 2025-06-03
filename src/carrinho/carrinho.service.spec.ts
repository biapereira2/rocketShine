import { Test, TestingModule } from '@nestjs/testing';
import { CarrinhoService } from './carrinho.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CarrinhoService', () => {
    let carrinhoService: CarrinhoService;
    let mockPrisma: Partial<Record<keyof PrismaService, any>>;

    beforeEach(async () => {
        mockPrisma = {
        carrinho: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        itemCarrinho: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        };

        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CarrinhoService,
            { provide: PrismaService, useValue: mockPrisma },
        ],
        }).compile();

        carrinhoService = module.get<CarrinhoService>(CarrinhoService);
    });

    it('adicionarItens - cria carrinho novo se não existir e adiciona item', async () => {
        mockPrisma.carrinho.findFirst.mockResolvedValue(null);
        mockPrisma.carrinho.create.mockResolvedValue({ id: 1 });
        mockPrisma.itemCarrinho.findFirst.mockResolvedValue(null);
        mockPrisma.itemCarrinho.create.mockResolvedValue({ id: 1, produtoId: 10, quantidade: 2, carrinhoId: 1 });
        mockPrisma.carrinho.findUnique.mockResolvedValue({
        id: 1,
        criacao: new Date(),
        finalizado: false,
        itens: [{ id: 1, produtoId: 10, quantidade: 2, carrinhoId: 1 }],
        });

        const dto = { itens: [{ produtoId: 10, quantidade: 2 }] };
        const resultado = await carrinhoService.adicionarItens(dto);

        expect(resultado).not.toBeNull();
        expect(resultado!.id).toBe(1);
        expect(resultado!.itens).toHaveLength(1);
        expect(mockPrisma.carrinho.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.carrinho.create).toHaveBeenCalledTimes(1);
        expect(mockPrisma.itemCarrinho.create).toHaveBeenCalledTimes(1);
    });

    it('adicionarItens - atualiza quantidade se item já existir', async () => {
        mockPrisma.carrinho.findFirst.mockResolvedValue({ id: 1 });
        mockPrisma.itemCarrinho.findFirst.mockResolvedValue({ id: 2, produtoId: 10, quantidade: 2, carrinhoId: 1 });
        mockPrisma.itemCarrinho.update.mockResolvedValue({ id: 2, produtoId: 10, quantidade: 5, carrinhoId: 1 });
        mockPrisma.carrinho.findUnique.mockResolvedValue({
        id: 1,
        criacao: new Date(),
        finalizado: false,
        itens: [{ id: 2, produtoId: 10, quantidade: 5, carrinhoId: 1 }],
        });

        const dto = { itens: [{ produtoId: 10, quantidade: 3 }] };
        const resultado = await carrinhoService.adicionarItens(dto);

        expect(resultado).not.toBeNull();
        expect(resultado!.itens[0].quantidade).toBe(5);
        expect(mockPrisma.itemCarrinho.update).toHaveBeenCalledTimes(1);
    });

    it('atualizarItens - remove item não presente no dto e atualiza/cria os demais', async () => {
        const carrinhoMock = {
        id: 1,
        finalizado: false,
        criacao: new Date(),
        itens: [
            { id: 10, produtoId: 1, quantidade: 2, carrinhoId: 1 },
            { id: 11, produtoId: 2, quantidade: 1, carrinhoId: 1 },
        ],
        };
        mockPrisma.carrinho.findFirst.mockResolvedValue(carrinhoMock);
        mockPrisma.itemCarrinho.delete.mockResolvedValue({ id: 11 });
        mockPrisma.itemCarrinho.update.mockResolvedValue({ id: 10, quantidade: 5 });
        mockPrisma.itemCarrinho.create.mockResolvedValue({ id: 12, produtoId: 3, quantidade: 4, carrinhoId: 1 });
        mockPrisma.carrinho.findUnique.mockResolvedValue({
        ...carrinhoMock,
        itens: [
            { id: 10, produtoId: 1, quantidade: 5, carrinhoId: 1 },
            { id: 12, produtoId: 3, quantidade: 4, carrinhoId: 1 },
        ],
        });

        const dto = {
        itens: [
            { produtoId: 1, quantidade: 5 }, // atualiza item existente
            { produtoId: 3, quantidade: 4 }, // novo item
        ],
        };

        const resultado = await carrinhoService.atualizarItens(dto);

        expect(resultado).not.toBeNull();
        expect(resultado!.itens).toHaveLength(2);
        expect(mockPrisma.itemCarrinho.delete).toHaveBeenCalledTimes(1);
        expect(mockPrisma.itemCarrinho.update).toHaveBeenCalledTimes(1);
        expect(mockPrisma.itemCarrinho.create).toHaveBeenCalledTimes(1);
    });

    it('removerItem - deleta item existente', async () => {
        const carrinhoMock = { id: 1, finalizado: false };
        const itemMock = { id: 10, produtoId: 3, quantidade: 2, carrinhoId: 1 };

        mockPrisma.carrinho.findFirst.mockResolvedValue(carrinhoMock);
        mockPrisma.itemCarrinho.findFirst.mockResolvedValue(itemMock);
        mockPrisma.itemCarrinho.delete.mockResolvedValue(itemMock);

        const resultado = await carrinhoService.removerItem(3);

        expect(resultado).toEqual(itemMock);
        expect(mockPrisma.itemCarrinho.delete).toHaveBeenCalledWith({ where: { id: itemMock.id } });
    });

    it('finalizarCarrinho - marca carrinho aberto como finalizado', async () => {
        const carrinhoMock = { id: 1, finalizado: false };
        mockPrisma.carrinho.findFirst.mockResolvedValue(carrinhoMock);
        mockPrisma.carrinho.update.mockResolvedValue({ ...carrinhoMock, finalizado: true });

        const resultado = await carrinhoService.finalizarCarrinho();

        expect(resultado.finalizado).toBe(true);
        expect(mockPrisma.carrinho.update).toHaveBeenCalledWith({
        where: { id: carrinhoMock.id },
        data: { finalizado: true },
        });
    });

    it('getCarrinhoAtual - retorna carrinho aberto com itens', async () => {
        const carrinhoMock = {
        id: 1,
        finalizado: false,
        criacao: new Date(),
        itens: [{ id: 20, produtoId: 5, quantidade: 3, carrinhoId: 1, produto: { id: 5, nome: 'ProdutoX' } }],
        };
        mockPrisma.carrinho.findFirst.mockResolvedValue(carrinhoMock);

        const resultado = await carrinhoService.getCarrinhoAtual();

        expect(resultado).not.toBeNull();
        expect(resultado!.id).toBe(1);
        expect(resultado!.itens[0].produto.nome).toBe('ProdutoX');
    });

    it('getHistoricoDePedidos - retorna lista de carrinhos finalizados', async () => {
        const pedidosMock = [
        {
            id: 1,
            finalizado: true,
            criacao: new Date(),
            itens: [
            { id: 30, produtoId: 7, quantidade: 1, carrinhoId: 1, produto: { id: 7, nome: 'ProdutoY' } },
            ],
        },
        ];
        mockPrisma.carrinho.findMany.mockResolvedValue(pedidosMock);

        const resultado = await carrinhoService.getHistoricoDePedidos();

        expect(resultado).toHaveLength(1);
        expect(resultado[0].finalizado).toBe(true);
    });
});
