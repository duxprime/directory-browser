import { NestFactory } from '@nestjs/core';
import * as bodyparser from 'body-parser';
import { AppModule } from './app.module';

const port = parseInt(process.env.API_PORT, 10) || 3000;
const fileSizeLimitMb = 50;
const clientUrl = 'http://localhost:8080';
const parserConfig = {
    limit: `${fileSizeLimitMb}mb`
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    /**
    app.use(bodyparser.json(parserConfig));
    app.use(bodyparser.urlencoded({
        ...parserConfig,
        extended: true
    }));
    */
    app.enableCors({
        origin: clientUrl
    });
    await app.listen(port);
    console.log(`Listening on port: ${port}`);
}
bootstrap();
