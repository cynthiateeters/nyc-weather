const { default: axios } = require('axios');
const fetch = require('axios');
const moment = require('moment');

const getTime = (dt, timezone) => {
  const timezoneInMinutes = timezone / 60;
  const currTime = moment
    .unix(dt)
    .utcOffset(timezoneInMinutes)
    .format('ddd D');
  return currTime;
};

exports.handler = async (event) => {
  const { query } = JSON.parse(event.body);

  WEATHER_API_KEY = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${query}&cnt=7&units=imperial&appid=${WEATHER_API_KEY}`;

  console.log(url);

  const response = await axios.get(url, {
    method: 'GET',
  })
    .then((response) => {
      let data = response.data;
      // console.log(data);
      // console.log(getTime(data.list[0].dt, data.city.timezone));
      data.list.forEach((item) => {
        const day = getTime(item.dt, data.city.timezone);
        item.day = day;
      });
      return data;
    })
    .catch((error) => console.log('error', error));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  };
};