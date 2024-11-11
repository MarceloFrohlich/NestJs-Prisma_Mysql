import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user-dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put-user-dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user-dto";
import * as bcrypt from 'bcrypt'

@Injectable()

export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateUserDTO) {

        const salt =  await bcrypt.genSalt()
        data.password = await bcrypt.hash(data.password, salt)

        return this.prisma.users.create({
            data,
        })
    }

    async getAll() {
        return this.prisma.users.findMany()
    }

    async getById(id: number) {
        await this.exists(id)
        return this.prisma.users.findUnique({
            where: {
                id
            }
        })
    }

    async update({ birthAt, email, name, password, role }: UpdatePutUserDTO, id: number) {
        await this.exists(id)

        const salt =  await bcrypt.genSalt()
        password = await bcrypt.hash(password, salt)

        return this.prisma.users.update({
            where: { id },
            data: { birthAt: birthAt ? new Date(birthAt) : null, email, name, password, role }
        })
    }

    async updatePartial({ birthAt, email, name, password, role }: UpdatePatchUserDTO, id: number) {
        await this.exists(id)

        const data: any = {}

        if (birthAt) {
            data.birthAt = new Date(birthAt)
        }
        if (email) {
            data.email = email
        }
        if (name) {
            data.name = name
        }
        if (password) {
            const salt =  await bcrypt.genSalt()
            data.password = await bcrypt.hash(password, salt)
        }

        if(role){
            data.role = role
        }

        return this.prisma.users.update({
            where: {
                id
            },
            data
        })
    }

    async deleteUser(id: number) {
        await this.exists(id)

        return this.prisma.users.delete({
            where: { id }
        })
    }


    async exists(id: number){
        if (!(await this.prisma.users.count({
            where:{
                id
            }
        }))) {
            throw new NotFoundException(`O usuário ${id} não existe`)
        }
    }
}