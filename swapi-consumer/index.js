import fetch from 'node-fetch'

const starships = await fetch("https://www.swapi.tech/api/starships")
    .then(res => res.json())
    .catch(err => console.error(err))

starships.results.map((ss) => {
    console.log(ss.name);
})