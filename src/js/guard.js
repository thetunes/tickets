import { token } from "./controller/cookies.js";

if (token === "") {
  window.location.replace("http://tunes.herobuxx.me/login/");
  showProtectedNav();
}


function showProtectedNav() {
  const tableBody = document.getElementById('protectedNavLinks');
  tableBody.innerHTML = '';

  const navLink = document.createElement('li');
  navLink.className = "link";
  navLink.innerHTML = `
  <a href="/login">Login</a>
  <a href="/logout">logout</a>
  `;
  tableBody.appendChild(card);
}