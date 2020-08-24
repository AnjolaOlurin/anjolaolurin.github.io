import { ConflictException } from '@nestjs/common';

export class EmailConflictException extends ConflictException {
  constructor() {
    super('Email or phone number already in use.');
  }
}
