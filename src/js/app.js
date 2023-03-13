document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".search__input");
  const input = form.querySelector("input");
  const button = form.querySelector("button");
  const repoList = document.querySelector(".search__result");
  const inputError = document.querySelector(".search__error");

  const createListElement = (repo) => {
    const { full_name, description, stargazers_count, forks_count, language } =
      repo;

    const [author, repoName] = full_name.split("/");

    const li = document.createElement("li");
    li.classList.add("repo");

    li.innerHTML = `
      <div class="repo__heading">
        <div class="repo__name-info">
          <a
            href="https://github.com/${full_name}"
            target="_blank"
            >${repoName}</a
          >
          <span class="repo__author">${author}</span>
          <span class="repo__description"
            >${description}</span
          >
        </div>

        <div class="repo__meta-info">
          <div class="repo__ratings">
            <div class="repo__stars">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 22 28"
              >
                <path
                  fill="#ccc"
                  d="m5.825 22l1.625-7.025L2 10.25l7.2-.625L12 3l2.8 6.625l7.2.625l-5.45 4.725L18.175 22L12 18.275Z"
                />
              </svg>
              <span>${stargazers_count}</span>
            </div>

            <div class="repo__watchers">  
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path 
                  fill="#ccc" 
                  d="M19 2a2.993 2.993 0 0 0-1 5.816V11H6V7.816a3 3 0 1 0-2 0V11a2 2 0 0 0 2 2h5v4.184a3 3 0 1 0 2 0V13h5a2 2 0 0 0 2-2V7.816A2.993 2.993 0 0 0 19 2ZM5 6a1 1 0 1 1 1-1a1 1 0 0 1-1 1Zm7 15a1 1 0 1 1 1-1a1 1 0 0 1-1 1Zm7-15a1 1 0 1 1 1-1a1 1 0 0 1-1 1Z"/>
              </svg>
              <span>${forks_count}</span>
            </div>
          </div>
          <div class="repo__language">Lang: ${language}</div>
        </div>
      </div>
    `;

    repoList.append(li);
  };

  const getReposByName = async (query) => {
    const queryString = "q=" + encodeURIComponent(query);

    const response = await fetch(
      `https://api.github.com/search/repositories?${queryString}`
    );

    if (response.ok) {
      const result = await response.json();
      console.log(result);

      return result.items.filter((el, i) => i < 10);
    } else {
      return false;
    }
  };

  const inputValidation = () => {
    if (input.value.length > 2) {
      inputError.classList.add("active-error");
    } else {
      inputError.classList.remove("active-error");
    }
  };

  // events
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    repoList.innerHTML = "";

    const query = input.value;

    if (query.length < 2) {
      inputError.classList.add("active-error");
      return;
    }
    inputError.classList.remove("active-error");

    if (query === "") {
      return;
    }
    const repos = await getReposByName(query);
    if (repos.length === 0) {
      repoList.innerHTML = `<h2>Ничего не найдено</h2>`;
      return;
    }
    for (let repo of repos) {
      createListElement(repo);
    }
  });

  form.addEventListener("keypress", (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      button.click();
    }
  });
});
