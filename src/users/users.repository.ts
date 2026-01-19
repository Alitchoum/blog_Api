import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.userModel
      .findById(id)
      .orFail(new NotFoundException('user not found'))
      .exec();
  }

  async updateUser(
    id: string,
    updateData: Partial<User>,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .orFail(new NotFoundException('user not found'))
      .exec();
  }

  async deleteUser(id: string): Promise<UserDocument> {
    return this.userModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('user not found'))
      .exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
