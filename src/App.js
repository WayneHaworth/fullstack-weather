import axios from "axios";
import { useEffect, useState } from "react";

const SearchResults = ({countries, searchText}) => {
  
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(searchText.toLowerCase()))
  
  if (searchText === '') { return <p>Search for a country</p> }
  else if (filteredCountries.length > 10) { return <p>Too many matches, specify another filter</p> }
  else if (filteredCountries.length === 1) { return <RenderCountry country={filteredCountries[0]}/> }
  else { return filteredCountries.map(country => { return <RenderCountries country={country} countries={countries} searchText={searchText} /> }) }
}

const RenderCountries = ({country}) => {
  const [detailsToggle,setDetailsToggle] = useState(false);
  
  return (
    <div>
      <div key={country.name.cca3}>
        {country.name.common}  
        {/* note if toggle button is true, show below*/}

      </div>
    </div>
  )
}

const RenderCountry = ({country}) => {
  console.log(country)
  console.log(country.flags.png)
  return (
    <div key={country.name.common}>
      <h1>{country.name.common}</h1>
      <p>{country.capital}</p>
      <p>{country.area}</p>

      <h2>languages:</h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => { return <li key={key}>{value}</li> } )}
      </ul>
      <img src={country.flags.png} />
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
