import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosService } from './favoritos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FavoritosService', () => {
    let service: FavoritosService;
    let prisma: PrismaService;

    const mockPrisma = {
        favorito: {
        upsert: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            FavoritosService,
            { provide: PrismaService, useValue: mockPrisma },
        ],
        }).compile();

        service = module.get<FavoritosService>(FavoritosService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('favoritar', () => {
        it('favoritar - cria ou atualiza favorito', async () => {
        const produtoId = 123;
        const resultadoMock = { produtoId };
        mockPrisma.favorito.upsert.mockResolvedValue(resultadoMock);

        const resultado = await service.favoritar(produtoId);

        expect(mockPrisma.favorito.upsert).toHaveBeenCalledWith({
            where: { produtoId },
            update: {},
            create: { produtoId },
        });
        expect(resultado).toBe(resultadoMock);
        });
    });

    describe('desfavoritar', () => {
        it('desfavoritar - remove favorito existente', async () => {
        const produtoId = 456;
        const resultadoMock = { produtoId };
        mockPrisma.favorito.delete.mockResolvedValue(resultadoMock);

        const resultado = await service.desfavoritar(produtoId);

        expect(mockPrisma.favorito.delete).toHaveBeenCalledWith({
            where: { produtoId },
        });
        expect(resultado).toBe(resultadoMock);
        });
    });

    describe('listarFavoritos', () => {
        it('listarFavoritos - retorna lista de favoritos', async () => {
        const resultadoMock = [
            { produtoId: 1, produto: { nome: 'Produto A' } },
            { produtoId: 2, produto: { nome: 'Produto B' } },
        ];
        mockPrisma.favorito.findMany.mockResolvedValue(resultadoMock);

        const resultado = await service.listarFavoritos();

        expect(mockPrisma.favorito.findMany).toHaveBeenCalledWith({
            include: {
            produto: true,
            },
        });
        expect(resultado).toBe(resultadoMock);
        });
    });
});
