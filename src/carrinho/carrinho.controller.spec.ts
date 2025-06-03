import { Test, TestingModule } from '@nestjs/testing';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { CreateCarrinhoDto } from './dto/create-carrinho.dto';
import { UpdateCarrinhoDto } from './dto/update-carrinho.dto';

describe('CarrinhoController', () => {
    let controller: CarrinhoController;
    let service: CarrinhoService;

    const mockCarrinhoService = {
        adicionarItens: jest.fn(),
        atualizarItens: jest.fn(),
        removerItem: jest.fn(),
        finalizarCarrinho: jest.fn(),
        getCarrinhoAtual: jest.fn(),
        getHistoricoDePedidos: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [CarrinhoController],
        providers: [
            {
            provide: CarrinhoService,
            useValue: mockCarrinhoService,
            },
        ],
        }).compile();

        controller = module.get<CarrinhoController>(CarrinhoController);
        service = module.get<CarrinhoService>(CarrinhoService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('adicionarItens', () => {
        it('adicionarItens - chama service e retorna resultado', async () => {
        const dto: CreateCarrinhoDto = {
            itens: [{ produtoId: 1, quantidade: 2 }],
        };

        const resultado = { id: 1, itens: dto.itens };
        mockCarrinhoService.adicionarItens.mockResolvedValue(resultado);

        const response = await controller.adicionarItens(dto);

        expect(service.adicionarItens).toHaveBeenCalledWith(dto);
        expect(response).toBe(resultado);
        });
    });

    describe('atualizar', () => {
        it('atualizar - chama service e retorna resultado', async () => {
        const dto: UpdateCarrinhoDto = {
            itens: [{ produtoId: 1, quantidade: 3 }],
        };

        const resultado = { id: 1, itens: dto.itens };
        mockCarrinhoService.atualizarItens.mockResolvedValue(resultado);

        const response = await controller.atualizar(dto);

        expect(service.atualizarItens).toHaveBeenCalledWith(dto);
        expect(response).toBe(resultado);
        });
    });

    describe('remover', () => {
        it('remover - chama service com produtoId e retorna resultado', async () => {
        const produtoId = '5';
        const resultado = { id: 10, produtoId: 5 };

        mockCarrinhoService.removerItem.mockResolvedValue(resultado);

        const response = await controller.remover(produtoId);

        expect(service.removerItem).toHaveBeenCalledWith(5);
        expect(response).toBe(resultado);
        });
    });

    describe('finalizar', () => {
        it('finalizar - chama service e retorna resultado', async () => {
        const resultado = { id: 1, finalizado: true };
        mockCarrinhoService.finalizarCarrinho.mockResolvedValue(resultado);

        const response = await controller.finalizar();

        expect(service.finalizarCarrinho).toHaveBeenCalled();
        expect(response).toBe(resultado);
        });
    });

    describe('getCarrinhoAtual', () => {
        it('getCarrinhoAtual - chama service e retorna resultado', async () => {
        const resultado = { id: 1, finalizado: false, itens: [] };
        mockCarrinhoService.getCarrinhoAtual.mockResolvedValue(resultado);

        const response = await controller.getCarrinhoAtual();

        expect(service.getCarrinhoAtual).toHaveBeenCalled();
        expect(response).toBe(resultado);
        });
    });

    describe('getHistorico', () => {
        it('getHistorico - chama service e retorna resultado', async () => {
        const resultado = [{ id: 1, finalizado: true, itens: [] }];
        mockCarrinhoService.getHistoricoDePedidos.mockResolvedValue(resultado);

        const response = await controller.getHistorico();

        expect(service.getHistoricoDePedidos).toHaveBeenCalled();
        expect(response).toBe(resultado);
        });
    });
});
