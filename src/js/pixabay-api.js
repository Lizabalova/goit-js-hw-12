
import { inputSearch, showLoader } from '../main';


export function fetchPhotoFromPixabay() {
    const inputValueForForm = inputSearch.value.trim().split(',').join('+');
    const searchParams = new URLSearchParams({
        key: '42996639-9210c4b9e8937070da12bf768',
        q: [inputValueForForm],
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true
    });
    showLoader();
    return fetch(`https://pixabay.com/api/?${searchParams}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }
        );
}