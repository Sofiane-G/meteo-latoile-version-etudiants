// je doit me localiser

/*
// si nous avons pas accès a notre geoloc
 let latitude = 45.4275
let longitude = 4.4165 
// si nous avons accès
let latitude = coord.coords.latitude
let longitude = coord.coords.longitude
*/

// navigator.geolocation.getCurrentPosition((coord) => {
// console.log(coord)
let latitude = 45.4275
let longitude = 4.4165

let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,weather_code`

fetch(url)
    .then(rep => {
        return rep.json()
    })
    .then(data => {
        console.log(data)
        //afficher le temps du jour
        AfficheTempsDuJour(data.current.weather_code, data.current.temperature_2m)

        //changer l'arriere plan 
        arrierePlanBody(data.current.weather_code)

        // on affiche le temps des jours suivant
        afficheLesAutreJours(data.daily)
    })

// Role : affiche le temps et la temperature du jour
// dans la div qui a la classe CSS current :
// parametre : code et temperature
// return :  non

function AfficheTempsDuJour(code, temperature) {
    document.querySelector(".current").innerHTML = `
     <div class="picto-weather picto-${transformerCodeEnMot(code)}"></div>
                <p class="tmax">${temperature}°C</p>
                `
}

// role : transformer le code recu de l'api en un mot
// parametre : le code 
// return : le mot 

function transformerCodeEnMot(code) {
    if (code == 0) {
        // clear sky
        return "sun"
    } else if (code >= 1 && code < 45) {
        // partialy cloudy
        return "suncloud"
    } else if (code >= 45 && code < 61) {
        // foggy & cloudy
        return "cloud"
    } else if ((code >= 61 && code < 71) || (code >= 80 && code < 85)) {
        // Rainy
        return "rain"
    } else if ((code >= 71 && code < 77) || (code >= 85 && code < 95)) {
        // snow
        return "snow"
    } else if (code > 95) {
        // thunder
        return "thunder"
    } else {
        return "coucou"
    }
}

// role : je donne au body la bonne classe CSS pour afficher l'arriere plan
// parametre : code
// return : rien 

function arrierePlanBody(code) {
    let nomDeClasse = "bg-weather-" + transformerCodeEnMot(code)
    document.querySelector("body").classList.add(nomDeClasse)
}

// role : construire une petite carte pour le temps des jours suivant et de les afficher dans le document dans la div qui a la classe carrousel-daily-container
// parametre : meteo du jour, un objet 
// return : non 

function afficheLesAutreJours(meteoDesJour) {
    let template = ""
    for (let i = 1; i < 7; i++) {

        // je fabrique le picto
        let picto = transformerCodeEnMot(meteoDesJour.weather_code[i])
        //j'utilise i pour me balader dans les tableaux
        template += `<div class="dayly-weather">
                    <h4>${meteoDesJour.time[i]}</h4>
                    <div class="minipicto minipicto-${picto}"></div>
                    <h3 class="tmax">${meteoDesJour.temperature_2m_max[i]}°C</h3>
                    <h3 class="tmin">${meteoDesJour.temperature_2m_min[i]}°C</h3>  
                </div>`
    }

    document.querySelector(".carousel-daily-container").innerHTML = template

}