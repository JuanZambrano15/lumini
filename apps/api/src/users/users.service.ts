import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateMeDto } from './dto/update-me.dto';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  hasParentPin: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Cuenta no encontrada');
    return this.toProfile(user);
  }

  async updateProfile(userId: string, dto: UpdateMeDto): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name?.trim() || null },
    });
    return this.toProfile(user);
  }

  private toProfile(user: {
    id: string;
    email: string;
    name: string | null;
    parentPinHash: string | null;
  }): UserProfile {
    // Nunca se exponen hashes: solo si el PIN está configurado.
    return { id: user.id, email: user.email, name: user.name, hasParentPin: !!user.parentPinHash };
  }
}
