import { Response, Request } from "express";
import { Logger } from "../utils/Logger";
import { getK8sPodByLabel } from '../utils/k8sClient';
import { V1Pod } from "@kubernetes/client-node";

const PARTICIPANT_LABEL_SELECTOR = process.env.PARTICIPANT_LABEL_SELECTOR || "";
const CONTAINER_NAME = process.env.CONTAINER_NAME || "";


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
    if(container) {
      sha256 = container.imageID.split("sha256:")[1]
      return sha256
    }
  } catch (error) {
    console.log(error);
  }
}

const callPreprocess = async (epi: any) => {

}

export const preprocess = async (req: Request, res: Response) => {
  let epi = req.body;
  console.log(`Received ePI with Length: ${JSON.stringify(epi).length}`);
  Logger.logInfo('preprocessing.ts', 'preprocess', `queried /preprocess function with epi ID: ${JSON.stringify(epi['id'])}`)

  let pod: V1Pod = await getPreprocessingPod()

  let imageSHA = getImageSHA256FromPod(pod)
  console.log(imageSHA);


  res.status(200).send(pod);
  return
};
