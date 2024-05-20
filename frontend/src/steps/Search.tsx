import { useEffect, useState } from "react"
import { Data } from "../types";
import { searchData } from "../services/search";
import { toast} from 'sonner'
import {  useDebounce } from "@uidotdev/usehooks"


const DEBOUNCE_TIME = 500

export const Search = ({ initialData }: { initialData: Data }) => {
    const [data, setData] = useState<Data>(initialData)

    const [search, setSearch] = useState<string>(() =>{
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const debounceSearch = useDebounce(search, DEBOUNCE_TIME)

    useEffect(()=>{
        const newPathname = debounceSearch === '' 
        ? window.location.pathname 
        : `?q=${debounceSearch}`
        window.history.pushState({}, '',newPathname)
    },[debounceSearch])

    useEffect(()=>{
        //llamar a api para filtrar los resultados.

        if (!debounceSearch) {
            setData(initialData)
            return
        }

       searchData(debounceSearch)
       .then(response => {
        const [err,newData] = response
        if (err) {
           toast.error(err.message)
           return 
        }
        if (newData) setData(newData)
       })
    },[debounceSearch, initialData])


    return (
        <div>
            <h1>Search </h1>
            <form action="" method="post">
            <input type="search" placeholder="buscar informacion..."
            onChange={handleSearch}
            />

            </form>
            <ul>
                {
                 data.map((row,index) => (

                    <li key={row.id}>
                        <article>
                          {Object
                          .entries(row)
                          .map(([key, value]) => <p key={key}><strong>{key}: </strong> {value}</p> )}
                        </article>
                    </li>

                 ) )
                }
            </ul>
        </div>
    )
}