/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostService } from './providers/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

@Module({
  controllers: [PostsController],
  providers: [PostService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Post]),
  ],
})
export class PostsModule {}
