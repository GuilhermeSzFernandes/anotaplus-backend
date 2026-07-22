import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EntriesModule } from './entries/entries.module';
import { CategoriesModule } from './categories/categories.module';
import { CarteirasModule } from './carteiras/carteiras.module';
import { BillingModule } from './billing/billing.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    EntriesModule,
    CategoriesModule,
    CarteirasModule,
    BillingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
