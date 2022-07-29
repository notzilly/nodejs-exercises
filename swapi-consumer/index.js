import fetch from 'node-fetch'
import { Pool, throttle } from './pool.js'

const apiUrl = 'https://www.swapi.tech/api/starships/'
const pool = new Pool(3)

async function retrievePages() {
    const firstRes = await fetch(apiUrl)
    const body = await firstRes.json();

    let pagePromises = []
    for (let page = 1; page < body.total_pages + 1; page++) {
        pagePromises.push(fetch(`${apiUrl}?page=${page}&limit=10`))
    }

    return Promise.all(pagePromises)
}

async function retrieveStarships(uids) {
    let starshipPromises = []
    uids.forEach(uid => {
        starshipPromises.push(fetch(`${apiUrl}${uid}/`))
    })
    return Promise.all(starshipPromises)
}

async function jobQueued(response) {
    const close = await pool.open()
    const result = await throttle(response.json(), 300).then(close)
    return result;
}

const pagePromises = await retrievePages()
const pages = await Promise.all(pagePromises.map(jobQueued))
    .catch(err => console.error(err))

const starshipsUids = pages
    .flatMap(page => page.results)
    .map(starship => starship.uid)

const starshipPromises = await retrieveStarships(starshipsUids)
const starships = await Promise.all(starshipPromises.map(jobQueued))
    .catch(err => console.error(err))

const starshipResults = starships
    .map(starship => starship.result.properties)

console.log(starshipResults);