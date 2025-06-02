import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutoModule } from './produto/produto.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { FavoritosService } from './favoritos/favoritos.service';
import { FavoritosModule } from './favoritos/favoritos.module';



@Module({
  imports: [PrismaModule, ProdutoModule, CarrinhoModule, FavoritosModule],
  controllers: [AppController],
  providers: [AppService, FavoritosService],
})
export class AppModule {}
