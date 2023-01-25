const movies = document.querySelector(".movies");
const highLight = document.querySelector(".highlight__video");
const genres = document.querySelector(".highlight__genres");
const title = document.querySelector(".highlight__title");
const voteAverage = document.querySelector(".highlight__rating");
const overview = document.querySelector(".highlight__description");
const date = document.querySelector(".highlight__launch");

const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalAvarage = document.querySelector(".modal__average");

const nextButton = document.querySelector(".btn-next");
const previewButton = document.querySelector(".btn-prev");

const body = document.querySelector("body");
const highlightSize = document.querySelector(".highlight");
const header = document.querySelector(".header");
const infos = document.querySelector(".highlight__info");
const container = document.querySelector(".movies-container");
const modalBody = document.querySelector(".modal__body");
const logo = document.querySelector(".header__container-logo");

let i = 0;
let totalFilmes = 6;
let link = "/discover/movie?language=pt-BR&include_adult=false";

nextButton.addEventListener("click", () => {
    movies.innerHTML = "";
    if (i < 12) {
        i += 6;
        totalFilmes += 6;
        console.log(link);
        selecionarFilmes(link);
    } else {
        totalFilmes = 6;
        i = 0;
        selecionarFilmes(link);
    }
});

previewButton.addEventListener("click", () => {
    movies.innerHTML = "";
    if (i === 0) {
        totalFilmes = 18;
        i = 12;
        selecionarFilmes(link);
    } else {
        totalFilmes -= 6;
        i -= 6;
        selecionarFilmes(link);
    }
});

selecionarFilmes(link);
selecionarFilmeDoDia();

// let data = [];

async function selecionarFilmes(link) {
    try {
        const { data } = await cinemaInstance.get(link);
        mostrarFilme(data.results);
    } catch (error) {
        console.log(error.message);
    }
}

function mostrarFilme(data) {
    movies.innerHTML = "";
    for (index = i; index < totalFilmes; index++) {
        const { poster_path, title, vote_average, id } = data[index];

        const movie = document.createElement("div");
        const movieInfo = document.createElement("div");
        const movieTitle = document.createElement("span");
        const movieRating = document.createElement("span");
        const estrela = document.createElement("img");

        movie.classList.add("movie");
        movieInfo.classList.add("movie__info");
        movieTitle.classList.add("movie__title");
        movieRating.classList.add("movie__rating");

        movie.style.backgroundImage = `url(${poster_path})`;
        movieTitle.textContent = `${title}`;
        movieRating.textContent = `${vote_average}`;
        estrela.src = `./assets/estrela.svg`;

        movieInfo.appendChild(movieTitle);
        movieRating.appendChild(estrela);
        movieInfo.appendChild(movieRating);
        movie.appendChild(movieInfo);
        movies.appendChild(movie);

        const elemento = document.querySelector(".modal");

        movie.addEventListener("click", (e) => {
            modal(id);

            if (e.target.className === "movie") {
                elemento.classList.remove("hidden");
            }
        });
        document.addEventListener("click", (e) => {
            if (e.target.className === "modal__close") {
                elemento.classList.add("hidden");
            }
        });
    }
}

async function pesquisarFilmes(params) {
    try {
        if (input.value === "") {
            link = "/discover/movie?language=pt-BR&include_adult=false";
        } else {
            link = `/search/movie?language=pt-BR&include_adult=false&query=${params}`;
        }
        const {
            data: { results },
        } = await cinemaInstance.get(link);

        mostrarFilme(results);
    } catch (error) {
        console.log(error.message);
    }
}

const input = document.querySelector(".input");

input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();

        input.click();

        pesquisarFilmes(input.value);
    }
});

async function selecionarFilmeDoDia(params) {
    try {
        const { data } = await cinemaInstance.get("/movie/436969?language=pt-BR");

        let generos = [];

        for (let genero of data.genres) {
            generos.push(genero.name);
        }

        highLight.style.backgroundImage = `url(${data.backdrop_path})`;
        highLight.style.backgroundSize = "cover";
        title.textContent = `${data.title}`;
        voteAverage.textContent = `${data.vote_average.toFixed(1)}`;
        genres.textContent = `${generos.join(", ")}`;
        date.textContent = `${new Date(data.release_date).toLocaleString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}`;
        overview.textContent = `${data.overview}`;

        console.log();
    } catch (error) {
        console.log(error.message);
    }
}

async function modal(data) {
    try {
        link = `/movie/${data}?language=pt-BR`;

        const { data: dados } = await cinemaInstance.get(link);

        modalTitle.textContent = `${dados.title}`;
        modalImg.style.backgroundImage = `url(${dados.backdrop_path})`;
        modalImg.style.backgroundSize = "cover";
        modalDescription.textContent = `${dados.overview}`;
        modalAvarage.textContent = `${dados.vote_average.toFixed(1)}`;

        document.addEventListener("click", (e) => {
            if (e.target.className === "modal__close") {
                elemento.classList.add("hidden");
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

const btnTheme = document.querySelector(".btn-theme");

let theme = localStorage.getItem("theme") !== null ? localStorage.getItem("theme") : "light";

function applyTheme() {
    if (theme === "dark") {
        body.style.setProperty("--background", "rgb(27, 32, 40)");
        body.style.setProperty("--text-color", "#FFF");
        body.style.setProperty("--bg-secondary", "#2D3440");

        btnTheme.src = "./assets/dark-mode.svg";
        btnPrev.src = "./assets/arrow-left-light.svg";
        btnNext.src = "./assets/arrow-right-light.svg";
        modalClose.src = "./assets/close.svg";
    } else {
        body.style.setProperty("--background", "#FFF");
        body.style.setProperty("--text-color", "rgb(27, 32, 40)");
        body.style.setProperty("--bg-secondary", "#EDEDED");

        btnTheme.src = "./assets/light-mode.svg";
        btnPrev.src = "./assets/arrow-left-dark.svg";
        btnNext.src = "./assets/arrow-right-dark.svg";
        modalClose.src = "./assets/close-dark.svg";
    }
}

btnTheme.addEventListener("click", () => {
    if (theme === "light") {
        theme = "dark";
    } else {
        theme = "light";
    }

    localStorage.setItem("theme", theme);
    applyTheme();
});
