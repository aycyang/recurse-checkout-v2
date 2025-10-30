window.onload = () => {
  const div = document.createElement("div");
  div.innerHTML = "hihi";
  const getCommitsButton = document.createElement("button");
  getCommitsButton.innerHTML = "get commits";
  getCommitsButton.addEventListener("click", async (event) => {
    const url = new URL(window.location.origin + "/get_commits");
    url.searchParams.set("startDate", "2025-10-01");
    const commitsRes = await fetch(url);
    const commits = await commitsRes.json();
    console.log(commits);
  });
  document.body.appendChild(getCommitsButton);
  document.body.appendChild(div);
};
