import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { RepositoriesService } from "src/repositories/repositories.service";
import { Dolos, Report } from "src/dolos";
import { FileString } from "../types";
import { Comparison } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ComparisonsService {

    constructor(
        private user: UsersService,
        private repository: RepositoriesService,
        private prisma: PrismaService) {
    }

    async compareRepositories() {

        const dolosFile = new Dolos();

        const username = "ibanezbendezu";
        const owner1 = "ibanezbendezu";
        const name1 = "tingeso-ev1";
        const onwer2 = "holYadio";
        const name2 = "TingesoPEP1";

        const leftRepo = await this.repository.getRepositoryContent(owner1, name1, username);
        const leftFiles = await dolosFile.stringsToFiles(leftRepo.content);
        const rightRepo = await this.repository.getRepositoryContent(onwer2, name2, username);
        const rightFiles = await dolosFile.stringsToFiles(rightRepo.content);

        const sortStrings = [leftRepo.github_sha, rightRepo.github_sha].sort();
        const sha = sortStrings.join("");

        let repositoryA = await this.prisma.repository.create({
            data: {
                sha: leftRepo.github_sha,
                owner: owner1,
                name: name1,
                totalLines: 0
            }
        });

        let repositoryB = await this.prisma.repository.create({
            data: {
                sha: rightRepo.github_sha,
                owner: onwer2,
                name: name2,
                totalLines: 0
            }
        });

        let comparison = await this.prisma.comparison.create({
            data: {
                sha: sha,
                similarity: 0.0,
                comparisonDate: new Date(),
                repositoryAId: repositoryA.id,
                repositoryBId: repositoryB.id
            }
        });

        let pair = null;
        let fileA = null;

        for (let i = 0; i < leftFiles.length; i++) {
            fileA = await this.prisma.file.create({
                data: {
                    sha: leftFiles[i].sha,
                    filepath: leftFiles[i].path,
                    charCount: leftFiles[i].charCount,
                    lineCount: leftFiles[i].lineCount,
                    repository: { connect: { id: repositoryA.id } }
                }
            });
            repositoryA = await this.prisma.repository.update({
                where: { id: repositoryA.id },
                data: {
                    totalLines: repositoryA.totalLines + fileA.lineCount,
                    files: { connect: { id: fileA.id } }
                }
            });

            for (let j = 0; j < rightFiles.length; j++) {

                let fileB = await this.prisma.file.findUnique({
                    where: {
                        sha: rightFiles[j].sha
                    }
                });

                if (!fileB) {
                    fileB = await this.prisma.file.create({
                        data: {
                            sha: rightFiles[j].sha,
                            filepath: rightFiles[j].path,
                            charCount: rightFiles[j].charCount,
                            lineCount: rightFiles[j].lineCount,
                            repository: { connect: { id: repositoryB.id } }
                        }
                    });

                    repositoryB = await this.prisma.repository.update({
                        where: { id: repositoryB.id },
                        data: {
                            totalLines: repositoryB.totalLines + fileB.lineCount,
                            files: { connect: { id: fileB.id } }
                        }
                    });
                }

                const dolos = new Dolos();
                const result = await dolos.analyze([leftFiles[i], rightFiles[j]]);

                for (let p of result.allPairs()) {
                    pair = await this.prisma.pair.create({
                        data: {
                            similarity: result.allPairs()[0].similarity,

                            leftFilepath: result.allPairs()[0].leftFile.path,
                            charCountLeft: result.allPairs()[0].leftFile.charCount,
                            lineCountLeft: result.allPairs()[0].leftFile.lineCount,

                            rightFilepath: result.allPairs()[0].rightFile.path,
                            charCountRight: result.allPairs()[0].rightFile.charCount,
                            lineCountRight: result.allPairs()[0].rightFile.lineCount,

                            files: { connect: [{ id: fileA.id }, { id: fileB.id }] }
                        }
                    });
                }
            }
        }
    }
    
    async getAllComparisons(): Promise<Comparison[]> {
        return this.prisma.comparison.findMany({
            include: {
                repositoryA: {
                    include: {
                        comparisonsA: true,
                        comparisonsB: true,
                        files: {
                            include: {
                                pairs: {
                                    include: {
                                        fragments: true
                                    }
                                }
                            }
                        }
                    }
                },
                repositoryB: {
                    include: {
                        comparisonsA: true,
                        comparisonsB: true,
                        files: {
                            include: {
                                pairs: {
                                    include: {
                                        fragments: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

}