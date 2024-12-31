document.addEventListener("DOMContentLoaded", async function () {
    // Changelog loader function
    async function loadChangelog() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/FreedomScoops/FreedomScoops/refs/heads/main/feed.xml');
        if (!response.ok) throw new Error('Failed to load feed.xml');
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        const versions = xmlDoc.getElementsByTagName('version');
        const changelogContent = document.getElementById('changelogContent');
        changelogContent.innerHTML = '';

        for (let i = 0; i < Math.min(versions.length, 4); i++) {
          const version = versions[i];
          const versionNumber = version.getElementsByTagName('number')[0].textContent;
          const versionDate = version.getElementsByTagName('date')[0].textContent;
          const shortMessage = version.getElementsByTagName('message')[0].textContent;
          const fullMessage = version.getElementsByTagName('fullMessage')[0]?.textContent || shortMessage;

          const changelogItem = document.createElement('div');
          changelogItem.classList.add('changelog-item');
          changelogItem.innerHTML = `
            <h4>Version ${versionNumber}</h4>
            <p><strong>Release Date:</strong> ${versionDate}</p>
            <p>${shortMessage}</p>
          `;

          changelogItem.addEventListener('click', () => {
            const modal = document.getElementById('newsModal');
            const modalHeader = document.getElementById('modalHeader');
            const modalBody = document.getElementById('modalBody');
            modalHeader.textContent = `Version ${versionNumber} Details`;
            modalBody.innerHTML = fullMessage;
            modal.style.display = 'block';
            setTimeout(() => modal.style.opacity = 1, 10);
            const modalContent = document.querySelector('.modal-content');
            setTimeout(() => modalContent.style.transform = 'scale(1)', 300);
          });

          changelogContent.appendChild(changelogItem);
          setTimeout(() => changelogItem.classList.add('show'), i * 300);
        }
      } catch (error) {
        document.getElementById('changelogContent').innerHTML = `<p>Error loading changelog: ${error.message}</p>`;
      }
    }

    // GitHub commits loader function
    async function loadGitHubCommits() {
      try {
        const response = await fetch('https://api.github.com/repos/freedomscoops/freedomscoops/commits');
        if (!response.ok) throw new Error('Failed to load GitHub commits');
        const commits = await response.json();
        const githubCommitsContent = document.getElementById('githubCommitsContent');
        githubCommitsContent.innerHTML = '';

        for (let i = 0; i < Math.min(commits.length, 4); i++) {
          const commit = commits[i];
          const commitMessage = commit.commit.message;
          const commitDate = new Date(commit.commit.author.date).toLocaleString();
          const commitAuthor = commit.commit.author.name;
          const commitUrl = commit.html_url;

          const commitItem = document.createElement('div');
          commitItem.classList.add('commit-item');
          commitItem.innerHTML = `
            <p><strong>Message:</strong> ${commitMessage}</p>
            <p><strong>Author:</strong> ${commitAuthor}</p>
            <p><strong>Date:</strong> ${commitDate}</p>
          `;

          // Make the commit item clickable
          commitItem.addEventListener('click', () => {
            window.open(commitUrl, '_blank');  // Open the commit URL in a new tab
          });

          githubCommitsContent.appendChild(commitItem);
          setTimeout(() => commitItem.classList.add('show'), i * 300);
        }
      } catch (error) {
        document.getElementById('githubCommitsContent').innerHTML = `<p>Error loading GitHub commits: ${error.message}</p>`;
      }
    }

    // Load changelog and GitHub commits
    loadChangelog();
    loadGitHubCommits();

    // Modal close events
    document.getElementById('closeModal').addEventListener('click', () => {
      const modal = document.getElementById('newsModal');
      modal.style.opacity = 0;
      const modalContent = document.querySelector('.modal-content');
      modalContent.style.transform = 'scale(0.7)';
      setTimeout(() => modal.style.display = 'none', 300);
    });
    window.addEventListener('click', (event) => {
      const modal = document.getElementById('newsModal');
      if (event.target === modal) {
        modal.style.opacity = 0;
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.7)';
        setTimeout(() => modal.style.display = 'none', 300);
      }
    });
  });
