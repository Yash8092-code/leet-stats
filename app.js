/**
 * LeetMetric ⚡ Gen-Z LeetCode Stats & Aura Tracker
 * Enriched with Real Profile Avatar, Contest Analytics,
 * Social links, and Animated SVG Visualizations.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements - Search Form
    const searchForm = document.getElementById("search-form");
    const searchButton = document.getElementById("search-btn");
    const btnText = searchButton.querySelector(".btn-text");
    const btnShortcut = searchButton.querySelector(".btn-shortcut");
    const btnLoader = searchButton.querySelector(".btn-loader");
    const usernameInput = document.getElementById("user-input");
    const clearInputBtn = document.getElementById("clear-input-btn");

    // UI View States
    const welcomeState = document.getElementById("welcome-state");
    const loadingState = document.getElementById("loading-state");
    const errorState = document.getElementById("error-state");
    const statsDisplay = document.getElementById("stats-display");
    const errorTitle = document.getElementById("error-title");
    const errorMessage = document.getElementById("error-message");
    const errorRetryBtn = document.getElementById("error-retry-btn");

    // Profile Header Elements
    const avatarImg = document.getElementById("avatar-img");
    const avatarInitial = document.getElementById("avatar-initial");
    const displayUsername = document.getElementById("display-username");
    const displayRealname = document.getElementById("display-realname");
    const displayCountry = document.getElementById("display-country");
    const displayAffiliation = document.getElementById("display-affiliation");
    const auraBadge = document.getElementById("aura-badge");
    const contestBadge = document.getElementById("contest-badge");
    const userSubtext = document.getElementById("user-subtext");
    const leetcodeLink = document.getElementById("leetcode-link");
    const copyStatsBtn = document.getElementById("copy-stats-btn");
    const copyBtnText = document.getElementById("copy-btn-text");
    const socialsBar = document.getElementById("socials-bar");

    // Contest Stats Banner Elements
    const contestBanner = document.getElementById("contest-banner");
    const contestRatingEl = document.getElementById("contest-rating");
    const contestGlobalRankEl = document.getElementById("contest-global-rank");
    const contestTopPercentEl = document.getElementById("contest-top-percent");
    const contestAttendedEl = document.getElementById("contest-attended");

    // Total Solved Progress Elements
    const totalSolvedCount = document.getElementById("total-solved-count");
    const totalQuestionsCount = document.getElementById("total-questions-count");
    const overallPercentage = document.getElementById("overall-percentage");
    const overallProgressBar = document.getElementById("overall-progress-bar");

    // Difficulty Rings
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

    const CIRCUMFERENCE = 2 * Math.PI * 50; // Radius 50 = ~314.159
    let currentAggregatedData = null;

    // Initialize Recent Searches from localStorage
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

    // Preset / Hot Pick Chips
    presetTags.addEventListener("click", (e) => {
        const chip = e.target.closest(".tag-chip");
        if (chip && chip.dataset.username) {
            usernameInput.value = chip.dataset.username;
            clearInputBtn.style.display = "block";
            handleSearch();
        }
    });

    // Recent Tags Chips
    recentTags.addEventListener("click", (e) => {
        const chip = e.target.closest(".tag-chip");
        if (chip && chip.dataset.username) {
            usernameInput.value = chip.dataset.username;
            clearInputBtn.style.display = "block";
            handleSearch();
        }
    });

    // Share / Copy Stats Event
    copyStatsBtn.addEventListener("click", () => {
        if (!currentAggregatedData) return;
        shareStats(currentAggregatedData);
    });

    function handleSearch() {
        const username = usernameInput.value.trim();
        if (!validateUsername(username)) return;
        fetchComprehensiveUserData(username);
    }

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

    function setLoading(isLoading) {
        searchButton.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = "Summoning...";
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

    /**
     * Concurrently fetch basic stats, profile details (avatar, name, country),
     * and contest performance using Promise.allSettled.
     */
    async function fetchComprehensiveUserData(username) {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const cleanUser = encodeURIComponent(username);
            const coreStatsUrl = `https://leetcode-stats.tashif.codes/${cleanUser}`;
            const profileUrl = `https://alfa-leetcode-api.onrender.com/${cleanUser}`;
            const contestUrl = `https://alfa-leetcode-api.onrender.com/${cleanUser}/contest`;

            const [coreRes, profileRes, contestRes] = await Promise.allSettled([
                fetch(coreStatsUrl, { signal: controller.signal }).then(r => r.json()),
                fetch(profileUrl, { signal: controller.signal }).then(r => r.json()),
                fetch(contestUrl, { signal: controller.signal }).then(r => r.json())
            ]);

            clearTimeout(timeoutId);

            // Verify core stats
            if (coreRes.status !== "fulfilled" || !coreRes.value) {
                throw new Error("Unable to fetch core stats");
            }

            const coreData = coreRes.value;

            // Handle API non-existent user response
            if (coreData.status === "error" || coreData.message === "user does not exist") {
                showErrorState("User Not Found 💀", `We couldn't find "@${username}" on LeetCode. Double check the spelling or try another user.`);
                return;
            }

            // Extract optional profile & contest data if available
            const profileData = profileRes.status === "fulfilled" && profileRes.value && !profileRes.value.errors ? profileRes.value : null;
            const contestData = contestRes.status === "fulfilled" && contestRes.value && !contestRes.value.errors ? contestRes.value : null;

            const aggregated = {
                core: coreData,
                profile: profileData,
                contest: contestData,
                username: username
            };

            currentAggregatedData = aggregated;
            saveRecentSearch(username);
            renderRecentSearches();
            renderDashboard(aggregated);
            showToast(`Loaded live vibe for @${username}! 🚀`, "success");

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

    function showErrorState(title, message) {
        errorTitle.textContent = title;
        errorMessage.textContent = message;
        welcomeState.style.display = "none";
        loadingState.style.display = "none";
        statsDisplay.style.display = "none";
        errorState.style.display = "flex";
    }

    /**
     * Compute Dynamic Gen-Z Aura Rank based on problem count, contest rating & rank
     */
    function calculateAura(coreData, contestData) {
        const solved = Number(coreData.totalSolved) || 0;
        const ranking = Number(coreData.ranking) || 0;
        const contestRating = contestData ? Math.round(Number(contestData.contestRating) || 0) : 0;
        const contestBadgeName = contestData && contestData.contestBadges ? contestData.contestBadges.name : null;

        // Base score calculation
        let auraPoints = solved * 12 + (coreData.hardSolved || 0) * 35;
        if (contestRating > 1500) {
            auraPoints += (contestRating - 1500) * 8;
        }

        if (contestBadgeName === "Guardian" || (contestRating >= 2200)) {
            return { title: "👑 LeetCode Guardian God", color: "#f59e0b", points: auraPoints };
        }
        if (contestBadgeName === "Knight" || (contestRating >= 1850)) {
            return { title: "⚔️ LeetCode Knight", color: "#8b5cf6", points: auraPoints };
        }
        if (ranking > 0 && ranking <= 5000) {
            return { title: "🔥 Algorithm Demon", color: "#ef4444", points: auraPoints };
        }
        if (solved >= 800) {
            return { title: "⚡ Grandmaster", color: "#ec4899", points: auraPoints };
        }
        if (solved >= 400) {
            return { title: "🚀 Code Samurai", color: "#3b82f6", points: auraPoints };
        }
        if (solved >= 150) {
            return { title: "⚡ Daily Grinder", color: "#06b6d4", points: auraPoints };
        }
        if (solved >= 40) {
            return { title: "🌱 Rising Coder", color: "#10b981", points: auraPoints };
        }
        return { title: "🐣 DSA Rookie", color: "#94a3b8", points: auraPoints };
    }

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

    function updateProgressRing(circle, solvedCount, totalCount, solvedEl, totalEl, percentEl) {
        const solved = Number(solvedCount) || 0;
        const total = Number(totalCount) || 0;
        const percentage = total > 0 ? (solved / total) * 100 : 0;
        const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

        circle.style.strokeDashoffset = CIRCUMFERENCE;
        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 80);

        animateValue(solvedEl, 0, solved);
        totalEl.textContent = total.toLocaleString();
        percentEl.textContent = `${percentage.toFixed(1)}%`;
    }

    /**
     * Render the active stats dashboard with avatar, contest metrics & problem breakdown
     */
    function renderDashboard(aggregated) {
        const { core, profile, contest, username } = aggregated;

        welcomeState.style.display = "none";
        errorState.style.display = "none";
        statsDisplay.style.display = "flex";

        const userHandle = core.username || username;
        displayUsername.textContent = userHandle;
        leetcodeLink.href = `https://leetcode.com/u/${encodeURIComponent(userHandle)}/`;

        // 1. Profile Avatar
        avatarInitial.textContent = userHandle.charAt(0).toUpperCase();
        if (profile && profile.avatar && !profile.avatar.includes("default_avatar.jpg")) {
            avatarImg.src = profile.avatar;
            avatarImg.style.display = "block";
            avatarInitial.style.display = "none";
            avatarImg.onerror = () => {
                avatarImg.style.display = "none";
                avatarInitial.style.display = "block";
            };
        } else {
            avatarImg.style.display = "none";
            avatarInitial.style.display = "block";
        }

        // 2. Real Name, Country & Organization
        if (profile && profile.name && profile.name.trim() !== "" && profile.name.toLowerCase() !== userHandle.toLowerCase()) {
            displayRealname.textContent = profile.name;
            displayRealname.style.display = "inline-block";
        } else {
            displayRealname.style.display = "none";
        }

        if (profile && profile.country) {
            displayCountry.textContent = `📍 ${profile.country}`;
            displayCountry.style.display = "inline-block";
        } else {
            displayCountry.style.display = "none";
        }

        const org = profile ? (profile.company || profile.school) : null;
        if (org) {
            displayAffiliation.textContent = `🏛️ ${org}`;
            displayAffiliation.style.display = "inline-block";
        } else {
            displayAffiliation.style.display = "none";
        }

        // 3. Aura & Contest Badges
        const aura = calculateAura(core, contest);
        auraBadge.textContent = aura.title;
        auraBadge.style.borderColor = aura.color;

        if (contest && contest.contestBadges && contest.contestBadges.name) {
            const badgeName = contest.contestBadges.name;
            contestBadge.textContent = `🛡️ ${badgeName}`;
            contestBadge.className = `contest-badge badge-${badgeName.toLowerCase()}`;
            contestBadge.style.display = "inline-flex";
        } else {
            contestBadge.style.display = "none";
        }

        const rank = Number(core.ranking) || 0;
        userSubtext.textContent = rank > 0 
            ? `Global Rank: #${rank.toLocaleString()} • Aura: ${aura.points.toLocaleString()} pts`
            : `LeetCode Explorer • Aura: ${aura.points.toLocaleString()} pts`;

        // 4. Social Links
        renderSocials(profile);

        // 5. Contest Analytics Banner
        if (contest && contest.contestAttend && contest.contestAttend > 0) {
            contestBanner.style.display = "grid";
            animateValue(contestRatingEl, 0, Math.round(contest.contestRating));
            contestGlobalRankEl.textContent = `#${(contest.contestGlobalRanking || 0).toLocaleString()}`;
            contestTopPercentEl.textContent = `Top ${(contest.contestTopPercentage || 0)}%`;
            contestAttendedEl.textContent = `${contest.contestAttend} Attended`;
        } else {
            contestBanner.style.display = "none";
        }

        // 6. Overall Solved Progress Banner
        const totalSolved = Number(core.totalSolved) || 0;
        const totalQuestions = Number(core.totalQuestions) || 0;
        const overallPercentValue = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : "0.0";
        animateValue(totalSolvedCount, 0, totalSolved);
        totalQuestionsCount.textContent = totalQuestions.toLocaleString();
        overallPercentage.textContent = `${overallPercentValue}%`;
        overallProgressBar.style.width = `${Math.min(overallPercentValue, 100)}%`;

        // 7. Difficulty Rings
        updateProgressRing(
            easyCircle,
            core.easySolved || 0,
            core.totalEasy || 0,
            easySolved,
            easyTotal,
            easyPercent
        );

        updateProgressRing(
            mediumCircle,
            core.mediumSolved || 0,
            core.totalMedium || 0,
            mediumSolved,
            mediumTotal,
            mediumPercent
        );

        updateProgressRing(
            hardCircle,
            core.hardSolved || 0,
            core.totalHard || 0,
            hardSolved,
            hardTotal,
            hardPercent
        );

        // 8. Secondary Stats Grid
        const cards = [
            {
                icon: "🏆",
                title: "World Ranking",
                value: rank > 0 ? `#${rank.toLocaleString()}` : "Unranked"
            },
            {
                icon: "🎯",
                title: "Acceptance Rate",
                value: core.acceptanceRate ? `${core.acceptanceRate}%` : "0%"
            },
            {
                icon: "⭐",
                title: "Contribution Pts",
                value: (core.contributionPoints || 0).toLocaleString()
            },
            {
                icon: "🔥",
                title: "Reputation",
                value: (core.reputation || 0).toLocaleString()
            }
        ];

        // Additional extra metrics if present
        if (core.data) {
            if (core.data.totalActiveDays !== undefined && core.data.totalActiveDays !== null) {
                cards.push({
                    icon: "📅",
                    title: "Active Days",
                    value: `${core.data.totalActiveDays} Days`
                });
            }
            if (core.data.badgesCount !== undefined && core.data.badgesCount !== null) {
                cards.push({
                    icon: "🎖️",
                    title: "Badges Earned",
                    value: `${core.data.badgesCount}`
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

    function renderSocials(profile) {
        if (!profile) {
            socialsBar.style.display = "none";
            return;
        }

        const links = [];
        if (profile.gitHub) {
            const ghUrl = profile.gitHub.startsWith("http") ? profile.gitHub : `https://github.com/${profile.gitHub}`;
            links.push(`<a href="${ghUrl}" target="_blank" rel="noopener noreferrer" class="social-chip">🐙 GitHub</a>`);
        }
        if (profile.twitter) {
            const twUrl = profile.twitter.startsWith("http") ? profile.twitter : `https://twitter.com/${profile.twitter}`;
            links.push(`<a href="${twUrl}" target="_blank" rel="noopener noreferrer" class="social-chip">🐦 Twitter / X</a>`);
        }
        if (profile.linkedIN) {
            const inUrl = profile.linkedIN.startsWith("http") ? profile.linkedIN : `https://linkedin.com/in/${profile.linkedIN}`;
            links.push(`<a href="${inUrl}" target="_blank" rel="noopener noreferrer" class="social-chip">💼 LinkedIn</a>`);
        }
        if (Array.isArray(profile.website) && profile.website.length > 0 && profile.website[0]) {
            links.push(`<a href="${profile.website[0]}" target="_blank" rel="noopener noreferrer" class="social-chip">🌐 Website</a>`);
        }

        if (links.length > 0) {
            socialsBar.innerHTML = links.join("");
            socialsBar.style.display = "flex";
        } else {
            socialsBar.style.display = "none";
        }
    }

    function shareStats(aggregated) {
        const { core, contest, username } = aggregated;
        const userHandle = core.username || username;
        const totalSolved = core.totalSolved || 0;
        const totalQuestions = core.totalQuestions || 0;
        const rank = core.ranking ? `#${core.ranking.toLocaleString()}` : "Unranked";
        const aura = auraBadge.textContent;
        const acc = core.acceptanceRate || 0;

        let contestInfo = "";
        if (contest && contest.contestAttend > 0) {
            contestInfo = `🏆 Contest Rating: ${Math.round(contest.contestRating)} (Top ${contest.contestTopPercentage}%)\n`;
        }

        const summary = [
            `⚡ LeetCode Vibe Check: @${userHandle}`,
            `✨ Aura: ${aura}`,
            contestInfo.trim(),
            `🌐 World Rank: ${rank}`,
            `📊 Solved: ${totalSolved}/${totalQuestions}`,
            `🟢 Easy: ${core.easySolved || 0} | 🟡 Med: ${core.mediumSolved || 0} | 🔴 Hard: ${core.hardSolved || 0}`,
            `🎯 Acceptance: ${acc}%`,
            `🔗 https://leetcode.com/u/${userHandle}/`
        ].filter(Boolean).join("\n");

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(summary).then(() => {
                copyBtnText.textContent = "Copied! ✨";
                showToast("Stats card copied to clipboard! Share your grind 🚀", "success");
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

    function saveRecentSearch(username) {
        try {
            let recents = JSON.parse(localStorage.getItem("leetmetric_recents") || "[]");
            recents = recents.filter(u => u.toLowerCase() !== username.toLowerCase());
            recents.unshift(username);
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