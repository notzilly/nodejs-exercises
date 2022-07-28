const ul = document.querySelector("ul")
const input = document.querySelector("input")
const form = document.querySelector('form')

async function load(){
    const res = await fetch('http://localhost:3002').then((data) => data.json())
    res.urls.map(url => addElement(url))
}

load()

function addElement({ name, url }) {
    const li = document.createElement('li')
    const a = document.createElement("a")
    const trash = document.createElement("span")

    a.href = url
    a.innerHTML = name
    a.target = "_blank"

    trash.innerHTML = "x"
    trash.onclick = () => removeElement(trash)

    li.append(a)
    li.append(trash)
    ul.append(li)
}

async function removeElement(el) {
    if (confirm('Tem certeza que deseja deletar?')) {
        const { innerText: name, href } = el.parentNode.children[0];
        const url = href.slice(0, -1);
        const queryUrl = `http://localhost:3002?name=${name}&url=${url}&del=1`
        await fetch(queryUrl).then(el.parentNode.remove());
    }
}

async function addQuery(name, url, cb) {
    await fetch(`http://localhost:3002?name=${name}&url=${url}`).then(cb({name, url}))
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let { value } = input

    if (!value) 
        return alert('Preencha o campo')

    const [name, url] = value.split(",")

    if (!url) 
        return alert('formate o texto da maneira correta')

    if (!/^http/.test(url)) 
        return alert("Digite a url da maneira correta")

    addQuery(name, url, (newEl) => addElement(newEl))

    input.value = ""
})