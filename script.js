    // DARK MODE
    function toggleDark() {
        document.body.classList.toggle("dark");
        localStorage.setItem("dark-mode", document.body.classList.contains("dark"));
    }
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("dark");
    }

    // LOAD HISTORY
    function loadHistory() {
        const historyDiv = document.getElementById("history");
        const saved = JSON.parse(localStorage.getItem("video-history") || "[]");

        historyDiv.innerHTML = "";
        saved.forEach(src => {
            const v = document.createElement("video");
            v.src = src;
            v.controls = true;
            historyDiv.appendChild(v);
        });
    }
    loadHistory();

    //delete history
    document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all video history?")) {
        localStorage.removeItem("video-history");   // delete stored history
        document.getElementById("historyContainer").innerHTML = ""; // clear UI
    }
    });

    // SAVE HISTORY
    function saveToHistory(url) {
        let saved = JSON.parse(localStorage.getItem("video-history") || "[]");
        saved.unshift(url);
        saved = saved.slice(0, 10);
        localStorage.setItem("video-history", JSON.stringify(saved));
        loadHistory();
    }

    // GENERATE VIDEO
    async function generateVideo() {
        const prompt = document.getElementById("promptInput").value;
        const resultDiv = document.getElementById("result");
        const loader = document.getElementById("loader");
        const btn = document.getElementById("generateBtn");

        if (!prompt.trim()) {
            alert("Enter a video prompt!");
            return;
        }

        btn.disabled = true;
        loader.style.display = "block";
        resultDiv.innerHTML = "";

        try {
            // THIS generates real video ➜ no test mode
            const videoEl = await puter.ai.txt2vid(prompt,true);

            videoEl.controls = true;
            videoEl.style.width = "100%";

            resultDiv.appendChild(videoEl);

            // DOWNLOAD BUTTON
            const dBtn = document.createElement("button");
            dBtn.innerText = "Download Video";
            dBtn.style.marginTop = "15px";
            dBtn.onclick = () => {
                const a = document.createElement("a");
                a.href = videoEl.src;
                a.download = "ai-video.mp4";
                a.click();
            };
            resultDiv.appendChild(dBtn);

            // SAVE HISTORY
            saveToHistory(videoEl.src);

        } catch (err) {
            console.error(err);
            alert("Video could not be generated. Check console for details.");
        }

        btn.disabled = false;
        loader.style.display = "none";
    }
