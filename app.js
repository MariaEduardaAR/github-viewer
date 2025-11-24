const input = document.getElementById("username");
const button = document.getElementById("loadRepos");
const repoList = document.getElementById("repoList");
const message = document.getElementById("message");

async function loadRepos() {
  const user = input.value.trim();
  repoList.innerHTML = "";
  message.textContent = "";

  if (!user) {
    message.textContent = "Digite um nome de usuário do GitHub.";
    return;
  }

  message.textContent = "Buscando repositórios...";

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100`
    );

    if (response.status === 404) {
      message.textContent = "Usuário não encontrado.";
      return;
    }

    if (!response.ok) {
      message.textContent = "Erro ao buscar repositórios.";
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      message.textContent = "Esse usuário não possui repositórios públicos.";
      return;
    }

    message.textContent = `Foram encontrados ${data.length} repositórios públicos.`;

    data.forEach((repo) => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;

      const desc = document.createElement("div");
      desc.className = "repo-description";
      desc.textContent = repo.description || "Sem descrição.";

      li.appendChild(link);
      li.appendChild(desc);
      repoList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    message.textContent = "Erro inesperado ao chamar a API do GitHub.";
  }
}

button.addEventListener("click", loadRepos);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadRepos();
  }
});
