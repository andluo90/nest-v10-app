import { SetMetadata } from '@nestjs/common';

export const IsPublic = (arg: boolean) => {
    
    return SetMetadata('isPublic', arg)
};
