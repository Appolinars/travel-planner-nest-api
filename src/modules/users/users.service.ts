import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { FindOptionsWhere } from 'typeorm';
import { DataSource } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.dataSource.query(
      `SELECT id FROM users 
      WHERE email = $1`,
      [createUserDto.email],
    );

    if (existingUser.length > 0) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    const result = await this.dataSource.query(
      `INSERT INTO users (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email, role, provider`,
      [createUserDto.username, createUserDto.email, hashedPassword],
    );

    return result[0];
  }

  async findAll() {
    const users = await this.dataSource.query(
      `SELECT id, username, email, role, provider 
      FROM users`,
    );
    return users;
  }

  async findOne(payload: FindOptionsWhere<User>) {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    Object.entries(payload).forEach(([key, value]) => {
      conditions.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    });

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await this.dataSource.query(
      `SELECT id, username, email, role, provider 
      FROM users 
      ${whereClause} LIMIT 1`,
      params,
    );

    return result[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.dataSource.query(
      `SELECT id FROM users WHERE id = $1`,
      [id],
    );

    if (!user.length) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const sets = [];
    const params = [id];
    let paramIndex = 2;

    Object.entries(updateUserDto).forEach(([key, value]) => {
      if (value !== undefined) {
        sets.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    });

    if (!sets.length) {
      const currentUser = await this.dataSource.query(
        `SELECT id, username, email, role, provider 
        FROM users 
        WHERE id = $1`,
        [id],
      );
      return currentUser[0];
    }

    const result = await this.dataSource.query(
      `UPDATE users 
      SET ${sets.join(', ')} 
      WHERE id = $1 
      RETURNING id, username, email, role, provider`,
      params,
    );

    return result?.[0]?.[0];
  }

  async remove(id: number) {
    await this.dataSource.query(
      `DELETE FROM users 
      WHERE id = $1 
      RETURNING id, username, email, role, provider`,
      [id],
    );
    return { success: true };
  }
}
