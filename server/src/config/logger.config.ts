import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  redact: {
    paths: [
      'password',
      'confirmPassword',
      'newPassword',
      'oldPassword',
      'token',
      'accessToken',
      'refreshToken',
      'resetPasswordToken',
      'authorization',
      'req.headers.authorization',
      '*.password',
      '*.token'
    ],
    censor: '[REDACTED]'
  },
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    : undefined
});

export default logger;
