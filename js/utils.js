export async function fetchJson(url) {
    const reponse = await fetch(url)
    console.log(reponse);
    return await reponse.json()
}
