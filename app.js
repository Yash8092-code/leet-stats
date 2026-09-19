/**
 * LeetMetric ⚡ Gen-Z LeetCode Stats & Aura Tracker
 * Dynamic stats visualization with animated SVG progress rings,
 * aura rank calculation, error resilience & clipboard sharing.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const searchForm = document.getElementById("search-form");
    const searchButton = document.getElementById("search-btn");
    const btnText = searchButton.querySelector(".btn-text");
    const btnShortcut = searchButton.querySelector(".btn-shortcut");
    const btnLoader = searchButton.querySelector(".btn-loader");
    const usernameInput = document.getElementById("user-input");
    const clearInputBtn = document.getElementById("clear-input-btn");

    // States
    const welcomeState = document.getElementById("welcome-state");
    const loadingState = document.getElementById("loading-state");
    const errorState = document.getElementById("error-state");
    const statsDisplay = document.getElementById("stats-display");
    const errorTitle = document.getElementById("error-title");
    const errorMessage = document.getElementById("error-message");
    const errorRetryBtn = document.getElementById("error-retry-btn");

    // Profile Headers
    const avatarInitial = document.getElementById("avatar-initial");
    const displayUsername = document.getElementById("display-username");
    const auraBadge = document.getElementById("aura-badge");
    const userSubtext = document.getElementById("user-subtext");
    const leetcodeLink = document.getElementById("leetcode-link");
    const copyStatsBtn = document.getElementById("copy-stats-btn");
    const copyBtnText = document.getElementById("copy-btn-text");

    // Total Solved Progress Elements
    const totalSolvedCount = document.getElementById("total-solved-count");
    const totalQuestionsCount = document.getElementById("total-questions-count");
    const overallPercentage = document.getElementById("overall-percentage");
    const overallProgressBar = document.getElementById("overall-progress-bar");

    // SVG Rings & Labels
    const easyCircle = document.getElementById("easy-circle");
    const easySolved = document.getElementById("easy-solved");
    const easyTotal = document.getElementById("easy-total");
    const easyPercent = document.getElementById("easy-percent");

    const mediumCircle = document.getElementById("medium-circle");
    const mediumSolved = document.getElementById("medium-solved");
    const mediumTotal = document.getElementById("medium-total");
    const mediumPercent = document.getElementById("medium-percent");

    const hardCircle = document.getElementById("hard-circle");
    const hardSolved = document.getElementById("hard-solved");
    const hardTotal = document.getElementById("hard-total");
    const hardPercent = document.getElementById("hard-percent");

    const statsGrid = document.getElementById("stats-grid");
    const presetTags = document.getElementById("preset-tags");
    const recentTags = document.getElementById("recent-tags");
    const recentGroup = document.getElementById("recent-group");
    const toastContainer = document.getElementById("toast-container");

    const CIRCUMFERENCE = 2 * Math.PI * 50; // Radius is 50 -> 314.159
    let currentStatsData = null;

    // Initialize Recent Searches
    renderRecentSearches();

    // Input Events
    usernameInput.addEventListener("input", () => {
        clearInputBtn.style.display = usernameInput.value.trim().length > 0 ? "block" : "none";
    });

    clearInputBtn.addEventListener("click", () => {
        usernameInput.value = "";
        clearInputBtn.style.display = "none";
        usernameInput.focus();
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleSearch();
    });

    errorRetryBtn.addEventListener("click", () => {
        handleSearch();
    });

    // Hot pick tags click listener
    presetTags.addEventListener("click", (e) => {
        const chip = e.target.closest(".tag-chip");
        if (chip && chip.dataset.username) {
            usernameInput.value = chip.dataset.username;
            clearInputBtn.style.display = "block";
            handleSearch();
        }
    });

    // Recent tags click listener
    recentTags.addEventListener("click", (e) => {
        const chip = e.target.closest(".tag-chip");
        if (chip && chip.dataset.username) {
            usernameInput.value = chip.dataset.username;
            clearInputBtn.style.display = "block";
            handleSearch();
        }
    });

    // Copy / Share Stats Event
    copyStatsBtn.addEventListener("click", () => {
        if (!currentStatsData) return;
        shareStats(currentStatsData);
    });

    // Search Handler
    function handleSearch() {
        const username = usernameInput.value.trim();
        if (!validateUsername(username)) return;
        fetchUserDetails(username);
    }

    // Username Validation
    function validateUsername(username) {
        if (!username) {
            showToast("Please enter a LeetCode username", "error");
            usernameInput.focus();
            return false;
        }

        const regex = /^[a-zA-Z0-9_\-\.]{1,30}$/;
        if (!regex.test(username)) {
            showToast("Invalid handle. Use 1-30 letters, numbers, or _ - .", "error");
            return false;
        }

        return true;
    }

    // Set Loading State
    function setLoading(isLoading) {
        searchButton.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = "Fetching...";
            btnShortcut.style.display = "none";
            btnLoader.style.display = "inline-block";

            welcomeState.style.display = "none";
            errorState.style.display = "none";
            statsDisplay.style.display = "none";
            loadingState.style.display = "flex";
        } else {
            btnText.textContent = "Inspect Stats";
            btnShortcut.style.display = "inline-flex";
            btnLoader.style.display = "none";
            loadingState.style.display = "none";
        }
    }

    // Fetch User Details with AbortController Timeout
    async function fetchUserDetails(username) {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const url = `https://leetcode-stats.tashif.codes/${encodeURIComponent(username)}`;
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();

            // Tashif API returns HTTP 200 with { status: "error", message: "user does not exist" }
            if (data.status === "error" || data.message === "user does not exist") {
                showErrorState("User Not Found 💀", `We couldn't find "@${username}" on LeetCode. Please check for typos.`);
                return;
            }

            // Successfully received valid stats
            currentStatsData = data;
            saveRecentSearch(username);
            renderRecentSearches();
            displayUserData(data, username);
            showToast(`Loaded stats for @${username}! 🚀`, "success");

        } catch (error) {
            console.error("Fetch error:", error);
            if (error.name === "AbortError") {
                showErrorState("Request Timeout ⏱️", "The LeetCode API took too long to respond. Please try again in a few seconds.");
            } else {
                showErrorState("Unable to Fetch Stats ⚡", "Could not reach the LeetCode stats service. Check your internet connection.");
            }
        } finally {
            setLoading(false);
        }
    }

    // Error State Renderer
    function showErrorState(title, message) {
        errorTitle.textContent = title;
        errorMessage.textContent = message;
        welcomeState.style.display = "none";
        loadingState.style.display = "none";
        statsDisplay.style.display = "none";
        errorState.style.display = "flex";
    }

    // Calculate Aura Rank
    function getAuraRank(solved, ranking) {
        if (ranking && ranking > 0 && ranking <= 5000) {
            return { title: "👑 LeetCode God", color: "#f59e0b" };
        }
        if (solved >= 1000) {
            return { title: "🔥 Algorithm Demon", color: "#ef4444" };
        }
        if (solved >= 500) {
            return { title: "⚔️ Grandmaster", color: "#ec4899" };
        }
        if (solved >= 250) {
            return { title: "⚡ Daily Grinder", color: "#8b5cf6" };
        }
        if (solved >= 100) {
            return { title: "🚀 Code Samurai", color: "#3b82f6" };
        }
        if (solved >= 25) {
            return { title: "🌱 Rising Coder", color: "#10b981" };
        }
        return { title: "🐣 DSA Rookie", color: "#94a3b8" };
    }

    // Animate Numeric Count-Up
    function animateValue(element, start, end, duration = 1000, suffix = "") {
        if (isNaN(end)) {
            element.textContent = end + suffix;
            return;
        }

        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * easeOut);

            element.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    // Update Progress Ring with SVG Dashoffset
    function updateProgressRing(circle, solvedCount, totalCount, solvedEl, totalEl, percentEl) {
        const solved = Number(solvedCount) || 0;
        const total = Number(totalCount) || 0;
        const percentage = total > 0 ? (solved / total) * 100 : 0;
        const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

        // Reset and animate stroke
        circle.style.strokeDashoffset = CIRCUMFERENCE;
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 80);

        animateValue(solvedEl, 0, solved);
        totalEl.textContent = total.toLocaleString();
        percentEl.textContent = `${percentage.toFixed(1)}%`;
    }

    // Display User Data
    function displayUserData(data, username) {
        welcomeState.style.display = "none";
        errorState.style.display = "none";
        statsDisplay.style.display = "flex";

        // Header User Profile Info
        const userHandle = data.username || username;
        displayUsername.textContent = userHandle;
        avatarInitial.textContent = userHandle.charAt(0).toUpperCase();
        leetcodeLink.href = `https://leetcode.com/u/${encodeURIComponent(userHandle)}/`;

        // Calculate and Set Aura Badge
        const totalSolved = Number(data.totalSolved) || 0;
        const totalQuestions = Number(data.totalQuestions) || 0;
        const rank = Number(data.ranking) || 0;
        const aura = getAuraRank(totalSolved, rank);

        auraBadge.textContent = aura.title;
        auraBadge.style.borderColor = aura.color;
        userSubtext.textContent = rank > 0 ? `Global Rank: #${rank.toLocaleString()}` : "LeetCode Explorer";

        // Overall Solved Progress
        const overallPercentValue = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : "0.0";
        animateValue(totalSolvedCount, 0, totalSolved);
        totalQuestionsCount.textContent = totalQuestions.toLocaleString();
        overallPercentage.textContent = `${overallPercentValue}%`;
        overallProgressBar.style.width = `${Math.min(overallPercentValue, 100)}%`;

        // Update Rings
        updateProgressRing(
            easyCircle,
            data.easySolved || 0,
            data.totalEasy || 0,
            easySolved,
            easyTotal,
            easyPercent
        );

        updateProgressRing(
            mediumCircle,
            data.mediumSolved || 0,
            data.totalMedium || 0,
            mediumSolved,
            mediumTotal,
            mediumPercent
        );

        updateProgressRing(
            hardCircle,
            data.hardSolved || 0,
            data.totalHard || 0,
            hardSolved,
            hardTotal,
            hardPercent
        );

        // Secondary Stats Grid
        const cards = [
            {
                icon: "🏆",
                title: "World Ranking",
                value: rank > 0 ? `#${rank.toLocaleString()}` : "Unranked"
            },
            {
                icon: "🎯",
                title: "Acceptance Rate",
                value: data.acceptanceRate ? `${data.acceptanceRate}%` : "0%"
            },
            {
                icon: "⭐",
                title: "Contribution Pts",
                value: (data.contributionPoints || 0).toLocaleString()
            },
            {
                icon: "🔥",
                title: "Reputation",
                value: (data.reputation || 0).toLocaleString()
            }
        ];

        // Additional extra metrics if present
        if (data.data) {
            if (data.data.totalActiveDays !== undefined && data.data.totalActiveDays !== null) {
                cards.push({
                    icon: "📅",
                    title: "Active Days",
                    value: `${data.data.totalActiveDays} Days`
                });
            }
            if (data.data.badgesCount !== undefined && data.data.badgesCount !== null) {
                cards.push({
                    icon: "🎖️",
                    title: "Badges Earned",
                    value: `${data.data.badgesCount}`
                });
            }
        }

        statsGrid.innerHTML = cards.map(c => `
            <div class="stat-box">
                <div class="stat-icon-wrap">${c.icon}</div>
                <div class="stat-info">
                    <span class="stat-title">${c.title}</span>
                    <span class="stat-number">${c.value}</span>
                </div>
            </div>
        `).join("");
    }

    // Share / Copy Stats to Clipboard
    function shareStats(data) {
        const username = data.username || usernameInput.value;
        const totalSolved = data.totalSolved || 0;
        const totalQuestions = data.totalQuestions || 0;
        const rank = data.ranking ? `#${data.ranking.toLocaleString()}` : "Unranked";
        const aura = auraBadge.textContent;
        const acc = data.acceptanceRate || 0;

        const summary = [
            `⚡ LeetCode Vibe Check: @${username}`,
            `✨ Aura: ${aura}`,
            `🏆 World Rank: ${rank}`,
            `📊 Solved: ${totalSolved}/${totalQuestions}`,
            `🟢 Easy: ${data.easySolved || 0} | 🟡 Med: ${data.mediumSolved || 0} | 🔴 Hard: ${data.hardSolved || 0}`,
            `🎯 Acceptance: ${acc}%`,
            `🔗 https://leetcode.com/u/${username}/`
        ].join("\n");

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(summary).then(() => {
                copyBtnText.textContent = "Copied! ✨";
                showToast("Stats copied to clipboard! Share your grind 🚀", "success");
                setTimeout(() => {
                    copyBtnText.textContent = "Share Vibe";
                }, 2000);
            }).catch(() => {
                fallbackCopyText(summary);
            });
        } else {
            fallbackCopyText(summary);
        }
    }

    // Fallback Clipboard Copy
    function fallbackCopyText(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
            showToast("Stats copied to clipboard! 🚀", "success");
        } catch (err) {
            showToast("Failed to copy to clipboard", "error");
        }
        document.body.removeChild(textArea);
    }

    // Local Storage Recent Searches
    function saveRecentSearch(username) {
        try {
            let recents = JSON.parse(localStorage.getItem("leetmetric_recents") || "[]");
            // Remove existing duplicate
            recents = recents.filter(u => u.toLowerCase() !== username.toLowerCase());
            recents.unshift(username);
            // Cap at 4 items
            if (recents.length > 4) recents = recents.slice(0, 4);
            localStorage.setItem("leetmetric_recents", JSON.stringify(recents));
        } catch (e) {
            console.warn("Storage error", e);
        }
    }

    function renderRecentSearches() {
        try {
            const recents = JSON.parse(localStorage.getItem("leetmetric_recents") || "[]");
            if (recents.length > 0) {
                recentGroup.style.display = "flex";
                recentTags.innerHTML = recents.map(u => `
                    <button class="tag-chip" data-username="${u}">@${u}</button>
                `).join("");
            } else {
                recentGroup.style.display = "none";
            }
        } catch (e) {
            recentGroup.style.display = "none";
        }
    }

    // Toast Notification System
    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        const icon = type === "success" ? "✨" : "⚠️";
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
});