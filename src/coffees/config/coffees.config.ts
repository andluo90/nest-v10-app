import { registerAs } from '@nestjs/config';

interface Coffees {
  foo:string
}

export {
  Coffees
}

export default registerAs('coffees', ():Coffees => ({
  foo: 'bar',
}));
