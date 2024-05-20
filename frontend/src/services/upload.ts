import {ApiUploadResponse, type Data} from "../types"
import {API_HOST } from '../config'

export const uploadFile = async (file: File): Promise<[Error?, Data?]> =>{
    const fromData = new FormData()
    fromData.append('file',file)

    try {
        const res = await fetch(`${API_HOST}/api/files`,{
            method:'POST',
            body:fromData
        })

        if (!res.ok)    return [new Error(`error uploading file ${res.statusText}`)]    
        
        //obtenemos el json
        const json = await res.json() as ApiUploadResponse
        return [ undefined ,json.data]


    } catch (error) {
        if (error instanceof Error ) return [error]
       
    }


    return [new Error('unknown error')]

}