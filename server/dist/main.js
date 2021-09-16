"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const port = parseInt(process.env.API_PORT, 10) || 3000;
const fileSizeLimitMb = 50;
const clientUrl = 'http://localhost:8080';
const parserConfig = {
    limit: `${fileSizeLimitMb}mb`
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: clientUrl
    });
    await app.listen(port);
    console.log(`Listening on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map