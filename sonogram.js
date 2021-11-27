const SIZE = 5;

export default class Sonogram {
    constructor(artist = "", song_name = "", lyrics = "") {
        const word_list = this.clean(lyrics);
        
        const elements = [
            this.createArtistLabel(artist),
            this.createSongNameLabel(song_name),
            this.createLyricLabels(word_list),
            this.createLyricGraph(word_list)
        ];

        const svg = this.element("svg");
            svg.setAttribute('height', word_list.length * SIZE + 100)
            svg.setAttribute('width', word_list.length * SIZE + 20)
        const style = this.element("style");
            style.textContent = `
                text.artist {
                    font: bold 40px monospace;
                }
                text.song_name {
                    font: 15px monospace;
                    fill: #999;
                }
                text.label {
                    font: bold ${SIZE}px monospace;
                }
                rect {
                    fill: black;
                }
                .selected {
                    fill: magenta;
                }
            `;
        svg.appendChild(style);
        elements.forEach(e => svg.appendChild(e));

        svg.addEventListener('mouseover', (e) => {
            const word = e.target.getAttribute('data-word');
            if (!!word) {
                Array.from(svg.querySelectorAll('[data-word]'))
                    .forEach(node => node.classList.remove('selected'));
                Array.from(svg.querySelectorAll(`[data-word="${word}"]`))
                    .forEach(node => node.classList.add('selected'));
            }
        });

        this.node = svg;
    }

    createArtistLabel(artist) {
        const text = this.element("text")
            text.setAttribute("x", "10");
            text.setAttribute("y", "50");
            text.setAttribute("class", "artist");
            text.textContent = artist;
        return text;
    }

    createSongNameLabel(song_name) {
        const text = this.element("text")
            text.setAttribute("x", "10");
            text.setAttribute("y", "70");
            text.setAttribute("class", "song_name");
            text.textContent = song_name;
        return text;
    }

    createLyricLabels(lyrics) {
        const axis = this.element("g");
        axis.setAttribute('transform', `translate(0, 100)`);
        lyrics.forEach((word, i) => {
            let word_element = this.element('text');
                word_element.textContent = word;
                word_element.setAttribute('x', i * SIZE);
                word_element.setAttribute('y', SIZE);
                word_element.setAttribute('transform', `rotate(-45,${i * SIZE},0)`);
                word_element.setAttribute('class', 'label');
                word_element.setAttribute('data-word', word);
            axis.appendChild(word_element);
        });
        return axis;
    }

    createLyricGraph(lyrics) {
        const graph = this.element("g");
            graph.setAttribute('transform', `translate(0, 105)`);
        const points = this.generatePointMatrix(lyrics);
            points.forEach(p => graph.appendChild(p));
        return graph;
    }

    generatePointMatrix(lyrics) {
        return lyrics.slice()
            .reduce((points, word_1, i) => {
                const line = lyrics.slice()
                    .reduce((matches, word_2, j) => {
                        if (word_1 === word_2)
                            matches.push(this.makePoint(i,j,word_1));
                        return matches;
                    }, []);
                return points.concat(line);
            }, []);
    }

    makePoint(i, j, word) {
        const point = this.element('rect');
            point.setAttribute('x', SIZE * i);
            point.setAttribute('y', SIZE * j);
            point.setAttribute('height', SIZE);
            point.setAttribute('width', SIZE);
            point.setAttribute('data-word', word);
        return point;
    }

    clean(string) {
        return string.trim()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\n\r]/g, " ")
            .replace(/\s{2,}/g, " ")
            .toLowerCase()
            .split(' ');
    }

    element(name) {
        return document.createElementNS("http://www.w3.org/2000/svg", name);
    }
}