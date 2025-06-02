import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarrinhoDto } from './dto/create-carrinho.dto';
import { UpdateCarrinhoDto } from './dto/update-carrinho.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarrinhoService {
  constructor(private prisma: PrismaService) {}

    async adicionarItens(createCarrinhoDto: CreateCarrinhoDto) {
    let carrinho = await this.prisma.carrinho.findFirst({
      where: { finalizado: false },
    });

    if (!carrinho) {
      carrinho = await this.prisma.carrinho.create({ data: {} });
    }

    for (const item of createCarrinhoDto.itens) {
      const existente = await this.prisma.itemCarrinho.findFirst({
        where: {
          carrinhoId: carrinho.id,
          produtoId: item.produtoId,
        },
      });

      if (existente) {
        await this.prisma.itemCarrinho.update({
          where: { id: existente.id },
          data: {
            quantidade: existente.quantidade + item.quantidade,
          },
        });
      } else {
        await this.prisma.itemCarrinho.create({
          data: {
            carrinhoId: carrinho.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          },
        });
      }
    }

    return this.prisma.carrinho.findUnique({
      where: { id: carrinho.id },
      include: { itens: true },
    });
  }

    async atualizarItens(updateCarrinhoDto: UpdateCarrinhoDto) {

    const carrinho = await this.prisma.carrinho.findFirst({
      where: { finalizado: false },
      include: { itens: true },
    });

    if (!carrinho) {
      throw new Error('Carrinho não encontrado');
    }

    const itensAtuais = carrinho.itens;

    const produtosAtualizados = (updateCarrinhoDto.itens ?? []).map(item => item.produtoId);

    for (const itemAtual of itensAtuais) {
      if (!produtosAtualizados.includes(itemAtual.produtoId)) {
        await this.prisma.itemCarrinho.delete({ where: { id: itemAtual.id } });
      }
    }

    for (const item of updateCarrinhoDto.itens ?? []) {
      const itemExistente = itensAtuais.find(i => i.produtoId === item.produtoId);

      if (itemExistente) {
        await this.prisma.itemCarrinho.update({
          where: { id: itemExistente.id },
          data: { quantidade: item.quantidade },
        });
      } else {
        await this.prisma.itemCarrinho.create({
          data: {
            carrinhoId: carrinho.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          },
        });
      }
    }

    return this.prisma.carrinho.findUnique({
      where: { id: carrinho.id },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async removerItem(produtoId: number) {
    const carrinho = await this.prisma.carrinho.findFirst({
      where: { finalizado: false },
    });

    if (!carrinho) {
      throw new Error('Carrinho não encontrado');
    }

    const item = await this.prisma.itemCarrinho.findFirst({
      where: {
        carrinhoId: carrinho.id,
        produtoId,
      },
    });

    if (!item) {
      throw new Error('Item não encontrado');
    }

    return this.prisma.itemCarrinho.delete({
      where: { id: item.id },
    });
  }

    async finalizarCarrinho() {
    const carrinho = await this.prisma.carrinho.findFirst({
      where: { finalizado: false },
    });

    if (!carrinho) {
      throw new Error('Carrinho não encontrado');
    }

    return this.prisma.carrinho.update({
      where: { id: carrinho.id },
      data: { finalizado: true },
    });
  }

  async getCarrinhoAtual() {
    const carrinho = await this.prisma.carrinho.findFirst({
      where: { finalizado: false },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!carrinho) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    return carrinho;
  }

  async getHistoricoDePedidos() {
    return this.prisma.carrinho.findMany({
      where: { finalizado: true },
      orderBy: { criacao: 'desc' },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });
  }


}

