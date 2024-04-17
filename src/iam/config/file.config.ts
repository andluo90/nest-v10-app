import {registerAs} from '@nestjs/config'

export default registerAs('file',()=>{

    
    let value = ''
    if(process.env.NODE_ENV === 'production'){
        value = process.env.MUSIC_DIRCTORY_PRD
    }else{
        value = process.env.MUSIC_DIRCTORY_DEV
    }

    console.log(`MUSIC_DIRCTORY:`,value);
    

    return {
        musciDirectory:value,
    }
})