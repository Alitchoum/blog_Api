import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginatedQueryDto {
  @ApiProperty({ type: Number, required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  currentPage: number = 1;

  @ApiProperty({ type: Number, required: false, default: 5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;

  @ApiProperty({ enum: SortDirection, required: false, default: 'DESC' })
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection: SortDirection = SortDirection.DESC;

  @ApiProperty({ type: String, required: false, default: '_id' })
  @IsOptional()
  @IsString()
  sortBy: string = '_id'; //par default tri par id

  //PROPRIÉTÉS CALCULÉES (GETTERS)
  protected get MongoDbSortDirection(): 1 | -1 {
    return this.sortDirection === SortDirection.ASC ? 1 : -1; // comparaison entre la requete user et enum de tri
  }

  get toMongoDbSort(): { [key: string]: -1 | 1 } {
    return { [this.sortBy]: this.MongoDbSortDirection }; //Retourne l'objet ex: title : -1 (
  }

  //Elements à afficher par page en fonction de la page current déclarée
  get skip(): number {
    return (this.currentPage - 1) * this.limit;
  }
}
