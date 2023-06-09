import * as k8s from "@kubernetes/client-node";

let environment = process.env.ENVIRONMENT;
console.log(`Connecting to k8s cluster in ${environment} mode`);

const kc = new k8s.KubeConfig();

if (environment === "dev") {
  let cluster = {
    name: process.env.CLUSTER_NAME,
    server: process.env.CLUSTER_SERVER,
    caData: process.env.CLUSTER_CADATA,
  };
  let user = {
    name: process.env.USER_NAME,
    token: process.env.USER_TOKEN,
  };
  let context = {
    name: process.env.CONTEXT_NAME,
    user: user.name,
    cluster: cluster.name,
  };
  kc.loadFromOptions({
    clusters: [cluster],
    users: [user],
    contexts: [context],
    currentContext: context.name,
  });
} else {
  kc.loadFromCluster();
}

const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

export async function getK8sPodByLabel(labelSelector: string): Promise<k8s.V1Pod> {
  const pods = await coreV1Api.listNamespacedPod(
    "default",
    undefined,
    false,
    undefined,
    undefined,
    labelSelector
  );
  //console.log(pods.body.items);
  let v1Pod = pods.body.items[0]
  return v1Pod;
}