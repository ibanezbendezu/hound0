import { Controller, Get, Post, Body } from "@nestjs/common";
import { ComparisonsService } from "./comparisons.service";

@Controller("comparisons")
export class ComparisonsController {

    constructor(private readonly comparisonService: ComparisonsService) {
    }

    @Post()
    async compareRepositories() {
        return await this.comparisonService.compareRepositories();
    }

    @Get()
    async getAllComparisons() {
        return await this.comparisonService.getAllComparisons();
    }

    

}
