const generate = document.querySelector("#generate");
const zip = document.querySelector("#zip");
const feelings = document.querySelector("#feelings");
const tempfah = document.querySelector("#temp-fah");
const tempcel = document.querySelector("#temp-cel");
const datenow = document.querySelector("#date-update");
const feeling = document.querySelector("#feeling");
const country = document.querySelector("#country");
const errormessage = document.querySelector("#error");

const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apikey = "&appid=e87fb74f0783eeeac3ef49a551d0c761&units=imperial";

generate.addEventListener("click", (event) => {
  event.preventDefault();
  const finalURL = `${baseURL}${zip.value},${country.value}${apikey}`;
  getData(finalURL)
    .then((data) => curData(data))
    .then((info) => postData("/add", info))
    .then(() => retrieveData("/all"))
    .then((data) => updateUI(data))
    .catch((error) => {
      console.error("Error:", error);
      updateUI({
        error: "City not found or an error occurred. Please try again later.",
      });
    });
});

const getData = async (url) => {
  try {
    const result = await fetch(url);
    const data = await result.json();
    if (data.cod == 200) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

const curData = async (data) => {
  try {
    if (data && data.main && data.main.temp) {
      const info = {
        newDate: generateNewDate(),
        feelings: feelings.value,
        temp: {
          imperial: data.main.temp,
          metric: ((data.main.temp - 32) * 5) / 9,
        },
      };
      return info;
    } else {
      console.log("Invalid or missing data properties:", data);
      throw new Error("Invalid or missing data properties");
    }
  } catch (error) {
    console.error("Error in current Data:", error);
    throw error;
  }
};

const postData = async (url = "", data = {}) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

const retrieveData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in retrieveData:", error);
    throw error;
  }
};

const updateUI = (data) => {
  if (data.error) {
    errormessage.innerHTML = data.error;
  } else {
    datenow.innerHTML = `Today's date is ${data.newDate}`;
    tempfah.innerHTML = `Temperature in Fahrenheit: ${data.temp.imperial}`;
    tempcel.innerHTML = `Temperature in Celsius: ${data.temp.metric.toFixed(
      2
    )}`;
    feeling.innerHTML = data.feelings
      ? `Feelings: ${data.feelings}`
      : `Feelings: None`;
    document.querySelector("#error").innerHTML = "";
  }
};

const generateNewDate = () => {
  const d = new Date();
  return d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();
};
