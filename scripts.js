// Seleciona o formulário e a lista de receitas a serem exibidas
const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const recipeDetails = document.querySelector('.recipe-details');
const searchInput = document.querySelector('.search-input');

// Adiciona um ouvinte de evento de 'submit' no formulário para capturar a ação de envio
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário de recarregar a página
    const inputValue = searchInput.value; // Captura o valor digitado no campo de input
    searchRecipes(inputValue); // Chama a função de busca de receitas com o ingrediente digitado
});

// Função assíncrona para buscar receitas por ingrediente usando a API externa
async function searchRecipes(ingredient) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`); // Faz uma requisição GET à API com o ingrediente
    const data = await response.json(); // Converte a resposta para JSON
    showRecipes(data.meals); // Passa os dados das receitas para a função que as exibe
}

// Função para exibir as receitas na página
function showRecipes(recipes) {
    if (recipes) { // Se receitas foram encontradas
        recipeList.innerHTML = recipes.map(element => `
            <div class="recipe-card" data-id="${element.idMeal}"> <!-- Cada receita é exibida como um card -->
                <img src="${element.strMealThumb}" alt="Foto-Receita"> <!-- Imagem da receita -->
                <h3>${element.strMeal}</h3> <!-- Nome da receita -->
            </div>
        `).join(''); // Gera o HTML para cada receita e converte o array em string com join()

        // Adiciona um ouvinte de evento para cada card de receita, para quando clicado buscar os detalhes
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', function() {
                const recipeId = this.getAttribute('data-id'); // Captura o ID da receita ao clicar no card
                getRecipesDetails(recipeId); // Chama a função para buscar os detalhes da receita
            });
        });
    } else {
        // Caso não encontre receitas, exibe uma mensagem de erro
        recipeList.innerHTML = '<p>Nenhuma Receita Encontrada!</p>';
    }
}

// Função assíncrona para buscar os detalhes da receita com base no ID
async function getRecipesDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`); // Faz uma requisição GET à API para buscar os detalhes pelo ID da receita
    const data = await response.json(); // Converte a resposta para JSON
    
    if (data.meals && data.meals.length > 0) { // Verifica se os detalhes da receita foram encontrados
        const recipe = data.meals[0]; // Pega o primeiro (e único) item da resposta, que contém os detalhes da receita
        let ingredients = '<ul>'; // Inicia a lista de ingredientes
        
        // Itera sobre os ingredientes e medidas, até 20 itens
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) { // Se o ingrediente existe
                ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`; // Adiciona ingrediente e medida à lista
            } else {
                break; // Se não há mais ingredientes, para o loop
            }
        }
        ingredients += '</ul>'; // Fecha a lista de ingredientes

        // Exibe os detalhes da receita na área de detalhes
        recipeDetails.innerHTML = `
            <h2>${recipe.strMeal}</h2> <!-- Nome da receita -->
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}"> <!-- Imagem da receita -->
            <h3>Categoria: ${recipe.strCategory}</h3> <!-- Categoria da receita -->
            <h3>Origem: ${recipe.strArea}</h3> <!-- Origem (país) da receita -->
            <h3>Ingredientes:</h3>
            ${ingredients} <!-- Lista de ingredientes -->
            <h3>Modo de Preparo:</h3>
            <p>${recipe.strInstructions}</p> <!-- Instruções de preparo -->
            <p><span>Tags:</span> ${recipe.strTags}</p> <!-- Tags relacionadas à receita -->
            <h3>Vídeo: <a href="${recipe.strYoutube}" target="_blank">Assista no YouTube!</a></h3> <!-- Link para vídeo no YouTube -->
        `;
    } else {
        // Caso não encontre detalhes da receita, exibe uma mensagem de erro
        recipeDetails.innerHTML = '<p>Detalhes da Receita Não Encontrados!</p>';
    }
}

// Coloca o foco no campo de input de pesquisa ao carregar a página
window.onload = function() {
    searchInput.focus();
}

// Adiciona um ouvinte de evento para a tecla "Enter"
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && document.activeElement === searchInput) { // Verifica se "Enter" foi pressionado enquanto o campo de pesquisa está em foco
        event.preventDefault(); // Impede o comportamento padrão do "Enter"
        const inputValue = searchInput.value; // Captura o valor do input
        searchRecipes(inputValue); // Chama a função de busca de receitas
    }
});