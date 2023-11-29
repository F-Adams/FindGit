let params = new URLSearchParams(document.location.search);
let name = params.get('gitUser'); // is the string "Jonathan";

alert(name);
