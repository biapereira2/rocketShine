import { Injectable } from '@nestjs/common';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { UpdateFavoritoDto } from './dto/update-favorito.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritosService {
  constructor(private prisma: PrismaService) {}

  async favoritar(produtoId: number) {
    return this.prisma.favorito.upsert({
      where: { produtoId },
      update: {},
      create: { produtoId },
    });
  }

  async desfavoritar(produtoId: number) {
    return this.prisma.favorito.delete({
      where: { produtoId },
    });
  }

  async listarFavoritos() {
    return this.prisma.favorito.findMany({
      include: {
        produto: true,
      },
    });
  }
}