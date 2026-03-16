// API

const API_URL = "https://dummyjson.com/posts";

let userPosts = [];


// BOTONES

const homeBtn = document.getElementById("homeBtn");
const createBtn = document.getElementById("createBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const createPostForm = document.getElementById("createPostForm");

const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");
const userIdInput = document.getElementById("userIdInput");


// SECCIONES

const homeSection = document.getElementById("homeSection");
const createSection = document.getElementById("createSection");


// CONTENEDOR POSTS

const postsContainer = document.getElementById("postsContainer");


// EVENTOS

homeBtn.addEventListener("click", showHome);
createBtn.addEventListener("click", showCreate);
searchBtn.addEventListener("click", searchPosts);
createPostForm.addEventListener("submit", createPost);


// INICIAR APP

document.addEventListener("DOMContentLoaded", init);

function init(){ // Función para inicializar la aplicación
  loadPosts();
}


// FUNCIONES NAVEGACIÓN

function showHome(){

  homeSection.classList.remove("hidden"); //Esconder la sección de creación
  createSection.classList.add("hidden"); // Mostrar la sección de inicio

  loadPosts(); // Cargar los posts cada vez que se muestra la sección de inicio

}

function showCreate(){

  homeSection.classList.add("hidden"); // Esconder la sección de inicio
  createSection.classList.remove("hidden"); // Mostrar la sección de creación

}


// LLAMAR API

async function loadPosts(){ // Función asíncrona para cargar los posts

  try{

    const response = await fetch(`${API_URL}?limit=5`); // Llamada a la API para obtener los posts (limitados a 5)

    const data = await response.json(); // Convertir la respuesta a formato JSON

    const allPosts = [...userPosts, ...data.posts]; // Combinar los posts del usuario con los posts obtenidos de la API

    renderPosts(allPosts);

  }catch(error){

    console.error("Error loading posts:", error); 

  }

}


// RENDER POSTS

function renderPosts(posts){ // Función para renderizar los posts en la página

  postsContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar los nuevos posts

  posts.forEach(post => { // Iterar sobre cada post y crear su tarjeta

    const postCard = document.createElement("div"); // Crear un elemento div para la tarjeta del post
    postCard.classList.add("post-card"); // Agregar una clase para estilos


    const title = document.createElement("h3"); // Crear un elemento h3 para el título del post
    title.textContent = post.title; // Establecer el texto del título con el título del post

    const user = document.createElement("p");
    user.textContent = "User ID: " + post.userId;

     const views = document.createElement("p");
    views.textContent = "Views: " + post.views;


    const body = document.createElement("p"); // Crear un elemento p para el cuerpo del post
    body.textContent = post.body; // Establecer el texto del cuerpo con el contenido del post


    const likes = document.createElement("p"); // Crear un elemento p para mostrar el número de likes del post
    likes.textContent = "Likes: " + post.reactions.likes; // Establecer el texto de likes con el número de reacciones del post

    const dislikes = document.createElement("p");
    dislikes.textContent = "Dislikes: " + post.reactions.dislikes;

    // Agregar el título, cuerpo y likes a la tarjeta del post
    postCard.appendChild(title);
    postCard.appendChild(body);
    postCard.appendChild(user);
    postCard.appendChild(views);
    postCard.appendChild(likes);
    postCard.appendChild(dislikes);


    postsContainer.appendChild(postCard); // Agregar la tarjeta del post al contenedor de posts

  });

}

// FUNCIONES BÚSQUEDA
async function searchPosts(){ // Función asíncrona para buscar posts por título

  const query = searchInput.value;

  const response = await fetch(`${API_URL}/search?q=${query}`);

  const data = await response.json();

  renderPosts(data.posts);

}

// FUNCIONES CREAR POST
async function createPost(event){

  event.preventDefault();

  const title = titleInput.value;
  const body = bodyInput.value;
  const userId = userIdInput.value;

  const response = await fetch("https://dummyjson.com/posts/add",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      title:title,
      body:body,
      userId:Number(userId)
    })

  });

  const data = await response.json();

  // NORMALIZAR EL POST

  data.reactions = {
    likes:0,
    dislikes:0
  };

  data.views = 0;
  data.tags = [];

  // guardarlo en los posts del usuario

  userPosts.unshift(data);

  createPostForm.reset();

  showHome();

}