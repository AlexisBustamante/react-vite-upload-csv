import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';
import morgan from 'morgan';

//pnpm install @types/cors -D
//npm i --save-dev @types/express

const app = express() ;
const port = process.env.PORT ?? 3000 ;

const storage = multer.memoryStorage();
const upload = multer({storage});

let UserData:Array<Record<string, string >>

app.use(express.json());
app.use(cors())//enable CORSE
app.use(morgan('dev'));

app.listen(port, ()=>{
    console.log('running on',port)
})

app.post('/api/files', upload.single('file') ,async(req , res)=>{
    const {file} = req
    //console.log(file);
    if (!file) {
        return res.status(500).json({message:'file is required'})
    }

    if (file.mimetype !== 'text/csv') {
        return res.status(500).json({message:'file must be CSV'})
    }

    let json: Array<Record<string,string >> = [] ;
    
    try {
        //se lee archivo convirtiendo de binario a texto
        const rawCsv = Buffer.from(file.buffer).toString('utf-8')
        //console.log(rawCsv)
        json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)//el separador le decimos que es , pero por defecto es ;

    } catch (error) {
                return res.status(500).json({message:'Ocurrio un error', error})
    }

    
    UserData = json 
    console.log("user DATA ?=======?==== ",UserData );
    return res.status(200).json({data:UserData, message:'el archivo se cargó correctamente.'})

})
app.get('/api/users', async(req, res)=>{
    
    const { q } = req.query
    if (!q) {
        return res.status(500).json({message:'query params is required.'});
    }
    if (Array.isArray(q)) {
        return res.status(500).json({
            message:'Query param  must be a string'
        })
    }
    
    const search = q.toString().toLowerCase();

    const filterdata = UserData.filter((row)=>{
        return Object
        .values(row)
        .some(value => value.toLocaleLowerCase().includes(search))
    })
    //console.log(UserData);
    return res.status(200).json({data:filterdata})
    
})
