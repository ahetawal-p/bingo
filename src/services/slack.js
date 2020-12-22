const slack = {};

slack.share = async (user, base64Image, boardTitle, userMessage) => {
    const requestBody = new FormData();
    const newFileRes = await fetch(base64Image)
    const blob = await newFileRes.blob()
    const file = new File([blob], `${boardTitle}.png`, { type: "image/png" });
    requestBody.append('token', process.env.REACT_APP_SLACK_TOKEN);
    requestBody.append('channels', "thgo");
    requestBody.append('file', file);
    requestBody.append('title', boardTitle);
    requestBody.append("initial_comment", userMessage);

    const uploadResponse = await fetch("https://slack.com/api/files.upload", {
        method: "POST",
        body: requestBody,
    });

    const uploadBody = await uploadResponse.json();
    if (!uploadBody.ok) {
        throw new Error(JSON.stringify(uploadBody));
    }
    return uploadBody
}
export default slack;