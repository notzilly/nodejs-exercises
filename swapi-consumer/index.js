import fetch from 'node-fetch'

const apiUrl = 'https://www.swapi.tech/api/starships/'

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


const pagePromises = await retrievePages()
const pages = await Promise.all(pagePromises.map(res => res.json()))

const starshipsUids = pages
    .flatMap(page => page.results)
    .map(starship => starship.uid)

const starshipPromises = await retrieveStarships(starshipsUids)
const starships = await Promise.all(starshipPromises.map(res => res.json()))

const starshipResults = starships
    .map(page => page.properties)

console.log(starshipResults)

