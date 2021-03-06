

const daysOfWeekMap = {
    0: 'SUN',
    1: 'MON',
    2: 'TUES',
    3: 'WED',
    4: 'THUR',
    5: 'FRI',
    6: 'SAT'
};

const iconNameToSizeMap = {
    Clouds: {
        condition: 'cloudy',
        size: { width: 264, height: 166 }
    },
    Clear: {
        condition: 'sunny',
        size: { width: 208, height: 213 },
    },
    Thunderstorm: {
        condition: 'stormy',
        size: { width: 246, height: 187 },
    },
    Snow: {
        condition: 'snowy',
        size: { width: 230, height: 196 },
    },
    //
    Rain: {
        condition: 'rainy',
        size: { width: 160, height: 222 },
    }
    ,
    PartlyCloudy: {
        condition: 'partly-cloudy',
        size: { width: 230, height: 209 },
    }
};

const template = document.querySelector('#day-template');
const wrapper = document.querySelector('.wrapper');



const getWeather = async (city) => {

    const response = await fetch('/.netlify/functions/weather', {
        method: 'POST',
        body: JSON.stringify({
            query: city,
        }),
    })
        .then((res) => res.json())
        .catch((err) => console.error(err));

    // console.log(response);

    response.list.forEach((day) => {
        const clone = template.content.cloneNode(true);
        /*
          <div class="day-of-week">Wed</div>
          <div class="date">8</div>
        */
        // console.log(day.day);
        const split = day.day.split(' ');
        const dayOfWeek = clone.querySelector('.day-of-week');
        dayOfWeek.textContent = split[0];
        const date = clone.querySelector('.date');
        date.textContent = split[1];

        /*
         <div class="bar cloudy">
        */
        const bar = clone.querySelector('.bar');
        const main = day?.weather[0]?.main || 'Clear';
        const description = day?.weather[0]?.description;
        // console.log(iconNameToSizeMap[main]);
        let icon = iconNameToSizeMap[main];
        if (main === 'Clouds' && description !== 'overcast clouds') {
            icon = iconNameToSizeMap['PartlyCloudy'];
        }
        bar.classList.add(icon?.condition);


        /*
        <div class="temperature">72<span class="degrees">&deg;</span>
        </div>
        */

        const temperature = clone.querySelector('.temperature');
        temperature.textContent = `${day.temp.day.toFixed(0)}${String.fromCharCode(176)}`;

        /*
         <use xlink:href="#cloudy" width="264" height="166" viewBox="0 0 264 166"></use>
        */

        const use = clone.querySelector('use');
        use.setAttribute('xlink:href', `#${icon.condition}`);
        use.setAttribute('width', icon.size.width);
        use.setAttribute('height', icon.size.height);
        use.setAttribute('viewBox', `0 0 ${icon.size.width} ${icon.size.height}`);

        /*
        <span class="low-value">28&deg;</span>
        */

        const lowValue = clone.querySelector('.low-value');
        lowValue.textContent = `${day.temp.min.toFixed(0)}${String.fromCharCode(176)}`;

        /*
        <span class="high-value">82&deg;</span>
        */

        const highValue = clone.querySelector('.high-value');
        highValue.textContent = `${day.temp.max.toFixed(0)}${String.fromCharCode(176)}`;

        wrapper.appendChild(clone);
    });
};

getWeather('New York');