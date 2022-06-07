import './css/styles.css';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

refs = {
     countrySearch  : document.querySelector('#search-box'),
     countryList  :  document.querySelector('.country-list'),
     countryInfo  : document.querySelector('.country-info'),
};

refs.countrySearch.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));

function onCountrySearch() {
    const countryName = refs.countrySearch.value.trim();
    if (countryName.length == 0) {
      return (refs.countryList.innerHTML = '') , (refs.countryInfo.innerHTML = '');
    }
    if ( countryName ) {
      fetchCountries(countryName)
      .then(renderCountryList)
      .catch(error => {
        refs.countrySearch.value = "";
        Notify.failure('Oops, there is no country with that name');
        console.clear();
      })
    }
  }
  
  function renderCountryList(countrys) {
   // console.log(countrys);
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
     if (countrys.length > 10)  {
      Notify.info('Too many matches found. Please enter a more specific name.');
     }
     else if(countrys.length >= 2 && countrys.length <= 10) {
      const countryList = countrys.map((country) => 
          `<li class="country-list__item">
          <img class="country-list__img" src='${country.flags.svg}' alt='flag' width=35px height=20px/>
          <p class="country-list__name">${country.name.official}</p>
          </li>`
      ).join("");
  
      refs.countryList.insertAdjacentHTML("beforeend", countryList);
    } 
    else {
      const countryList = countrys.map((country) => 
      `<li class="country-list__item">
      <img class="country-list__img" src='${country.flags.svg}' alt='flag' width=40px height=25px/>
      <p class="country-list__nameone">${country.name.official}</p>
      </li>
      <p class="country-list__capital">Capital: ${country.capital[0]}</p>
      <p class="country-list__population">Population: ${country.population}</p>
      <p class="country-list__languages">Languages: ${Object.values(country.languages)}</p>
      </li>`
      ).join("");

      refs.countryInfo.insertAdjacentHTML("beforeend", countryList);
    }
  }
 