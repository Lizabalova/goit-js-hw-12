import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { fetchPhotoFromPixabay, limit } from './js/pixabay-api';
import { renderPhotos, listOfPhotos } from './js/render-functions';

export const form = document.querySelector('.search-form');
export let page = 1;
export let input = '';
const nextPageBtn = document.querySelector('.next-page-btn');
hideElement(nextPageBtn);
const preloader = document.querySelector('.loader');
hideElement(preloader);
let totalPages = 1;

window.onload = handleLoad;

form.addEventListener('submit', handleSendForm);
nextPageBtn.addEventListener('click', handleNextPage);

function handleSendForm(evt) {
    evt.preventDefault();
    listOfPhotos.innerHTML = "";
    const newInput = evt.target.elements.search.value.trim();
    if (newInput !== '') {
        page = 1;
        input = newInput;
        handleSubmit();
    } else {
        return iziToast.show({
            message: 'Please complete the field!',
            theme: 'dark',
            progressBarColor: '#FFFFFF',
            color: '#EF4040',
            position: 'topRight',
        });
    }
}

async function handleSubmit() {
    try {
        hideElement(nextPageBtn);
        showElement(preloader);
        if (page <= totalPages) {
            const photoFromPixabay = await fetchPhotoFromPixabay();
            if (photoFromPixabay.totalHits != 0) {
                totalPages = Math.ceil(photoFromPixabay.totalHits / limit);
                renderPhotos(photoFromPixabay.hits);
                const itemOfList = listOfPhotos.querySelector('.photos-list-item');
                const domRect = itemOfList.getBoundingClientRect();
                window.scrollBy({
                    top: domRect.height * 2,
                    behavior: "smooth",
                });
                if (page < totalPages) {
                    showElement(nextPageBtn);
                }
                else {
                    iziToast.info({
                        theme: 'dark',
                        progressBarColor: '#FFFFFF',
                        position: "topRight",
                        message: "We're sorry, there are no more images to load"
                    });
                }
            } else {
                iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    theme: 'dark',
                    progressBarColor: '#FFFFFF',
                    color: '#EF4040',
                    position: 'topRight',
                });
            }
        }
    } catch (error) {
        console.log(error);
        iziToast.error({
            message: `${error.message}`,
            theme: 'dark',
            progressBarColor: '#FFFFFF',
            color: '#EF4040',
            position: 'topRight',
        });
    } finally {
        hideElement(preloader);
        handleLoad();
        form.reset();
    }
}

function handleNextPage() {
    ++page;
    handleSubmit();
};


function showElement(element) {
    element.classList.toggle('hidden');
    element.style.display = 'flex';
};

function hideElement(element) {
    element.classList.toggle('hidden');
    element.style.display = 'none';
};

function handleLoad() {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded_hiding');
};
