import { Octokit } from "octokit"

const octokit = new Octokit({
    auth: 'YOUR-TOKEN'
})

export const getPackageInformationFromUsername = async (username: string) => {
    // TODO: Authenticate request
    // TODO: Getting image information from repository with Octokit
    let response = await octokit.request(`GET /users/${username}/packages`, {
        username: 'USERNAME',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })


    console.log(response);
    return response
}