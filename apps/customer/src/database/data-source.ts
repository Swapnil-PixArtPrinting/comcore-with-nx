import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { dataSourceOptions } from '../config/typeorm.config';
dotenv.config();

export const AppDataSource = new DataSource(dataSourceOptions);
