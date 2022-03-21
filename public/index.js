
const loginForm = () => {
  //create and render login from
  var node = document.createElement('div');
  node.classList.add('loginForm');

  var username = document.createElement('input');
  username.classList.add('login-username');
  node.appendChild(username);

  var password = document.createElement('input');
  password.classList.add('login-password');
  node.appendChild(password);

  var btn = document.createElement('button');
  btn.classList.add('login-button');
  btn.innerText = 'LOGIN';
  node.appendChild(btn);

  document.querySelector('#app').appendChild(loginForm);
}