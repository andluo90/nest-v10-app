import {registerAs} from '@nestjs/config'

export default registerAs('audio',()=>{

    
    let value = ''
    if(process.env.NODE_ENV === 'production'){
        value = process.env.AUDIO_DIRCTORY_PRD
    }else{
        value = process.env.AUDIO_DIRCTORY_DEV
    }

    console.log(`AUDIO_DIRCTORY:`,value);
    

    return {
        audioDirectory:value,
    }
})