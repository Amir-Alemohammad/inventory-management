import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module";
import * as request from 'supertest';

describe('ItemController (e2e)', () => {
    let app: INestApplication;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('Get list Of Items (GET) /item', () => {
        it('should return items', () => {
            request(app.getHttpServer())
                .get('/item')
                .expect(200)
        });
    });
    describe('Get One Of Items (GET) /item/:id', () => {
        it('should return item', () => {
            request(app.getHttpServer())
                .get('/item/6602fbbdae426345ab1f03ee')
            expect(200)
        })
        it('should return Bad Request for Invalid Id', () => {
            request(app.getHttpServer())
                .get('/item/6602fbbdae426345ab1f03e2')
            expect(400)
        })
    })

})