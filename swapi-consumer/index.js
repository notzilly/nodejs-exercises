import fetch from 'node-fetch'
import moment from 'moment'
import { Pool, throttle } from './pool.js'

const apiUrl = 'https://www.swapi.tech/api/starships/'  // api url
const pool = new Pool(3)                                // number of fetches that the application can execute simultaneously
const interval = 200                                    // interval between each fetch

// fetches data about starships from all pages
async function retrievePages() {
    const firstRes = await fetch(apiUrl)
    const body = await firstRes.json();

    // page has a hardcode limit of 10
    let pagePromises = []
    for (let page = 1; page < body.total_pages + 1; page++) {
        pagePromises.push(fetch(`${apiUrl}?page=${page}&limit=10`))
    }

    return Promise.all(pagePromises)
}

// fetches all data from each starship page by uid
async function retrieveStarships(uids) {
    let starshipPromises = []
    uids.forEach(uid => {
        starshipPromises.push(fetch(`${apiUrl}${uid}/`))
    })
    return Promise.all(starshipPromises)
}

// throttles down requests in a pool worker
// change interval const to change behavior
async function jobQueued(response) {
    const close = await pool.open()
    const result = await throttle(response.json(), interval).then(close)
    return result;
}

// gets all starship uids
const pagePromises = await retrievePages()
const pages = await Promise.all(pagePromises.map(jobQueued))
    .catch(err => console.error(err))
const starshipsUids = pages
    .flatMap(page => page.results)
    .map(starship => starship.uid)

// gets all starships by their uid
const starshipPromises = await retrieveStarships(starshipsUids)
const starships = await Promise.all(starshipPromises.map(jobQueued))
    .catch(err => console.error(err))

// everything we need is here :)
const starshipResults = starships
    .map(starship => starship.result.properties)

// distance (mglt/hr) retrieved from command line, defaults to 0
let [ flightHours = 0 ] = process.argv.slice(2)

starshipResults.forEach(starship => {
    // if we don't know the speed or the amount of time before a stop, assume unknown
    if (starship.consumables === 'unknown' || starship.MGLT === 'unknown') {
        console.log(`${starship.name}: unknown`)
        return
    }
    
    // parses duration from string (ex.: 3 years, 2 weeks) and converts to hours
    let [ number, unit ] = starship.consumables.split(' ');
    let hoursBeforeStop = moment.duration(parseInt(number), unit).asHours();

    // divides distance by ship speed by number of hours until a stop is needed
    let numberOfStops = parseInt(flightHours / parseInt(starship.MGLT) / hoursBeforeStop)

    // prints out ship name and number of stops needed
    console.log(`${starship.name}: ${numberOfStops}`)
})