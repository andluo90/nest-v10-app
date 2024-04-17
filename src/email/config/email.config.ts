import { registerAs } from '@nestjs/config';

interface EmailConfig {
  username:string
  password:string
  from:string
  to:string
}

export {
    EmailConfig
}

export default registerAs('email', ():EmailConfig => {
    return {
        username: process.env.EMAIL_NAME || '',
        password:process.env.EMAIL_PASSWORD || '',
        from:process.env.EMAIL_FROM || '',
        to:process.env.EMAIL_TO || ''
    } 
}
);
