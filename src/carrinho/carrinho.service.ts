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
    // Busca o carrinho aberto
    const carrinho = await this.prisma.carrinho.findFirst({
      where: { finalizado: false },
      include: { itens: true },
    });

    if (!carrinho) {
      throw new Error('Carrinho não encontrado');
    }

    // Extrai os produtos atuais do carrinho
    const itensAtuais = carrinho.itens;

    // Produtos que vieram na atualização
    const produtosAtualizados = (updateCarrinhoDto.itens ?? []).map(item => item.produtoId);

    // Remover itens que estão no carrinho mas não vieram na atualização
    for (const itemAtual of itensAtuais) {
      if (!produtosAtualizados.includes(itemAtual.produtoId)) {
        await this.prisma.itemCarrinho.delete({ where: { id: itemAtual.id } });
      }
    }

    // Atualizar ou criar os itens enviados
    for (const item of updateCarrinhoDto.itens ?? []) {
      const itemExistente = itensAtuais.find(i => i.produtoId === item.produtoId);

      if (itemExistente) {
        // Atualiza a quantidade do item existente
        await this.prisma.itemCarrinho.update({
          where: { id: itemExistente.id },
          data: { quantidade: item.quantidade },
        });
      } else {
        // Cria novo item no carrinho
        await this.prisma.itemCarrinho.create({
          data: {
            carrinhoId: carrinho.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
          },
        });
      }
    }

    // Retorna o carrinho atualizado já com os itens e produtos
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


}

