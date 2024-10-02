/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule, 
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => (
        {
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'qwer',
          database: 'nestjs_db',
          autoLoadEntities: true,
          // entities: [User],
          synchronize: true,
        }
      )
  }), TagsModule, MetaOptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
