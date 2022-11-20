import axios from "axios";
import { useEffect, useState } from "react";

import getKey from "./key";

const SearchResults = ({countries, searchText}) => {  
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(searchText.toLowerCase()))
  
  if (searchText === '') { return <p>Search for a country</p> }
  else if (filteredCountries.length > 10) { return <p>Too many matches, specify another filter</p> }
  else if (filteredCountries.length === 1) { return <RenderCountry country={filteredCountries[0]}/> }
  else { return filteredCountries.map(country => { return <RenderCountries country={country} countries={countries}/> }) }
}

const RenderCountries = ({country}) => {
  const [detailsToggle,setDetailsToggle] = useState(false);
  const handleToggle = () => { setDetailsToggle(!detailsToggle) }
  
  return (
    <div>
      <div>
        {!detailsToggle && country.name.common}        
        {detailsToggle && <RenderCountry country={country}/>}
        <button onClick={handleToggle}>{detailsToggle ? 'Hide' : 'Show'}</button>
      </div>
    </div>
  )
}

const RenderCountry = ({country}) => {
  const api = getKey()
  const [weatherIcon, setWeatherIcon] = useState("")
  const [wind, setWind] = useState("")
  const [temperature, setTemperature] = useState(0)

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${api}`)
      .then(response => {
        setWeatherIcon(response.data.weather[0].icon)
        setWind(response.data.wind)
        setTemperature(response.data.main.temp)
      })
  }, [])
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>{Object.entries(country.languages).map(([key, value]) => { return <li key={key}>{value}</li> } )}</ul>
      <img src={country.flags.png} />
      <h2>Weather in {country.name.common}</h2>
      <p>temperature: {temperature.toFixed(0)}</p>
      <img src={`http://openweathermap.org/img/w/${weatherIcon}.png`} />
      <p>wind {wind.speed} m/s</p>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')
  const handleSearchText = (event) => {setSearchText(event.target.value)}

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countries = response.data  
        setCountries(countries)
      })
  }, [])    

  return (
    <div>
      <input placeholder="Enter a country" value={searchText} onChange={handleSearchText}/>     
      <SearchResults countries={countries} searchText={searchText}/>               
    </div>
  );
}

export default App;
