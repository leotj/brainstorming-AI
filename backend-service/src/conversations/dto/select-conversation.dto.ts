import { IsNotEmpty, IsString } from 'class-validator';

export class SelectConversationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
