/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class CreateUserMany {

    constructor(
        private dataSource: DataSource
    ){}

    public async createManyUsers(createUserDto : CreateManyUsersDto){ 
        let newUsers: User[] = [];


        // Create Query Runner Instance
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            // Connect the query ryunner to the datasource
            await queryRunner.connect();

            // Start the transaction
            await queryRunner.startTransaction();
        } catch (error) {
            throw new RequestTimeoutException("Could not connect to the database");
        }

        try {
            for (let user of createUserDto.users) {
                let newUser = queryRunner.manager.create(User, user);
                let result = await queryRunner.manager.save(newUser);
                newUsers.push(result);
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
            throw new ConflictException("Could not create users due to a conflict",{
                description: error.message
            });
        } finally {
            try {
                // you need to release a queryRunner which was manually instantiated
                await queryRunner.release();
            } catch (error) {
                throw new RequestTimeoutException("Could not release the query runner",{
                    description: error.message
                });
            }
        }

        return newUsers;
    }
}
