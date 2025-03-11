import { IsNotEmpty, IsString } from 'class-validator';

export class InitiateConversationRequestDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class InitiateConversationResponseDto {
  @IsString()
  @IsNotEmpty()
  response: string;
}
