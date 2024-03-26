import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";

export function AuthDecorator() {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(JwtAuthGuard),
    )
}