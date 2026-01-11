import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class SilentLogger extends ConsoleLogger {
  // These are the contexts you want to ignore
  private static readonly HIDDEN_CONTEXTS = [
    'InstanceLoader',
    'RoutesResolver',
    'RouterExplorer',
    'NestFactory',
  ];

  log(message: any, context?: string) {
    if (context && SilentLogger.HIDDEN_CONTEXTS.includes(context)) return;
    super.log(message, context);
  }
}