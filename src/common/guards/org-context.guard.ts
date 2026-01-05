import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class OrgContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const orgId = request.headers['x-organization-id'];

    if (!orgId) {
      throw new ForbiddenException(
        'x-organization-id header is required',
      );
    }

    request.organizationId = orgId;
    return true;
  }
}