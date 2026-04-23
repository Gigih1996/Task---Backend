import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API root — basic metadata' })
  @ApiOkResponse({
    schema: {
      example: {
        name: 'Task Management API',
        status: 'ok',
        version: '1.0.0',
        endpoints: { tasks: '/api/tasks', docs: '/api/docs' }
      }
    }
  })
  root() {
    return {
      name: 'Task Management API',
      status: 'ok',
      version: '1.0.0',
      endpoints: {
        tasks: '/api/tasks',
        docs: '/api/docs'
      }
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    schema: {
      example: { status: 'ok', timestamp: '2026-04-23T03:57:32.809Z' }
    }
  })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
