import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProdutoDto {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    descricao: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    preco: number;
}
