import { Pipe, PipeTransform } from '@angular/core';
import { flatten } from 'flat';

@Pipe({ name: 'filter' })
export class ProjectSearchPipe implements PipeTransform {

    /**
     * Custom Pipe that filters projects based on search query
     * Each project in the list is being flattened, and then searched in
     * @param projects list of projects retrieved from database
     * @param query 
     */
    transform(projects: any[], query: string): any[] {
        if (query === '') return projects;
        if (projects) {
            return projects.filter((project: any) => {
                if (project) {
                    var projArr: [];
                    projArr = flatten(project);
                    var exists: boolean = false;
                    for (let element of Object.values(projArr)) {
                        if (element) {
                            var value: string = String(element);
                            if (value === query || value.includes(query)) {
                                exists = true;
                                break;
                            }
                        }
                    };
                    return exists;
                }
            });
        }

    }
}