import { useEffect, useState } from "react"



export const Card = () => {


// Estados
  const [continente, setContinente] = useState('')
  const [ciudades, setCiudades] = useState([])
  const [timeZone, seTimeZone] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isLoandingTimeZone, setIsLoandingTimeZone] = useState(false)
  const [item, setItem] = useState('')
  
// Fetch para llamar una lista de la ciudades de un continente
  const fetchData = async (value) => {

    try {
    const response = await fetch('/api/api/TimeZone/AvailableTimeZones')
    const data = await response.json()
    let informacion = []

    switch(value){
      case 'Africa':
        informacion = data.filter(item => item.includes('Africa'))
        informacion = informacion.map(item => item.slice(7))
        setContinente(value)
        setCiudades(informacion)
        setisLoading(true)
        break
      
      case 'America':   
        informacion = data.filter(item => item.includes('America'))
        informacion = informacion.map(item => item.slice(8))
        setContinente(value)
        setCiudades(informacion)
        setisLoading(true)
        break
    
      case 'Europe':   
        informacion = data.filter(item => item.includes('Europe'))
        informacion = informacion.map(item => item.slice(7))
        setContinente(value)
        setCiudades(informacion)
        setisLoading(true)
        break

      case 'Asia':   
        let informacion = data.filter(item => item.includes('Asia'))
        informacion = informacion.map(item => item.slice(5))
        setContinente(value)
        setCiudades(informacion)
        setisLoading(true)
        break
      
      default:
        setContinente('')
        setCiudades([])
        setisLoading(false)

        setIsLoandingTimeZone(false)
    }


    } catch (error) {
      console.error('Ha ocurrido un error, verifique que esta bien escrito el nombre de la ciudad', error)
    }
  }


  // Setea el continente seleccionado del select
  const onInputChange = ({ target }) => {
    const value = target.value
    console.log(value)
    if(target.name === 'Continente'){
      fetchData(value)
    }
  }

  // Fetch para obtener los datos de zona horaria de una ciudad en especifico
  const fetchTimezone = async(item) => {

    try {
      const response = await fetch(`/api/api/Time/current/zone?timeZone=${continente}/${item}`)

      console.log(continente)
      console.log(item)

      const data = await response.json()
      console.log(data)

      setItem(item)
      seTimeZone(data)
      setIsLoandingTimeZone(true)
      
    } catch (error) {
      console.error('Ocurrio un error con la consulta del horario de la ciudad, vuelva más tarde. Error:', error)
    }

  }

// Llama al fetch de zona horaria cuando se hace click en un elemento <li>
  const onClickLi = (item) =>{
    fetchTimezone(item)
  }

// Se utiliza para actualizar la zona horaria en tiempo real realizando llamadas a la api
// cada 1 segundo
  useEffect(() => {
    let intervalId;
    if (item) {
      intervalId = setInterval(() => {
        fetchTimezone(item);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [item]);
  

  

// Componente
  return (
    <div className='container'>
      <div className="Cont">
        <h1>Zona Horaria Mundial</h1>
        <hr />
        <h2>Ingresa una ciudad</h2>
        <div className="entry">
      

            <select name="Continente" className="form-control" onChange={onInputChange}  id="">
              <option value="">Seleccione un continente</option>
              <option value="Africa">Africa</option>
              <option value="America">América</option>
              <option value="Europe">Europa</option>
              <option value="Asia">Asia</option>
            </select>


            {isLoading && 
            
            <div className="city">
              <ul>
                {ciudades.map(item => (<li value={item} onClick={()=> onClickLi(item)}>{item}</li>))} 
              </ul>
            </div> }
  
        </div>
      </div>

      <div className="image">
            
          {isLoandingTimeZone && 
          
          <div className="timeZone">
            <div className="informationTimeZone">
            <h1 className='inf'>🗺️Localización: {timeZone.timeZone}</h1>
            <h3 className='inf'>📅Fecha: {timeZone.date}</h3>
            <h3 className='inf'>Día de la Semana: {timeZone.dayOfWeek}</h3>
            <h2 className='inf'>🕓{timeZone.hour} : {timeZone.minute} : {timeZone.seconds}</h2>
            </div>
          </div> }

      </div>

    </div>
  )
}
