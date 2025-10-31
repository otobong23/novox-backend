import { Request, Response } from "express";
import CrewService from "services/Crew.service";


class CrewController {
   // private crewService: typeof CrewService;

   // constructor() {
   //    this.crewService = CrewService;
   // }

   async getUserCrew(req: Request, res: Response) {
      const email = req.user.email
      const result = await CrewService.getUserCrew(email);
      res.json(result);
   }
}

export default new CrewController();