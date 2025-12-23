import { Global, Module } from '@nestjs/common';
import { TransactionRunner } from './runners/transaction.runner';

@Module({
  providers: [TransactionRunner],
  exports: [TransactionRunner],
})
export class TransactionModule {}
