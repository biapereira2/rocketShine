import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import { UpdateFavoritoDto } from './dto/update-favorito.dto';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post(':produtoId')
  favoritar(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.favoritosService.favoritar(produtoId);
  }

  @Delete(':produtoId')
  desfavoritar(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.favoritosService.desfavoritar(produtoId);
  }

  @Get()
  listar() {
    return this.favoritosService.listarFavoritos();
  }
}