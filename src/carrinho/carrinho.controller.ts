import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { CreateCarrinhoDto } from './dto/create-carrinho.dto';
import { UpdateCarrinhoDto } from './dto/update-carrinho.dto';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Post('adicionar')
  adicionarItens(@Body() createCarrinhoDto: CreateCarrinhoDto) {
    return this.carrinhoService.adicionarItens(createCarrinhoDto);
  }

  @Patch('atualizar')
  atualizar(@Body() dto: UpdateCarrinhoDto) {
    return this.carrinhoService.atualizarItens(dto);
  }

  @Delete('remover/:produtoId')
  remover(@Param('produtoId') produtoId: string) {
    return this.carrinhoService.removerItem(+produtoId);
  }

  @Post('finalizar')
  finalizar() {
    return this.carrinhoService.finalizarCarrinho();
  }

  @Get('atual')
  getCarrinhoAtual() {
    return this.carrinhoService.getCarrinhoAtual();
  }

  @Get('historico')
  getHistorico() {
    return this.carrinhoService.getHistoricoDePedidos();
  }
  
}