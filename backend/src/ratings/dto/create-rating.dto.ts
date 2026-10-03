import {
  IsInt,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
