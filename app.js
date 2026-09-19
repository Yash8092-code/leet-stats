/**
 * LeetMetric ⚡ Multi-Platform Competitive Programming Stats Hub
 * Supporting LeetCode, Codeforces & CodeChef with live ratings,
 * real profile avatars, contest analytics, and dynamic cyber styling.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Platforms Definition
    const PLATFORMS = {
        leetcode: {
            id: "leetcode",
            name: "LeetCode",
            icon: "⚡",
            placeholder: "Enter LeetCode handle (e.g. neal_wu, tourist)...",
            presets: ["tourist", "neal_wu", "lee215", "Yash8092"],
            welcomeDesc: "Inspect LeetCode problem solve counts, difficulty breakdown, real avatar, and live contest rating!"
        },
        codeforces: {
            id: "codeforces",
            name: "Codeforces",
            icon: "🔺",
            placeholder: "Enter Codeforces handle (e.g. tourist, Benq, Petr)...",
            presets: ["tourist", "Benq", "Petr", "ecnerwala"],
            welcomeDesc: "Track official Codeforces rating, max rating, Grandmaster rank tiers, organization, and contribution points!"
        },
        codechef: {
            id: "codechef",
            name: "CodeChef",
            icon: "👨‍🍳",
            placeholder: "Enter CodeChef handle (e.g. tourist, gennady.korotkevich)...",
            presets: ["tourist", "gennady.korotkevich", "chandan_007"],
            welcomeDesc: "Inspect CodeChef star rating (1★ - 7★), contest rating, peak ranking, institution, and country standing!"
        }
    };

    let currentPlatform = "leetcode";
    let currentData = null;
    let isRequestInProgress = false;

    // DOM Elements - Dropdown & Header
    const dropdownTrigger = document.getElementById("dropdown-trigger");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const currentPlatformIcon = document.getElementById("current-platform-icon");
    const currentPlatformName = document.getElementById("current-platform-name");

    // Search Form Elements
    const searchForm = document.getElementById("search-form");
    const searchButton = document.getElementById("search-btn");
    const btnText = searchButton.querySelector(".btn-text");
    const btnShortcut = searchButton.querySelector(".btn-shortcut");
    const btnLoader = searchButton.querySelector(".btn-loader");
    const usernameInput = document.getElementById("user-input");
    const clearInputBtn = document.getElementById("clear-input-btn");

    // UI View States
    const welcomeState = document.getElementById("welcome-state");
    const welcomeTitle = document.getElementById("welcome-title");
    const welcomeDesc = document.getElementById("welcome-desc");
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
    const platformBadge = document.getElementById("platform-badge");
    const userSubtext = document.getElementById("user-subtext");
    const platformLink = document.getElementById("platform-link");
    const platformLinkText = document.getElementById("platform-link-text");
    const copyStatsBtn = document.getElementById("copy-stats-btn");
    const copyBtnText = document.getElementById("copy-btn-text");
    const socialsBar = document.getElementById("socials-bar");

    // Contest Banner Elements
    const contestBanner = document.getElementById("contest-banner");
    const contestLabel1 = document.getElementById("contest-label-1");
    const contestLabel2 = document.getElementById("contest-label-2");
    const contestLabel3 = document.getElementById("contest-label-3");
    const contestLabel4 = document.getElementById("contest-label-4");
    const contestRatingEl = document.getElementById("contest-rating");
    const contestGlobalRankEl = document.getElementById("contest-global-rank");
    const contestTopPercentEl = document.getElementById("contest-top-percent");
    const contestAttendedEl = document.getElementById("contest-attended");

    // Progress Banner & Rings
    const progressCardTitle = document.getElementById("progress-card-title");
    const totalSolvedCount = document.getElementById("total-solved-count");
    const totalQuestionsCount = document.getElementById("total-questions-count");
    const totalDenomWrap = document.getElementById("total-denom-wrap");
    const overallPercentage = document.getElementById("overall-percentage");
    const overallProgressBar = document.getElementById("overall-progress-bar");
    const ringsGrid = document.getElementById("rings-grid");

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

    const CIRCUMFERENCE = 2 * Math.PI * 50;

    // Initialize UI for current platform
    setupPlatformUI(currentPlatform);

    // Dropdown Toggle Handlers
    dropdownTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains("show");
        toggleDropdown(!isOpen);
    });

    document.addEventListener("click", () => {
        toggleDropdown(false);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            toggleDropdown(false);
        }
    });

    dropdownMenu.addEventListener("click", (e) => {
        const item = e.target.closest(".dropdown-item");
        if (!item || !item.dataset.platform) return;

        const newPlatform = item.dataset.platform;
        if (newPlatform !== currentPlatform) {
            currentPlatform = newPlatform;
            setupPlatformUI(currentPlatform);
            showToast(`Switched platform to ${PLATFORMS[currentPlatform].name} 🚀`, "success");
        }
        toggleDropdown(false);
    });

    function toggleDropdown(show) {
        if (show) {
            dropdownMenu.classList.add("show");
            dropdownTrigger.setAttribute("aria-expanded", "true");
        } else {
            dropdownMenu.classList.remove("show");
            dropdownTrigger.setAttribute("aria-expanded", "false");
        }
    }

    function setupPlatformUI(platformKey) {
        const platform = PLATFORMS[platformKey];

        // Update Dropdown Display
        currentPlatformIcon.textContent = platform.icon;
        currentPlatformName.textContent = platform.name;

        // Update active class in menu
        dropdownMenu.querySelectorAll(".dropdown-item").forEach(item => {
            item.classList.toggle("active", item.dataset.platform === platformKey);
        });

        // Update Search Input Placeholder & Clear
        usernameInput.placeholder = platform.placeholder;
        usernameInput.value = "";
        clearInputBtn.style.display = "none";

        // Update Hot Picks Chips
        renderPresetTags(platform.presets);

        // Update Recent Searches
        renderRecentSearches();

        // Reset to Welcome Screen
        welcomeTitle.textContent = `${platform.name} Vibe Check`;
        welcomeDesc.textContent = platform.welcomeDesc;
        welcomeState.style.display = "flex";
        loadingState.style.display = "none";
        errorState.style.display = "none";
        statsDisplay.style.display = "none";
    }

    function renderPresetTags(presets) {
        presetTags.innerHTML = presets.map(u => `
            <button class="tag-chip" type="button" data-username="${u}">${u}</button>
        `).join("");
    }

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

    presetTags.addEventListener("click", (e) => {
        const chip = e.target.closest(".tag-chip");
        if (chip && chip.dataset.username) {
            usernameInput.value = chip.dataset.username;
            clearInputBtn.style.display = "block";
            handleSearch();
        }
    });

    recentTags.addEventListener("click", (e) => {
        const chip = e.target.closest(".tag-chip");
        if (chip && chip.dataset.username) {
            usernameInput.value = chip.dataset.username;
            clearInputBtn.style.display = "block";
            handleSearch();
        }
    });

    copyStatsBtn.addEventListener("click", () => {
        if (!currentData) return;
        shareStats(currentData);
    });

    function handleSearch() {
        if (isRequestInProgress) return;

        const username = usernameInput.value.trim();
        if (!username) {
            showToast("Please enter a username or handle", "error");
            usernameInput.focus();
            return;
        }

        if (currentPlatform === "leetcode") {
            fetchLeetCode(username);
        } else if (currentPlatform === "codeforces") {
            fetchCodeforces(username);
        } else if (currentPlatform === "codechef") {
            fetchCodeChef(username);
        }
    }

    function setLoading(isLoading) {
        isRequestInProgress = isLoading;
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

    function showErrorState(title, message) {
        errorTitle.textContent = title;
        errorMessage.textContent = message;
        welcomeState.style.display = "none";
        loadingState.style.display = "none";
        statsDisplay.style.display = "none";
        errorState.style.display = "flex";
    }

    // ==========================================
    // 1. LEETCODE API & RENDERER
    // ==========================================
    async function fetchLeetCode(username) {
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

            if (coreRes.status !== "fulfilled" || !coreRes.value) {
                throw new Error("Unable to fetch core LeetCode stats");
            }

            const coreData = coreRes.value;
            if (coreData.status === "error" || coreData.message === "user does not exist") {
                showErrorState("LeetCode User Not Found 💀", `Could not locate "@${username}" on LeetCode.`);
                return;
            }

            const profileData = profileRes.status === "fulfilled" && profileRes.value && !profileRes.value.errors ? profileRes.value : null;
            const contestData = contestRes.status === "fulfilled" && contestRes.value && !contestRes.value.errors ? contestRes.value : null;

            currentData = {
                platform: "leetcode",
                username: username,
                core: coreData,
                profile: profileData,
                contest: contestData
            };

            saveRecentSearch(username);
            renderRecentSearches();
            renderLeetCodeDashboard(currentData);
            showToast(`Loaded @${username} on LeetCode! 🚀`, "success");

        } catch (error) {
            console.error(error);
            showErrorState("Unable to Fetch LeetCode Stats ⚡", "Check handle spelling or try again in a moment.");
        } finally {
            setLoading(false);
        }
    }

    function renderLeetCodeDashboard(data) {
        const { core, profile, contest, username } = data;
        welcomeState.style.display = "none";
        errorState.style.display = "none";
        statsDisplay.style.display = "flex";

        // Show Rings and LeetCode elements
        ringsGrid.style.display = "grid";
        totalDenomWrap.style.display = "inline";
        progressCardTitle.textContent = "TOTAL SOLVED";
        platformLinkText.textContent = "LeetCode";
        platformLink.href = `https://leetcode.com/u/${encodeURIComponent(username)}/`;

        // Profile Avatar & Names
        displayUsername.textContent = core.username || username;
        avatarInitial.textContent = username.charAt(0).toUpperCase();
        if (profile && profile.avatar && !profile.avatar.includes("default_avatar.jpg")) {
            avatarImg.src = profile.avatar;
            avatarImg.style.display = "block";
            avatarInitial.style.display = "none";
            avatarImg.onerror = () => { avatarImg.style.display = "none"; avatarInitial.style.display = "block"; };
        } else {
            avatarImg.style.display = "none";
            avatarInitial.style.display = "block";
        }

        if (profile && profile.name && profile.name.trim() !== "") {
            displayRealname.textContent = profile.name;
            displayRealname.style.display = "inline-block";
        } else {
            displayRealname.style.display = "none";
        }

        displayCountry.textContent = profile && profile.country ? `📍 ${profile.country}` : "";
        displayCountry.style.display = profile && profile.country ? "inline-block" : "none";

        const org = profile ? (profile.company || profile.school) : null;
        displayAffiliation.textContent = org ? `🏛️ ${org}` : "";
        displayAffiliation.style.display = org ? "inline-block" : "none";

        // Aura Badge
        const solved = Number(core.totalSolved) || 0;
        const ranking = Number(core.ranking) || 0;
        const contestRating = contest ? Math.round(Number(contest.contestRating) || 0) : 0;
        const badgeName = contest && contest.contestBadges ? contest.contestBadges.name : null;

        if (badgeName === "Guardian" || contestRating >= 2200) {
            auraBadge.textContent = "👑 LeetCode Guardian God";
            auraBadge.style.borderColor = "#f59e0b";
        } else if (badgeName === "Knight" || contestRating >= 1850) {
            auraBadge.textContent = "⚔️ LeetCode Knight";
            auraBadge.style.borderColor = "#8b5cf6";
        } else if (ranking > 0 && ranking <= 5000) {
            auraBadge.textContent = "🔥 Algorithm Demon";
            auraBadge.style.borderColor = "#ef4444";
        } else if (solved >= 500) {
            auraBadge.textContent = "⚡ Grandmaster";
            auraBadge.style.borderColor = "#ec4899";
        } else if (solved >= 200) {
            auraBadge.textContent = "🚀 Code Samurai";
            auraBadge.style.borderColor = "#3b82f6";
        } else if (solved >= 50) {
            auraBadge.textContent = "🌱 Rising Coder";
            auraBadge.style.borderColor = "#10b981";
        } else {
            auraBadge.textContent = "🐣 DSA Rookie";
            auraBadge.style.borderColor = "#94a3b8";
        }

        if (badgeName) {
            platformBadge.textContent = `🛡️ ${badgeName}`;
            platformBadge.className = `contest-badge badge-${badgeName.toLowerCase()}`;
            platformBadge.style.display = "inline-flex";
        } else {
            platformBadge.style.display = "none";
        }

        userSubtext.textContent = ranking > 0 ? `Global Rank: #${ranking.toLocaleString()}` : "LeetCode Explorer";
        renderSocials(profile);

        // Contest Banner
        if (contest && contest.contestAttend > 0) {
            contestBanner.style.display = "grid";
            contestLabel1.textContent = "CONTEST RATING";
            contestLabel2.textContent = "GLOBAL RANK";
            contestLabel3.textContent = "PERCENTILE";
            contestLabel4.textContent = "CONTESTS";

            animateValue(contestRatingEl, 0, Math.round(contest.contestRating));
            contestGlobalRankEl.textContent = `#${(contest.contestGlobalRanking || 0).toLocaleString()}`;
            contestTopPercentEl.textContent = `Top ${contest.contestTopPercentage}%`;
            contestAttendedEl.textContent = `${contest.contestAttend} Attended`;
        } else {
            contestBanner.style.display = "none";
        }

        // Overall Solved Bar
        const totalQuestions = Number(core.totalQuestions) || 0;
        const overallPercentValue = totalQuestions > 0 ? ((solved / totalQuestions) * 100).toFixed(1) : "0.0";
        animateValue(totalSolvedCount, 0, solved);
        totalQuestionsCount.textContent = totalQuestions.toLocaleString();
        overallPercentage.textContent = `${overallPercentValue}%`;
        overallProgressBar.style.width = `${Math.min(overallPercentValue, 100)}%`;

        // Update Rings
        updateProgressRing(easyCircle, core.easySolved || 0, core.totalEasy || 0, easySolved, easyTotal, easyPercent);
        updateProgressRing(mediumCircle, core.mediumSolved || 0, core.totalMedium || 0, mediumSolved, mediumTotal, mediumPercent);
        updateProgressRing(hardCircle, core.hardSolved || 0, core.totalHard || 0, hardSolved, hardTotal, hardPercent);

        // Stats Grid
        const cards = [
            { icon: "🏆", title: "World Ranking", value: ranking > 0 ? `#${ranking.toLocaleString()}` : "Unranked" },
            { icon: "🎯", title: "Acceptance Rate", value: core.acceptanceRate ? `${core.acceptanceRate}%` : "0%" },
            { icon: "⭐", title: "Contribution Pts", value: (core.contributionPoints || 0).toLocaleString() },
            { icon: "🔥", title: "Reputation", value: (core.reputation || 0).toLocaleString() }
        ];

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

    // ==========================================
    // 2. CODEFORCES API & RENDERER
    // ==========================================
    async function fetchCodeforces(handle) {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const cleanHandle = encodeURIComponent(handle);
            const userUrl = `https://codeforces.com/api/user.info?handles=${cleanHandle}`;

            const response = await fetch(userUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error("Codeforces API response error");
            }

            const data = await response.json();
            if (data.status !== "OK" || !data.result || data.result.length === 0) {
                showErrorState("Codeforces Handle Not Found 💀", `Could not find "${handle}" on Codeforces.`);
                return;
            }

            const cfUser = data.result[0];
            currentData = {
                platform: "codeforces",
                username: cfUser.handle,
                user: cfUser
            };

            saveRecentSearch(cfUser.handle);
            renderRecentSearches();
            renderCodeforcesDashboard(cfUser);
            showToast(`Loaded ${cfUser.handle} on Codeforces! 🔺`, "success");

        } catch (error) {
            console.error(error);
            showErrorState("Codeforces Lookup Failed 🔺", "Check handle spelling or try again in a few seconds.");
        } finally {
            setLoading(false);
        }
    }

    function renderCodeforcesDashboard(user) {
        welcomeState.style.display = "none";
        errorState.style.display = "none";
        statsDisplay.style.display = "flex";

        // Hide Difficulty rings for Codeforces
        ringsGrid.style.display = "none";
        socialsBar.style.display = "none";

        // Links
        platformLinkText.textContent = "Codeforces";
        platformLink.href = `https://codeforces.com/profile/${encodeURIComponent(user.handle)}`;

        // Avatar & Name
        displayUsername.textContent = user.handle;
        avatarInitial.textContent = user.handle.charAt(0).toUpperCase();
        let avatarUrl = user.titlePhoto || user.avatar;

        if (avatarUrl && !avatarUrl.includes("no-avatar") && !avatarUrl.includes("no-title")) {
            if (avatarUrl.startsWith("//")) avatarUrl = `https:${avatarUrl}`;
            avatarImg.src = avatarUrl;
            avatarImg.style.display = "block";
            avatarInitial.style.display = "none";
            avatarImg.onerror = () => { avatarImg.style.display = "none"; avatarInitial.style.display = "block"; };
        } else {
            avatarImg.style.display = "none";
            avatarInitial.style.display = "block";
        }

        const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
        if (fullName) {
            displayRealname.textContent = fullName;
            displayRealname.style.display = "inline-block";
        } else {
            displayRealname.style.display = "none";
        }

        const location = [user.city, user.country].filter(Boolean).join(", ");
        displayCountry.textContent = location ? `📍 ${location}` : "";
        displayCountry.style.display = location ? "inline-block" : "none";

        displayAffiliation.textContent = user.organization ? `🏛️ ${user.organization}` : "";
        displayAffiliation.style.display = user.organization ? "inline-block" : "none";

        // Codeforces Rank & Aura Badge
        const rating = user.rating || 0;
        const maxRating = user.maxRating || 0;

        const badgeClass = getCodeforcesBadgeClass(user.rank);
        platformBadge.textContent = `🔺 ${user.rank ? capitalize(user.rank) : "Unrated"}`;
        platformBadge.className = `contest-badge ${badgeClass}`;
        platformBadge.style.display = "inline-flex";

        auraBadge.textContent = getCodeforcesAuraTitle(rating);
        auraBadge.style.borderColor = getCodeforcesColor(user.rank);

        userSubtext.textContent = `Codeforces Rating: ${rating} (Peak: ${maxRating})`;

        // Contest Rating Banner
        contestBanner.style.display = "grid";
        contestLabel1.textContent = "CURRENT RATING";
        contestLabel2.textContent = "PEAK RATING";
        contestLabel3.textContent = "CONTRIBUTION";
        contestLabel4.textContent = "FRIENDS";

        animateValue(contestRatingEl, 0, rating);
        contestGlobalRankEl.textContent = `${maxRating}`;
        contestTopPercentEl.textContent = `${user.contribution > 0 ? "+" : ""}${user.contribution || 0}`;
        contestAttendedEl.textContent = `${(user.friendOfCount || 0).toLocaleString()}`;

        // Rating Progress Bar (Scale up to 4000)
        progressCardTitle.textContent = "RATING PROGRESS";
        totalDenomWrap.style.display = "inline";
        animateValue(totalSolvedCount, 0, rating);
        totalQuestionsCount.textContent = "4,000";
        const percent = Math.min(((rating / 4000) * 100), 100).toFixed(1);
        overallPercentage.textContent = `${percent}%`;
        overallProgressBar.style.width = `${percent}%`;

        // Secondary Stats Grid
        const regDate = user.registrationTimeSeconds 
            ? new Date(user.registrationTimeSeconds * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short" })
            : "Unknown";

        const cfCards = [
            { icon: "👑", title: "Current Rank", value: user.rank ? capitalize(user.rank) : "Unrated" },
            { icon: "🚀", title: "Max Rank", value: user.maxRank ? capitalize(user.maxRank) : "Unrated" },
            { icon: "📅", title: "Registered", value: regDate },
            { icon: "⭐", title: "Contribution", value: `${user.contribution || 0}` }
        ];

        statsGrid.innerHTML = cfCards.map(c => `
            <div class="stat-box">
                <div class="stat-icon-wrap">${c.icon}</div>
                <div class="stat-info">
                    <span class="stat-title">${c.title}</span>
                    <span class="stat-number">${c.value}</span>
                </div>
            </div>
        `).join("");
    }

    function getCodeforcesBadgeClass(rank) {
        if (!rank) return "badge-newbie";
        const r = rank.toLowerCase();
        if (r.includes("grandmaster")) return "badge-grandmaster";
        if (r.includes("master")) return "badge-master";
        if (r.includes("candidate")) return "badge-candidate-master";
        if (r.includes("expert")) return "badge-expert";
        if (r.includes("specialist")) return "badge-specialist";
        if (r.includes("pupil")) return "badge-pupil";
        return "badge-newbie";
    }

    function getCodeforcesColor(rank) {
        if (!rank) return "#94a3b8";
        const r = rank.toLowerCase();
        if (r.includes("grandmaster")) return "#ef4444";
        if (r.includes("master")) return "#f59e0b";
        if (r.includes("candidate")) return "#a855f7";
        if (r.includes("expert")) return "#3b82f6";
        if (r.includes("specialist")) return "#06b6d4";
        if (r.includes("pupil")) return "#10b981";
        return "#94a3b8";
    }

    function getCodeforcesAuraTitle(rating) {
        if (rating >= 3000) return "👑 Legendary Titan";
        if (rating >= 2600) return "🔥 Grandmaster Demon";
        if (rating >= 2300) return "⚔️ Mastermind";
        if (rating >= 1900) return "⚡ Candidate Deity";
        if (rating >= 1600) return "🚀 Expert Tactician";
        if (rating >= 1400) return "⚡ Specialist";
        if (rating >= 1200) return "🌱 Pupil Grinder";
        return "🐣 Competitive Newbie";
    }

    // ==========================================
    // 3. CODECHEF API & RENDERER
    // ==========================================
    async function fetchCodeChef(username) {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const cleanUser = encodeURIComponent(username);
            const url = `https://competeapi.vercel.app/user/codechef/${cleanUser}`;

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error("CodeChef API error");
            }

            const data = await response.json();
            if (!data || (!data.rating_number && !data.rating)) {
                showErrorState("CodeChef User Not Found 👨‍🍳", `Could not find "${username}" on CodeChef.`);
                return;
            }

            currentData = {
                platform: "codechef",
                username: username,
                chef: data
            };

            saveRecentSearch(username);
            renderRecentSearches();
            renderCodeChefDashboard(data, username);
            showToast(`Loaded ${username} on CodeChef! 👨‍🍳`, "success");

        } catch (error) {
            console.error(error);
            showErrorState("CodeChef Lookup Failed 👨‍🍳", "Check username spelling or try again in a few seconds.");
        } finally {
            setLoading(false);
        }
    }

    function renderCodeChefDashboard(chef, searchHandle) {
        welcomeState.style.display = "none";
        errorState.style.display = "none";
        statsDisplay.style.display = "flex";

        ringsGrid.style.display = "none";
        socialsBar.style.display = "none";

        const handle = chef.username || searchHandle;
        platformLinkText.textContent = "CodeChef";
        platformLink.href = `https://www.codechef.com/users/${encodeURIComponent(handle)}`;

        displayUsername.textContent = handle;
        avatarInitial.textContent = handle.charAt(0).toUpperCase();
        avatarImg.style.display = "none";
        avatarInitial.style.display = "block";

        displayRealname.style.display = "none";
        displayCountry.textContent = chef.country ? `📍 ${chef.country}` : "";
        displayCountry.style.display = chef.country ? "inline-block" : "none";

        displayAffiliation.textContent = chef.institution ? `🏛️ ${chef.institution}` : "";
        displayAffiliation.style.display = chef.institution ? "inline-block" : "none";

        // CodeChef Stars & Aura Badge
        const rating = Number(chef.rating_number) || (Number(chef.rating) || 0);
        const maxRank = Number(chef.max_rank) || rating;
        const rawStars = chef.rating ? String(chef.rating).replace(/\s+/g, "").trim() : "";
        const stars = rawStars.includes("★") ? rawStars : (chef.stars ? `${chef.stars}★` : "1★");

        platformBadge.textContent = `⭐ ${stars}`;
        platformBadge.className = "contest-badge badge-guardian";
        platformBadge.style.display = "inline-flex";

        auraBadge.textContent = getCodeChefAuraTitle(rating);
        auraBadge.style.borderColor = "#f59e0b";

        userSubtext.textContent = `CodeChef Rating: ${rating} • Peak: ${maxRank}`;

        // Contest Rating Banner
        contestBanner.style.display = "grid";
        contestLabel1.textContent = "RATING";
        contestLabel2.textContent = "STAR TIER";
        contestLabel3.textContent = "PEAK RATING";
        contestLabel4.textContent = "USER TYPE";

        animateValue(contestRatingEl, 0, rating);
        contestGlobalRankEl.textContent = `${stars}`;
        contestTopPercentEl.textContent = `${maxRank}`;
        contestAttendedEl.textContent = `${chef.user_type || "Competitive"}`;

        // Progress Bar (Scale up to 3500)
        progressCardTitle.textContent = "RATING LEVEL";
        totalDenomWrap.style.display = "inline";
        animateValue(totalSolvedCount, 0, rating);
        totalQuestionsCount.textContent = "3,500";
        const percent = Math.min(((rating / 3500) * 100), 100).toFixed(1);
        overallPercentage.textContent = `${percent}%`;
        overallProgressBar.style.width = `${percent}%`;

        // Secondary Cards
        const cleanRank = (r) => (r && !r.includes("Inactive")) ? r.trim() : "Unranked";
        const chefCards = [
            { icon: "⭐", title: "Star Rating", value: stars },
            { icon: "🏆", title: "Global Rank", value: cleanRank(chef.global_rank) },
            { icon: "🌍", title: "Country Rank", value: cleanRank(chef.country_rank) },
            { icon: "🎓", title: "User Category", value: chef.user_type || "Student" }
        ];

        statsGrid.innerHTML = chefCards.map(c => `
            <div class="stat-box">
                <div class="stat-icon-wrap">${c.icon}</div>
                <div class="stat-info">
                    <span class="stat-title">${c.title}</span>
                    <span class="stat-number">${c.value}</span>
                </div>
            </div>
        `).join("");
    }

    function getCodeChefAuraTitle(rating) {
        if (rating >= 2500) return "👑 7★ Grandmaster";
        if (rating >= 2200) return "🔥 6★ Algorithm Demon";
        if (rating >= 2000) return "⚔️ 5★ Master Chef";
        if (rating >= 1800) return "⚡ 4★ Daily Grinder";
        if (rating >= 1600) return "🚀 3★ Code Knight";
        if (rating >= 1400) return "🌱 2★ Rising Star";
        return "🐣 1★ Novice Chef";
    }

    // ==========================================
    // SHARED UTILITIES
    // ==========================================
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

    function shareStats(data) {
        let summary = "";
        if (data.platform === "leetcode") {
            const { core, contest, username } = data;
            const userHandle = core.username || username;
            summary = [
                `⚡ LeetCode Vibe Check: @${userHandle}`,
                `✨ Aura: ${auraBadge.textContent}`,
                contest ? `🏆 Contest Rating: ${Math.round(contest.contestRating)} (Top ${contest.contestTopPercentage}%)` : null,
                `📊 Solved: ${core.totalSolved || 0}/${core.totalQuestions || 0} (${overallPercentage.textContent})`,
                `🎯 Acceptance: ${core.acceptanceRate || 0}%`,
                `🔗 https://leetcode.com/u/${userHandle}/`
            ].filter(Boolean).join("\n");
        } else if (data.platform === "codeforces") {
            const u = data.user;
            summary = [
                `🔺 Codeforces Vibe Check: @${u.handle}`,
                `✨ Aura: ${auraBadge.textContent}`,
                `👑 Rank: ${capitalize(u.rank || "Unrated")} (Peak: ${capitalize(u.maxRank || "Unrated")})`,
                `🏆 Rating: ${u.rating || 0} (Peak: ${u.maxRating || 0})`,
                `⭐ Contribution: ${u.contribution || 0}`,
                `🔗 https://codeforces.com/profile/${u.handle}`
            ].join("\n");
        } else if (data.platform === "codechef") {
            const c = data.chef;
            summary = [
                `👨‍🍳 CodeChef Vibe Check: @${data.username}`,
                `✨ Aura: ${auraBadge.textContent}`,
                `⭐ Rating: ${c.rating || "1★"} (${c.rating_number || 0})`,
                `🏆 Peak Rating: ${c.max_rank || 0}`,
                `🏛️ ${c.institution || "CodeChef Competitor"}`,
                `🔗 https://www.codechef.com/users/${data.username}`
            ].join("\n");
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(summary).then(() => {
                copyBtnText.textContent = "Copied! ✨";
                showToast("Stats card copied to clipboard! 🚀", "success");
                setTimeout(() => { copyBtnText.textContent = "Share Vibe"; }, 2000);
            }).catch(() => fallbackCopyText(summary));
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
            const key = `leetmetric_recents_${currentPlatform}`;
            let recents = JSON.parse(localStorage.getItem(key) || "[]");
            recents = recents.filter(u => u.toLowerCase() !== username.toLowerCase());
            recents.unshift(username);
            if (recents.length > 4) recents = recents.slice(0, 4);
            localStorage.setItem(key, JSON.stringify(recents));
        } catch (e) {
            console.warn(e);
        }
    }

    function renderRecentSearches() {
        try {
            const key = `leetmetric_recents_${currentPlatform}`;
            const recents = JSON.parse(localStorage.getItem(key) || "[]");
            if (recents.length > 0) {
                recentGroup.style.display = "flex";
                recentTags.innerHTML = recents.map(u => `
                    <button class="tag-chip" type="button" data-username="${u}">@${u}</button>
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
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    }

    function capitalize(str) {
        if (!str) return "";
        return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }
});