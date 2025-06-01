import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from '../../generated/prisma';


@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  create(createProdutoDto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: createProdutoDto,
    });
  }

  async findAll(): Promise<Produto[]> {
    return this.prisma.produto.findMany();
  }

  async findOne(id: number): Promise<Produto | null> {
    return this.prisma.produto.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    return this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
    });
  }

  async remove(id: number): Promise<Produto> {
    return this.prisma.produto.delete({
      where: { id },
    });
  }
}
