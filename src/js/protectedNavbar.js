import { token } from "./controller/cookies.js";
import { deleteCookie } from "https://jscroot.github.io/cookie/croot.js";

// Function to remove the 'token' cookie
function removeTokenCookie() {
  deleteCookie('token');
  window.location.reload();
}

// Update the showProtectedNav function to include the Log Out link with the click event
function showProtectedNav() {
  const tableBody = document.getElementById('protectedNavLinks');
  tableBody.innerHTML = '';
  const navLink = document.createElement('li');

  navLink.className = "link";

  if (token === "") {
    navLink.innerHTML = `
    <a href="/login">Login</a>
    `;
  } else {
    navLink.innerHTML = `
    <a href="my_order.html">My Orders</a>
    <a href="#" id="logoutLink">Log Out</a>
    `;
  }

  tableBody.appendChild(navLink);

  // Attach an event listener to the Log Out link
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', removeTokenCookie);
  }
}

window.onload = showProtectedNav;
