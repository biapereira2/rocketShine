import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

class CarrinhoItemDto {
    @IsInt()
    produtoId: number;

    @IsInt()
    @Min(1)
    quantidade: number;
}

export class CreateCarrinhoDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CarrinhoItemDto)
    itens: CarrinhoItemDto[];
}