function formUrl(buildNumber, version, type) {
    return "https://ci.lucko.me/job/LuckPerms/" + buildNumber + "/artifact/" + type.toLowerCase() + "/target/LuckPerms-" + type + "-" + version + ".jar";
}

$.getJSON("https://ci.lucko.me/job/LuckPerms/api/json", function(info) {
    const buildUrl = info["lastSuccessfulBuild"]["url"];
    $.getJSON(buildUrl + "api/json", function(build) {
        const sampleArtifact = build["artifacts"][0];
        const sampleName = sampleArtifact["displayPath"];

        const version = sampleName.split("-")[2].slice(0, -4);
        const buildNumber = build["id"];

        $(".version-tag").html("v" + version);
        for (const type of ["Bukkit", "Bungee", "Sponge", "Nukkit"]) {
            const selector = "#" + type.toLowerCase() + "-dl";
            $(selector).click(function() {
                window.location.href = formUrl(buildNumber, version, type);
            });
        }
    })
});

$.getJSON("https://discordapp.com/api/invites/W3FzxHA?with_counts=true", function(data) {
    $("#discordcount").text(data["approximate_member_count"]);
});