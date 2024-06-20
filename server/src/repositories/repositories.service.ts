import { Injectable } from "@nestjs/common";
import { Octokit } from "@octokit/rest";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RepositoriesService {
    private octokit: Octokit;

    constructor(private user: UsersService) {
    }

    async getRepositoryContent(owner: string, name: string, username: string) {
        const user_token = await this.user.getUserToken(username);

        this.octokit = new Octokit({ auth: user_token });

        try {
            const repository = await this.octokit.repos.get({ owner, repo: name });

            const { tree_sha, github_sha } = await this.getTreeSha(owner, name, "master");

            const { data } = await this.octokit.git.getTree({
                owner,
                repo: name,
                tree_sha,
                recursive: "1"
            });

            const files = data.tree.filter(item => item.type === "blob" && item.path.startsWith("src/main/java/"));

            const fileContents = await Promise.all(files.map(async (file) => {
                const content = await this.getFileContent(owner, name, file.sha);
                return { path: file.path, sha: file.sha, content };
            }));

            return {
                id: repository.data.id,
                github_sha,
                tree_sha,
                name,
                owner,
                content: fileContents
            };

        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async getTreeSha(owner: string, repo: string, branch: string) {
        const { data } = await this.octokit.repos.getBranch({
            owner,
            repo,
            branch
        });

        const lastCommitSha = data.commit.sha;

        const commit = await this.octokit.git.getCommit({
            owner,
            repo,
            commit_sha: lastCommitSha
        });

        return { tree_sha: commit.data.tree.sha, github_sha: commit.data.sha };
    }

    private async getFileContent(owner: string, repo: string, file_sha: string) {
        const { data } = await this.octokit.git.getBlob({
            owner,
            repo,
            file_sha
        });

        return Buffer.from(data.content, "base64").toString("utf-8");
    }

    async getMultipleReposContent(repos: string[], username: string) {
        for (const repo of repos) {
            await this.getRepositoryContent(repo.split("/")[0], repo.split("/")[1], username);
        }
    }

}