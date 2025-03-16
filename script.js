// Tusaale xog users hore
let users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user1", password: "password1", role: "user" }
];

// Haddii uu jiro localStorage users, isticmaal xogtaas
if(localStorage.getItem('users')) {
  users = JSON.parse(localStorage.getItem('users'));
} else {
  localStorage.setItem('users', JSON.stringify(users));
}

let posts = [];

// Function login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const foundUser = users.find(u => u.username === username && u.password === password);
  
  if(foundUser) {
    sessionStorage.setItem('currentUser', JSON.stringify(foundUser));
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    document.getElementById('current-user').textContent = foundUser.username;
    // Haddii admin, muujiso admin section
    if(foundUser.role === "admin") {
      document.getElementById('admin-section').style.display = 'block';
    }
    loadPosts();
  } else {
    document.getElementById('login-error').textContent = "Username ama password ma saxna!";
  }
});

// Logout function
function logout() {
  sessionStorage.removeItem('currentUser');
  document.getElementById('main-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
}

// Post gudbinta function
document.getElementById('postForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const text = document.getElementById('postText').value;
  const media = document.getElementById('mediaURL').value;
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
  // Dhis post object
  const post = {
    username: currentUser.username,
    role: currentUser.role,
    text: text,
    media: media,
    timestamp: new Date().toLocaleString()
  };
  posts.push(post);
  document.getElementById('postForm').reset();
  loadPosts();
});

// Function load posts
function loadPosts() {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = "";
  posts.slice().reverse().forEach(post => {
    let postHTML = `<div class="post">
      <strong>${post.username}</strong> (${post.timestamp})<br/>
      <p>${post.text}</p>`;
    if(post.media) {
      // Haddii media uu yahay URL oo ah sawir ama video, isku day in la muujiyo
      if(post.media.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        postHTML += `<img src="${post.media}" alt="media" style="max-width:100%;">`;
      } else {
        // Tusaale: embed video haddii URL uu yahay YouTube (ama isku day embed)
        postHTML += `<a href="${post.media}" target="_blank">${post.media}</a>`;
      }
    }
    postHTML += `</div>`;
    postsContainer.innerHTML += postHTML;
  });
}

// Admin: Maamul Users
function viewUsers() {
  const userListContainer = document.getElementById('user-list');
  userListContainer.innerHTML = "<ul>" + users.map((user, index) => {
    return `<li>${user.username} - ${user.role} 
              ${user.username === "admin" ? "" : `<button onclick="removeUser(${index})">Ka saar</button>`}
            </li>`;
  }).join('') + "</ul>";
}

// Admin: Ku dar user cusub
function addUser() {
  const newUsername = prompt("Geli username cusub:");
  const newPassword = prompt("Geli password cusub:");
  const newRole = prompt("Geli doorashada role (admin/user):");
  
  if(newUsername && newPassword && (newRole === "admin" || newRole === "user")) {
    users.push({ username: newUsername, password: newPassword, role: newRole });
    localStorage.setItem('users', JSON.stringify(users));
    viewUsers();
  } else {
    alert("Xog khaldan, fadlan isku day mar kale.");
  }
}

// Admin: Ka saar user
function removeUser(index) {
  // Iska hubi in aadan ka saarin admin-ka asalka ah
  if(users[index].username === "admin") {
    alert("Ma saari kartid admin-ka!");
    return;
  }
  if(confirm(`Ma hubtaa inaad ka saarto ${users[index].username}?`)) {
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    viewUsers();
  }
}

// Haddii user horey u login-gareeyey
const storedUser = sessionStorage.getItem('currentUser');
if(storedUser) {
  const currentUser = JSON.parse(storedUser);
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('main-container').style.display = 'block';
  document.getElementById('current-user').textContent = currentUser.username;
  if(currentUser.role === "admin") {
    document.getElementById('admin-section').style.display = 'block';
  }
  loadPosts();
}
