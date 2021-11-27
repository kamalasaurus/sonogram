import Sonogram from "./sonogram.js";

void function main() {
    let form = document.querySelector('form');
    let container = document.querySelector("#container");
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let { artist, song_name, lyrics } = e.target.elements;
        let values = [artist, song_name, lyrics].map(e => e.value)
        let sonogram = new Sonogram(...values);
        container.appendChild(sonogram.node);
        console.log(e);
    });
}();