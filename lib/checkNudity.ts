const api_user = process.env.SIGHTENGINE_API_USER;
const api_secret = process.env.SIGHTENGINE_API_SECRET;
if (!api_user || !api_secret) {
  throw new Error("SightEngine ENVs required");
}

export const checkNudity = async ({
  image,
}: {
  image: File;
}): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("media", image);
    formData.append("models", "nudity");
    formData.append("api_user", api_user);
    formData.append("api_secret", api_secret);

    const response = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: formData,
    });
    const { status, nudity } = await response.json();

    if (status !== "success") {
      throw new Error("Please try again later");
    }

    if (nudity.raw >= 0.6 || nudity.safe <= 0.4) {
      throw new Error("NSFW content detected");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
