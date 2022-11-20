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
  const [location, setLocation] = useState([])

  const handleToggle = () => {
    setDetailsToggle(!detailsToggle)
  }
  
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
  const [weather, setWeather] = useState([])
  const [weatherIcon, setWeatherIcon] = useState("")

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${api}`)
      .then(response => {
        console.log("Response", response.data)
        setWeather(response.data.weather)
        setWeatherIcon(response.data.weather[0].icon)
      })
  }, [])
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>{country.capital}</p>
      <p>{country.area}</p>

      <h2>languages:</h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => { return <li key={key}>{value}</li> } )}
      </ul>
      <img src={country.flags.png} />
      <h2>Weather in {country.name.common}</h2>
      <p>temperature: </p>
      {console.log("Weather", weather)}
      <img src={`http://openweathermap.org/img/w/${weatherIcon}.png`} />

    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countries = response.data  
        setCountries(countries)
      })
  }, [])

  const handleSearchText = (event) => {
    setSearchText(event.target.value)
  }  

  return (
    <div>
      <input placeholder="Enter a country" value={searchText} onChange={handleSearchText}/>     
      <SearchResults countries={countries} searchText={searchText}/>               
    </div>
  );
}

export default App;
