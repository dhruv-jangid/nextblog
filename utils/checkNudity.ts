export const checkNudity = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append("media", image);
    formData.append("models", "nudity");
    formData.append("api_user", `${process.env.SIGHTENGINE_API_USER}`);
    formData.append("api_secret", `${process.env.SIGHTENGINE_API_SECRET}`);

    const response = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.status !== "success") {
      return { safe: false, reason: "Try again after sometime!" };
    }

    if (data.nudity.raw >= 0.6 || data.nudity.safe <= 0.4) {
      console.log("Nudity detected!");
      return { safe: false, reason: "NSFW content detected" };
    }

    return { safe: true, reason: "Image is safe" };
  } catch (error) {
    console.log(error);
    return { safe: false, reason: "Failed to analyze image" };
  }
};
