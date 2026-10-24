const weatherApi = "https://api.weather.gov/alerts/active?area="

//Your code here
  
// display the api title, number of alerts, and each alert headline
function displayAlerts(data) {
  const alertsDisplay = document.getElementById("alerts-display")
  const summary = document.createElement("p")
  const alertList = document.createElement("ul")

  // use the title and features array to create a summary
  summary.textContent = `${data.title}: ${data.features.length}`

  // replace old results so only the latest alerts are shown
  alertsDisplay.replaceChildren(summary, alertList)

  // add each available headline as a separate list item
  data.features.forEach((alert) => {
    const headline = alert.properties?.headline

    if (headline) {
      const item = document.createElement("li")
      item.textContent = headline
      alertList.appendChild(item)
    }
  })
}

// fetch active weather alerts for the state abbreviation
async function fetchWeatherAlerts(state) {
  // add the state code to the weather alerts api url
  const response = await fetch(`${weatherApi}${state}`)

  // treat unsuccessful http responses as request errors
  if (!response.ok) {
    throw new Error(`weather alerts request failed (${response.status})`)
  }

  // parse the response body as json
  const data = await response.json()

  // check that the response contains the fields needed to display alerts
  if (typeof data.title !== "string" || !Array.isArray(data.features)) {
    throw new Error("the weather alerts response was invalid")
  }

  return data
}

// connect the input, button, and display elements after the page loads
document.addEventListener("DOMContentLoaded", () => {
  const stateInput = document.getElementById("state-input")
  const fetchButton = document.getElementById("fetch-alerts")
  const alertsDisplay = document.getElementById("alerts-display")
  const errorMessage = document.getElementById("error-message")

  fetchButton.addEventListener("click", () => {
    // read the state code and clear the input for the next search
    const state = stateInput.value.trim()
    stateInput.value = ""

    // remove old alerts and hide any previous error
    alertsDisplay.replaceChildren()
    errorMessage.textContent = ""
    errorMessage.classList.add("hidden")

    // check that the state code contains two uppercase letters
    if (!/^[A-Z]{2}$/.test(state)) {
      errorMessage.textContent = "Enter a valid two-letter state abbreviation in uppercase."
      errorMessage.classList.remove("hidden")
      return
    }

    // display the new alerts when the request succeeds
    fetchWeatherAlerts(state)
      .then(displayAlerts)
      // show network and api errors in the dedicated error container
      .catch((error) => {
        console.log(error.message)
        errorMessage.textContent = error.message
        errorMessage.classList.remove("hidden")
      })
  })
})
 
