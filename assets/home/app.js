const JENKINS_URL = "https://ci.lucko.me/job/LuckPerms/";
const DISCORD_INVITE_CODE = "luckperms";
const PATREON_CAMPAIGN_CODE = "2298876";

$.getJSON(JENKINS_URL + "lastSuccessfulBuild/api/json?tree=url,artifacts[fileName,relativePath]", function(info) {
    const buildUrl = info["url"];
    let version;

    for (const artifact of info["artifacts"]) {
        const fileName = artifact["fileName"];
        const relativePath = artifact["relativePath"];
        const id = relativePath.substr(0, relativePath.indexOf('/'));

        // save version for later
        if (!version) {
            version = fileName.split("-").pop().slice(0, -4);
        }

        const selector = "#" + id.toLowerCase() + "-dl";
        $(selector).attr("href", buildUrl + "artifact/" + relativePath);
    }

    if (version) {
        $(".version-tag").html("v" + version);
    }
});

$.getJSON("https://discordapp.com/api/invites/" + DISCORD_INVITE_CODE + "?with_counts=true", function(data) {
    $("#discordcount").text(data["approximate_member_count"]);
});

$.getJSON("https://cors-anywhere.herokuapp.com/https://www.patreon.com/api/campaigns/" + PATREON_CAMPAIGN_CODE + "?include=patron_count&fields[campaign]=patron_count", function (data) {
    $("#patreoncount").text(data["data"]["attributes"]["patron_count"]);
});
