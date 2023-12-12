const currentURL = window.location.href;
const url = new URL(currentURL);
const searchParams = url.searchParams;

export default searchParams