    function loadChangelogXML() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://raw.githubusercontent.com/FreedomScoops/FreedomScoops/main/feed.xml", true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var xml;
                
                // Try to parse the XML manually if responseXML is null
                if (!xhr.responseXML) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(xhr.responseText, "application/xml");
                } else {
                    xml = xhr.responseXML;
                }

                // Check for parsing errors
                if (xml.getElementsByTagName("parsererror").length) {
                    console.error("Error parsing XML");
                    return;
                }

                var versions = xml.getElementsByTagName("version");
                var changelogListDiv = document.getElementById('changelog-list');

                // Loop through all changelog versions
                for (let i = 0; i < versions.length; i++) {
                    var version = versions[i];
                    var versionNumber = version.getElementsByTagName("number")[0].textContent;
                    var versionDate = version.getElementsByTagName("date")[0].textContent;
                    var shortMessage = version.getElementsByTagName("message")[0].textContent;
                    var fullMessage = version.getElementsByTagName("fullMessage")[0].textContent;

                    // Create a new div for each version
                    var changelogItem = document.createElement('div');
                    changelogItem.classList.add('changelog-item');
                    changelogItem.innerHTML = `
                        <h4>${versionNumber} - ${versionDate}</h4>
                        <p class="short-message">${shortMessage}</p>
                        <p class="full-message">${fullMessage}</p>
                    `;

                    changelogListDiv.appendChild(changelogItem);
                }
            } else {
                console.error("Failed to load XML. Status:", xhr.status);
            }
        };

        xhr.onerror = function() {
            console.error("An error occurred while loading the XML file.");
        };

        xhr.send();
    }

    // Run the function when the page loads
    window.onload = loadChangelogXML;
