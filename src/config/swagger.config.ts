import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
export const SwaggerConfigInit = (app: INestApplication): void => {
    const config = new DocumentBuilder()
        .setTitle("Inventory Management")
        .setDescription("backend api for Inventory Management")
        .setVersion("v0.0.1")
        .addBearerAuth(SwaggerAuthConfig(), 'Authorization')
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/swagger", app, swaggerDocument);
}
function SwaggerAuthConfig(): SecuritySchemeObject {
    return {
        type: "http",
        bearerFormat: "JWT",
        in: "header",
        scheme: "bearer"
    }
}