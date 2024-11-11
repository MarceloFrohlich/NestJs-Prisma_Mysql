import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user-dto";
import { UpdatePutUserDTO } from "./dto/update-put-user-dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user-dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { SkipThrottle, ThrottlerGuard } from "@nestjs/throttler";

@Roles(Role.Admin) // Permissionamento de usuário
@UseGuards(ThrottlerGuard, AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller("users")

export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data)
    }

    @SkipThrottle() // Ignora o throttler
    @Get()
    async getAll() {
        return this.userService.getAll()
    }

    @Get(":id")
    async getById(@ParamId() id: number) {
        return this.userService.getById(id)
    }

    @Put(":id")
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(data, id)
    }

    @Patch(":id")
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(data, id)
    }

    @Delete(":id")
    async deleteUser(@ParamId() id) {
        return this.userService.deleteUser(id)
    }
}