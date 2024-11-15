import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    //Inicia a conexão com o banco de dados
    async onModuleInit() {
        await this.$connect()
    }

    //Encerra a conexão com o banco quando a aplicação é fechada
    async enableShutdownHooks(app: INestApplication) {
        process.on('beforeExit', async () => {
            await app.close();
        });
    }
}