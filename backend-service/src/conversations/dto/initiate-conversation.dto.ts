import { IsNotEmpty, IsString } from 'class-validator';

export class InitiateConversationDto {
  @IsString()
  @IsNotEmpty()
  userInput: string;
}
