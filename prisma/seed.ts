import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
    await prisma.favorito.deleteMany();
    await prisma.itemCarrinho.deleteMany();
    await prisma.carrinho.deleteMany();
    await prisma.produto.deleteMany();

    await prisma.produto.createMany({
        data: [
        {
            nome: 'Anel de Ouro com Diamante',
            descricao: 'Anel sofisticado com acabamento em ouro 18k e diamante legítimo.',
            preco: 1599.90,
        },
        {
            nome: 'Colar de Prata com Pingente de Safira',
            descricao: 'Colar delicado em prata 925 com pingente de safira azul.',
            preco: 799.50,
        },
        {
            nome: 'Brinco de Pérola Natural',
            descricao: 'Brincos clássicos com pérolas naturais cultivadas.',
            preco: 499.00,
        },
        {
            nome: 'Pulseira de com Fecho de Aço',
            descricao: 'Pulseira casual com fecho de aço inoxidável.',
            preco: 199.90,
        },
        {
            nome: 'Relógio de Pulso Esportivo',
            descricao: 'Relógio esportivo com cronômetro e resistência à água.',
            preco: 299.99,
        },
        {
            nome: 'Anel de Prata com Turquesa',
            descricao: 'Anel elegante em prata 925 com pedra turquesa.',
            preco: 349.00,
        },
        {
            nome: 'Colar de Ouro com Pérola',
            descricao: 'Colar sofisticado em ouro 18k com pérola natural.',
            preco: 899.90,
        },
        {
            nome: 'Brinco de Ouro com Rubi',
            descricao: 'Brincos luxuosos em ouro 18k com rubis vermelhos.',
            preco: 1299.00,
        },
        {
            nome: 'Pingente de Prata com Citrino',
            descricao: 'Pingente delicado em prata 925 com citrino amarelo.',
            preco: 249.50,
        },
        ],
    });

    console.log('Banco populado com sucesso!');
    }

    main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
