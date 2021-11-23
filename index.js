import axios from "axios";
import { EROFS } from "constants";

//receiving data from 2 asynchronoys sources:

//fixer.io (api key, data needed to calculate the exchange rates)
//https://fixer.io/
const fixerAPIKEY = "5af8eb4d9d0a4182b941961302953010";

const fixerAPI = `http://data.fixer.io/api/latest?access_key=${fixerAPIKEY}`;

//rest_currency (api, this api will give us the country/ies name in which we can use for our currency)
const restCOUNTRIESAPI = `https://restcountries.com/v3.1/currency`;

//async/await
//async function returns promises they do not return values
//e.g;

/* //run this code on quokka
const add = async (a , b) => {
    return a + b;
}

add(3, 42) 

console.log(add(1,2)); */

//----------------------
//will be making 3 functions which will be demonstrating async and await

//fetch data about currencies, rates of currencies

//below code goes synchronously if we don't use async and await, that's why we won't get response.data logged out,
// because the time our code reaches the log line, js didn't fetched the data by axios by that time, so we will logged undefined
//but then we use asunc and await, async makes it asynchronous and await tells the code to wait, so the ,get waits for js to gets to
//log line then it runs the .get method and we get our data logged out.

//we have try and catch method, where it acts as a succesfull block and error block, we put the code if it runs in try block
//and if it gives error then we will log out error from catch block, it is speciffically in async and await .
const getExchangeRate = async (fromCurrency, toCurrency) => {
  //const response = await axios.get(fixerAPI); //we gonna destructure it to get only the data and rates from the response
  //console.log(response)
  try {
    const {
      data: { rates },
    } = await axios.get(fixerAPI);

    console.log(rates);
    const dollar = 1 / rates[fromCurrency]; //giving me that 1 PKR is equal to how much dollar //here we are taking dollar as a base exhnage rate
    const exchangeRate = dollar * rates[toCurrency];

    return exchangeRate;
  } catch (error) {
    throw new Error(`Can't get currency ${fromCurrency} and ${toCurrency}`);
  }
};

//getExchangeRate("PKR", "USD"); //if value is not uppercase then api won't work

//fetch data about countries/ specific countries

//destructure the response in data, then we wanted just the name of the countries where dollars can be used.
//mapping over the all countries in data, so destructure just the name from the countries and just return the name

const getCountries = async (currencyCode) => {
  try {
    const { data } = await axios.get(`${restCOUNTRIESAPI}/${currencyCode}`);

    return data.map(({ name }) => name);
  } catch (error) {
    throw new Error(`error getting countries that use ${currencyCode}`);
  }
};

//getCountries('USD')

//convert function
//async function return promises, they don't return the data we want
// so we wait for the promise to be fulfilled to get the data
//like we are logging out countries without await keyword it will give us a promise not the actual data(countries name)
//so we then put await keyword after 'getCountries(toCurrency);' in => const countries = await getCountries(toCurrency); (like this)

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  fromCurrency = fromCurrency.toUpperCase(); //so it actually converts if the user inputs lower case. becuase lower case won't get response
  toCurrency = toCurrency.toUpperCase();

  /*  const countries = await getCountries(toCurrency); 
  const exchangeRate = await getExchangeRate(fromCurrency,toCurrency) */
  //As let's say I am on line 75 then I came to 81 so it waited to 2s their and then to line 82 again it await 2 second
  //when it reached the console.log the 4sec have passed and that is not ideal, so using promises we can await all the promises
  //at once simultaneously, so we get's only 2 second : like,

  const [exchangeRate, countries] = await Promise.all([
    getCountries(toCurrency),
    getExchangeRate(fromCurrency, toCurrency),
  ]);

  const convertedAmount = (amount * exchangeRate).toFixed(2);

  //console.log(countries); //countries are not an array , if we log it out we will get the promise if only await is not present before getCountries
  //console.log(exchangeRate); //as await is present so it return us the data not promise here

  return `${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}
    You can USE these in the following countries: ${countries}.`;
};

//so how do we call the above main return and getting the data from it not the promise as it is also an async function
//  it returned a promise only, and THAT promise returned that data. That's why we needed to attach a .then method to it

//so receive a value from a async function you can chain the .then and .catch 
//or we can use top level await, it only works at the top of the module.

/* convertCurrency("PKR", "USD", 10)
  .then((result) => console.log(result))
  .catch((err) => console.log(err)); */

const {result,error} = await convertCurrency('PKR','USD',10)
console.log(result);
console.log(error);