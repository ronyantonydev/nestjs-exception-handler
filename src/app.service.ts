import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    throw new RpcException('Test rpc exception');
    // In case of microservices, We can either throw a rpc exception or even if we didn't handle
    // the exception, it will be caught by the exception filter
    //return 'Hello World!';
  }
}
