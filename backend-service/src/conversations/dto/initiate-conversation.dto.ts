import { IsNotEmpty, IsString } from 'class-validator';

export class InitiateConversationDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
