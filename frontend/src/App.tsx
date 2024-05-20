import React, { useState } from 'react'
import './App.css'
import { uploadFile } from './services/upload'
import { Toaster, toast} from 'sonner'
import {type Data} from './types'
import { Search } from './steps/Search'

const APP_STATUS = {
  IDLE:'idle',//al entrar
  ERROR:'error',//al error
  READY_UPLOAD:'ready_upload',//cuando
  UPLOADING:'uploading',//al elegir el archivo
  READY_USAGE:'ready_usage'
} as const 

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir Archivo',
  [APP_STATUS.UPLOADING]:'subiendo...'
}

type appStatusType = typeof APP_STATUS[keyof typeof APP_STATUS] 

function App() {
  const [appStatus, setAppStatus] = useState(APP_STATUS.IDLE)
  const [file,setFile] = useState<File | null>(null)
  const [data, setData] = useState<Data>([])

  const [count, setCount] = useState(0)

  const showButton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  const showInput = appStatus !== APP_STATUS.READY_USAGE 


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {   
        const [file] = event.target.files ?? [];
        console.log(file)
        if (file) {
          setFile(file)
          setAppStatus(APP_STATUS.READY_UPLOAD)
        }
     
      }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault()
    
    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
        return 
    }
    setAppStatus(APP_STATUS.UPLOADING)

    const [err,newData] = await uploadFile(file)

    console.log("=== RESPUESTA BACKEND ====",newData);

    if (err) {
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }
    
    setAppStatus(APP_STATUS.READY_USAGE)
    if(newData) setData(newData)
    toast.success('Archivo subido correctamente.')
    setAppStatus(APP_STATUS.READY_UPLOAD)
    //setFile(File['name'])


  }
  
  return (
    <>
      <Toaster></Toaster>

      <h4>Challange: Upload CSV Search</h4>
      <div>

      {
        showInput && (
          <form onSubmit={handleSubmit}>
          <label htmlFor=""><input 
          disabled={appStatus === APP_STATUS.UPLOADING}
          type="file" onChange={handleInputChange} name="" id="" accept=',csv'/></label>
          {showButton && ( 
          <button 
          disabled={appStatus === APP_STATUS.UPLOADING}
          >{BUTTON_TEXT[appStatus]}</button>)}
       
        </form>
        )
      }

      {
        appStatus !== APP_STATUS.READY_USAGE && (
          <Search initialData={data}></Search>
        )
      }


    
      
      </div>
    </>
  )
}

export default App
