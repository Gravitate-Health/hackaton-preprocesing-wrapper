import { Response, Request } from "express";
import { Logger } from "../utils/Logger";
import { getK8sPodByLabel } from '../utils/k8sClient';
import { getPackageInformationFromUsername } from '../utils/githubRegistryClient';
import { V1Pod } from "@kubernetes/client-node";
import {PreprocessingProvider} from "../providers/preprocessing.provider"

const PARTICIPANT_LABEL_SELECTOR = process.env.PARTICIPANT_LABEL_SELECTOR || "";
const CONTAINER_NAME = process.env.CONTAINER_NAME || "";
const HACKATON_IMAGE_BASE_URL = process.env.HACKATON_IMAGE_BASE_URL || "";
const PARTICIPANT_GITHUB_NAME = process.env.PARTICIPANT_GITHUB_NAME || "";
const dockerLatestImageUrl = `${HACKATON_IMAGE_BASE_URL}/${PARTICIPANT_GITHUB_NAME}/gh-hackaton-preprocessor/${PARTICIPANT_REPO_NAME}:latest`

let preprocessingProvider = new PreprocessingProvider("")

const getParticipantPreprocessingService = () => {
}

const getPreprocessingPod = async () => {
  return await getK8sPodByLabel(PARTICIPANT_LABEL_SELECTOR)
}

const getImageSHA256FromPod = (pod: V1Pod) => {
  let sha256: string
  try {
    let containerStatuses = pod.status!.containerStatuses
    let container = containerStatuses!.find(container => container.name === CONTAINER_NAME)
    if (container) {
      sha256 = container.imageID.split("sha256:")[1]
      return sha256
    }
  } catch (error) {
    console.log(error);
  }
}

const getImageLatestSHA256FromUserRepository = async () => {
  // TODO: Implement getting latest SHA from package information
  let packageInformation = await getPackageInformationFromUsername(PARTICIPANT_GITHUB_NAME)

  return "MOCKED_SHA_PENDING_FOR_IMPLEMENTATION"

}

const callPreprocess = async (epi: any) => {
  // Parse preprocessors
  try {
    preprocessors = await preprocessingProvider.callPreprocessingService(reqPreprocessors)
  } catch (error) {
    res.status(HttpStatusCode.InternalServerError).send({
      error: "There was an error"
    })
  }
}

export const preprocess = async (req: Request, res: Response) => {
  let epi = req.body;
  let preprocessedEpi: any;
  console.log(`Received ePI with Length: ${JSON.stringify(epi).length}`);
  Logger.logInfo('preprocessing.ts', 'preprocess', `queried /preprocess function with epi ID: ${JSON.stringify(epi['id'])}`)

  // Steps
  // 1. Get current preprocessor
  let pod: V1Pod = await getPreprocessingPod()

  // 2. Get container image's SHA256 value
  let imageCurrentSHA = await getImageSHA256FromPod(pod)
  // 3. Get image latest SHA256 value from Github
  let imageLatestSHA = await getImageLatestSHA256FromUserRepository()
  // 4. Compare them
  if (imageLatestSHA === imageCurrentSHA) {
    preprocessedEpi = await callPreprocess(epi)
  }
  // IF (step 2 == step 3) 
  //    bypass preprocessor original query
  // ELSE 
  //    pull latest image to cluster
  //    restart preprocessor container
  //    send response. Tell the user to wait some seconds and try again

  console.log(imageCurrentSHA);

  res.status(200).send(pod);
  return
};
