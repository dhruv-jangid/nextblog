import * as nsfwjs from "nsfwjs";
import * as tf from "@tensorflow/tfjs";

let nsfwModel: nsfwjs.NSFWJS | null = null;
if (process.env.NODE_ENV === "production") {
  tf.enableProdMode();
}

export const checkNudity = async (image: File) => {
  try {
    if (!nsfwModel) {
      nsfwModel = await nsfwjs.load("/models/mobilenet_v2/model.json");
    }

    const img = document.createElement("img");
    img.src = URL.createObjectURL(image);

    await new Promise((resolve) => {
      img.onload = () => resolve(true);
    });

    const predictions = await nsfwModel.classify(img);

    const rawScore =
      predictions.find((p) => p.className === "Porn")?.probability ?? 0;
    const sexyScore =
      predictions.find((p) => p.className === "Sexy")?.probability ?? 0;

    if (rawScore >= 0.6 || sexyScore >= 0.6) {
      throw new Error("Inappropriate image");
    }

    URL.revokeObjectURL(img.src);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
