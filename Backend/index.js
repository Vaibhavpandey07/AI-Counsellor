import {app} from './src/app.js'
import {env} from './src/utlis/getEnvVariable.util.js'
import {connection} from './src/db/connection.db.js'
import { countries } from './constant.js'
import { getUniversitiesData } from './src/externalApi/university.api.js'

connection().then(()=>{
    // countries.forEach(async(element)=>{
    //     await getUniversitiesData(element.country,element.countryCode);
    // })

    app.listen(env.PORT,"0.0.0.0",()=>{
        console.log(`server running at http://127.0.0.1:${env.PORT}`);
    })
}).catch((err)=>{
    console.log("Can not connect to the dataBase",err);
})
    