import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { OwnerKeyGuard } from "../../auth/owner-key.guard.js";
import { WorkspacesService } from "./workspaces.service.js";
import { CreateWorkspaceDto, UpdateWorkspaceDto, ImportWorkspaceDto } from "./dto/workspace.dto.js";

@Controller("workspaces")
@UseGuards(OwnerKeyGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  list(@Req() req: Request) {
    return this.workspacesService.list((req as any).ownerKey);
  }

  @Get(":id")
  get(@Param("id") id: string, @Req() req: Request) {
    return this.workspacesService.get(id, (req as any).ownerKey);
  }

  @Post()
  create(@Body() dto: CreateWorkspaceDto, @Req() req: Request) {
    return this.workspacesService.create((req as any).ownerKey, dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateWorkspaceDto, @Req() req: Request) {
    return this.workspacesService.update(id, (req as any).ownerKey, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string, @Req() req: Request) {
    return this.workspacesService.remove(id, (req as any).ownerKey);
  }

  @Post("import")
  import(@Body() dto: ImportWorkspaceDto, @Req() req: Request) {
    return this.workspacesService.import((req as any).ownerKey, dto);
  }

  @Get(":id/export")
  export(@Param("id") id: string, @Req() req: Request) {
    return this.workspacesService.export(id, (req as any).ownerKey);
  }
}
