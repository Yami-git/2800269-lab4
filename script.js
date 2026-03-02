const input = document.getElementById('country-input');
const searchButton = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderContainer = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

spinner.classList.add('hidden');


async function searchCountry(countryName) {
    try {
        errorMessage.textContent = '';
        countryInfo.innerHTML = '';
        borderContainer.innerHTML = '';
        spinner.classList.remove('hidden');
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital[0]}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="${country.name.common} flag">`;

        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderContainer.innerHTML += `
                    <div>
                        <img src="${borderCountry.flags.svg}" width="100" height="60">
                        <p>${borderCountry.name.common}</p>
                    </div>
                `;
            }

        }

    } catch (error) {
        errorMessage.textContent = "Unable to fetch country data. Please check the country name and try again.";
    } finally {
        spinner.classList.add('hidden');
    }
}

searchButton.addEventListener('click', () => {
    const countryName = input.value.trim();
    if (countryName) {
        searchCountry(countryName);
    }
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const country = input.value.trim();
        if (country) {
            searchCountry(country);
        }

    }
});