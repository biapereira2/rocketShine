import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from '../../generated/prisma';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const dto = plainToInstance(CreateProdutoDto, createProdutoDto);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints ?? {})).flat();
      throw new BadRequestException(messages.join(', '));
    }

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

  async findByName(nome: string): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: {
        nome: {
          contains: nome.toLowerCase(),
        },
      },
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
