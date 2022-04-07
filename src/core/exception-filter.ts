import { Catch, ArgumentsHost, HttpStatus, Inject } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger) {
    super();
  }
  catch(exception: any, host: ArgumentsHost) {
    let messageQueueContext: any = {};
    messageQueueContext = host.switchToRpc().getContext();
    this.logException(messageQueueContext, exception);
    return super.catch(new RpcException(exception.message), host);
  }

  logException(messageQueueContext: any, exception: any) {
    let methodName: string;
    if (messageQueueContext && messageQueueContext.getPattern()) {
      const pattern = String(messageQueueContext.getPattern()).split(':');
      if (pattern.length > 0) {
        const msgPattern = pattern[1];
        methodName = msgPattern.substring(
          msgPattern.indexOf('"') + 1,
          msgPattern.lastIndexOf('"'),
        );
      }
    }
    const responseBody = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      stack: exception.stack ? exception.stack : '',
      message: exception.message,
      methodName: methodName ? methodName : 'Test',
    };
    this.logger.logger.log('alert', `${JSON.stringify(responseBody)}`);
  }
}
