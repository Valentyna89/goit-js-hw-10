import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
};

refs.input.addEventListener('input', debounce(onInputClick, DEBOUNCE_DELAY));

function onInputClick(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();

  if (!inputValue) {
    refs.list.innerHTML = '';
    return;
  }
  fetchCountries(inputValue)
    .then(data => {
      if (data.length > 10) {
        refs.list.innerHTML = '';
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length > 1 && data.length < 11) {
        refs.list.innerHTML = '';
        refs.list.insertAdjacentHTML('beforeend', createList(data));
      }
      if (data.length === 1) {
        refs.list.innerHTML = '';
        refs.list.insertAdjacentHTML('beforeend', createMarkup(data[0]));
      }
      if (!data.length) {
        return Notiflix.Notify.failure(
          'Oops, there is no country with that name'
        );
      }
    })
    .catch(err => {
      refs.list.innerHTML = '';
      if (err.message === '404') {
        return Notiflix.Notify.failure(
          'Oops, there is no country with that name'
        );
      }
    });
}

function createMarkup({ name, capital, population, languages, flags }) {
  const langs = Object.values(languages).join(', ');
  return `
    <li class='list-elem'>
        <div class='country-name'>
            <img src='${flags.png}' alt='flag' width='77' />
            <h1 class='country-name'>${name.official}</h1>
        </div>
        <div class='country-info'>
            <p><span>Capital: </span>${capital}</p>
            <p><span>Population: </span>${population}</p>
            <p><span>Languages: </span>${langs}</p>
        </div>
    </li>
    `;
}

function createList(countries) {
  return countries
    .map(
      ({ flags, name }) =>
        `<li class="item">
              <img src="${flags.svg}" alt="${name.common}" width="50"/>
              <p class="txt">${name.official}</p>
          </li>\n`
    )
    .join('');
}

Notiflix.Notify.init({
  className: 'notify',
  width: '280px',
  position: 'left-top',
});
