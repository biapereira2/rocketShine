import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from '../../generated/prisma';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Produto | null> {
    return this.produtoService.findOne(+id);
  }

  @Get('buscar/:nome')
  findByName(@Param('nome') nome: string): Promise<Produto[]> {
  return this.produtoService.findByName(nome);
}

  @Post()
  create(@Body() data: CreateProdutoDto): Promise<Produto> {
  return this.produtoService.create(data);
}

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProdutoDto): Promise<Produto> {
  return this.produtoService.update(+id, data);
}

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.remove(+id);
  }
}
