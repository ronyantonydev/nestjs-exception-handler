import * as winston from 'winston';
import 'winston-daily-rotate-file';

const customLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};

const transport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  dirname: './logs',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '5m',
  maxFiles: 5,
});

const moduleName = 'Test Module';
let methodName: string;

const alignColorsAndTime = winston.format.combine(
  winston.format.timestamp({
    format: 'YY-MM-DD HH:MM:SS',
  }),
  winston.format.printf(
    ({ level, message, context, timestamp, stack, trace }) => {
      let err_msg = message.slice(
        message.indexOf('{'),
        message.lastIndexOf('}'),
      );
      let msg = err_msg.split(',');
      msg.filter((data) => {
        if (data.includes('methodName')) {
          methodName = data;
        }
      });
      if (!methodName) {
        methodName = 'Unknown Method';
      }
      return ` [${moduleName}] [${methodName}] : [${message}] [${timestamp}]`;
    },
  ),
);

const winstonConfig = {
  format: winston.format.combine(
    winston.format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    winston.format.align(),
    winston.format.errors({ stack: true }),
    winston.format.prettyPrint(),
    winston.format.simple(),
    winston.format.splat(),
    alignColorsAndTime,
  ),
  transports: [transport],
  levels: customLevels,
  level: 'info',
};

export default winstonConfig;
