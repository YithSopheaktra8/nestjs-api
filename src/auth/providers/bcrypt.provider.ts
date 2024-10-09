/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
    public async hashPassword(data: string | Buffer): Promise<string> {
        // generate a salt
        const salt = await bcrypt.genSalt();
        // hash the password with the salt
        return bcrypt.hash(data, salt);
    }
    
    comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
        return bcrypt.compare(data, encrypted);
    }
}
