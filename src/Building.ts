import {vec3, vec4, mat4} from 'gl-matrix';
import Structure from './geometry/Structure';

export enum BuildingType {
    HOUSE,
    BIGHOUSE,
    HOTEL,
    OFFICE,
    SKYSCRAPER,
};

const PI = 3.14159;

class Building {
    type: BuildingType;
    dimensions: vec3; // Width, depth, height of this building
    stories: number;
    sectionsW: number;
    sectionsD: number;
    frontwall: string[] = [];
    leftwall: string[] = [];
    rightwall: string[] = [];
    backwall: string[] = [];
    roof: string[] = [];
    garage: boolean = false;

    // Stuff to hold VBO data
    positions: number[] = [];
    normals: number[] = [];
    colors: number[] = [];
    indices: number[] = [];

    constructor(t: BuildingType, dim: vec3) {
        this.dimensions = vec3.clone(dim);
        this.type = t;
        this.generateAspects();
    }

    generateAspects() { // This function will generate all the features of this particular buildingm 
        this.stories = Math.floor(this.dimensions[1]);
        
        if (this.type == BuildingType.HOUSE) {
            this.generateHouse();
            this.generateHouseVbos();
        }
        else if (this.type == BuildingType.BIGHOUSE) {
            this.generateBigHouse();
            this.generateBigHouseVbos();
        }
        else if (this.type == BuildingType.HOTEL) {
            this.generateHotel();
            this.generateHotelVbos();
        }
        else if (this.type == BuildingType.OFFICE) {
            this.generateOffice();
            this.generateOfficeVbos();
        }
        else if (this.type == BuildingType.SKYSCRAPER) {
            this.generateSkyscraper();
            this.generateSkyscraperVbos();
        }
    }

    generateHouse() {
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width / (2.0 / 3.0));
        this.sectionsD = Math.floor(depth);


        for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
            this.frontwall.push('['); // Characters starts a story
            this.backwall.push('[');
            this.leftwall.push('[');
            this.rightwall.push('[');
            for (let i = 0; i < this.sectionsW; i++) { // For each section in the width set values for front and back wall
                let rand = Math.random();
                if (rand < 0.2 * s) { // Small Window
                    this.frontwall.push('w');
                }
                else if (rand < (0.2 * s + 0.1)) { // double Window
                    this.frontwall.push('W');
                }
                else {
                    this.frontwall.push('_');
                }

                rand = Math.random();
                if (rand < 0.2) { // Small Window
                    this.backwall.push('w');
                }
                else if (rand < 0.3) { // double Window
                    this.backwall.push('W');
                }
                else {
                    this.backwall.push('_');
                }
                
            }
            for (let i = 0; i < this.sectionsD; i++) { // For each section in the depth
                let rand = Math.random();
                if (rand < 0.2 * s) { // Small Window
                    this.leftwall.push('w');
                }
                else { // Sides of a small house should not have double windows
                    this.leftwall.push('_');
                }

                rand = Math.random();
                if (rand < 0.2 * s) { // Small Window
                    this.rightwall.push('w');
                }
                else {
                    this.rightwall.push('_');
                }
            }
            this.frontwall.push(']'); // Characters ends a story
            this.backwall.push(']');
            this.leftwall.push(']');
            this.rightwall.push(']');
        }

        let rand = Math.random();
        let doorLoc = Math.floor(4 * rand * (1.0 - rand) * this.sectionsW); // Set the location of the door. Probablility skewed towards center
        this.frontwall[doorLoc + 1] = 'D';

        if (this.sectionsW < 3) {
            this.roof.push('F');
        }
        else {
            if (Math.random() < 0.3) {
                this.roof.push('F');
            }
            else {
                this.roof.push('P');
            }
        }
        if (Math.random() < 0.2) {
            this.garage = true;
        }

    }
    
    generateBigHouse() { // This is closer to a mansion
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width);
        this.sectionsD = Math.floor(depth / 2.0);

        for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
            this.frontwall.push('['); // Characters starts a story
            this.backwall.push('[');
            this.leftwall.push('[');
            this.rightwall.push('[');
            for (let i = 0; i < this.sectionsW; i++) {
                //Frontwall
                let rand = Math.random(); 
                if (i == 0 || i == (this.sectionsW - 1)) { // the ends of a mansion can have extentions or towers
                    if (rand < 0.2) {
                        this.frontwall.push('T');
                    }
                    else if (rand < 0.5) {
                        this.frontwall.push('B');
                    }
                    else {
                        rand = Math.random();
                        if (rand < 0.5) {
                            this.frontwall.push('W');
                        }
                        else {
                            this.frontwall.push('_');
                        }
                    }
                }
                else {
                    rand = Math.random();
                    if (rand < 0.7) {
                        this.frontwall.push('W');
                    }
                    else {
                        this.frontwall.push('_');
                    }
                }
                // backwall
                rand = Math.random(); 
                if (rand < 0.75) {
                    this.backwall.push('W');
                }
                else {
                    this.backwall.push('_');
                }
            }

            for (let i = 0; i < this.sectionsD; i++) {
                // Leftwall
                let rand = Math.random();
                if (rand < 0.8) {
                    this.leftwall.push('W');
                }
                else {
                    this.leftwall.push('_');
                }
                // Rightwall
                rand = Math.random();
                if (rand < 0.8) {
                    this.rightwall.push('W');
                }
                else {
                    this.rightwall.push('_');
                }
            }

            this.frontwall.push(']'); // Characters ends a story
            this.backwall.push(']');
            this.leftwall.push(']');
            this.rightwall.push(']');
        }

        if (this.sectionsW % 2 == 0) { // Door is centered with 3 sections
            let mid = this.sectionsW / 2;
            this.frontwall[mid] = 'D';
            this.frontwall[mid + 1] = 'D';
            this.frontwall[mid + 2] = 'D';
        }
        else { // Door is centered with 2 sections
            let mid = (this.sectionsW - 1) / 2;
            this.frontwall[mid + 1] = 'D';
            this.frontwall[mid + 2] = 'D';
        }

        this.roof.push('P'); // All mansion roofs have points

        if (Math.random() < 0.1) {
            this.garage = true;
        }
    }

    generateHotel() {
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width / 2) * 2;
        this.sectionsD = 1;

        let doublesided = Math.random() < 0.5; // Determines if the hotel has rooms on both sides or not
        for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
            this.frontwall.push('['); // Characters starts a story
            this.backwall.push('[');
            this.leftwall.push('[');
            this.rightwall.push('[');
            for (let i = 0; i < this.sectionsW; i++) {
                let rand = Math.random(); 
                if (i == 0 || i == (this.sectionsW - 1)) {
                    if (rand < 0.8) {
                        this.frontwall.push('B');
                    }
                    else {
                        this.frontwall.push('_');
                    }
                    this.backwall.push('_');
                }
                else if (i % 2 == 0) { // If its not at the end alternate windows and doors
                    this.frontwall.push('W');
                    if (doublesided) {
                        this.backwall.push('W');
                    }
                    else {
                        this.backwall.push('_');
                    }
                }
                else {
                    this.frontwall.push('D')
                    if (doublesided) {
                        this.backwall.push('D');
                    }
                    else {
                        this.backwall.push('_');
                    }
                }
            }
            this.leftwall.push('_'); // No windows on the sides of the hotel
            this.rightwall.push('_');


            this.frontwall.push(']'); // Characters ends a story
            this.backwall.push(']');
            this.leftwall.push(']');
            this.rightwall.push(']');
        }

        this.roof.push('F');
        this.garage = true; // Garage serves as the service desk
    }

    generateOffice() { // Office grammar is a bit different from the others
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        this.sectionsW = Math.floor(width);
        this.sectionsD = Math.floor(depth);

            
            for (let s = 0; s < this.stories; s++) { // For each story we have to fill each wall sections
                this.frontwall.push('['); // Characters starts a story
                this.backwall.push('[');
                this.leftwall.push('[');
                this.rightwall.push('[');

                let started = false;
                let ended = false;
                for (let i = 0; i < this.sectionsW; i++) { // Assume each section of an office building has a window
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsW / 2) && rand < 0.1) { // Start an extended or inset section
                            started = true;
                            this.frontwall.push('E');
                        }
                        else {
                            this.frontwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsW / 2) && rand < 0.8) { // End the section
                            ended = true;
                            this.frontwall.push('w');
                        }
                        else {
                            this.frontwall.push('E');
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.frontwall.push('w');
                    } 
                }

                started = false;
                ended = false;
                for (let i = 0; i < this.sectionsW; i++) { // Repeat for the back wall
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsW / 2) && rand < 0.1) { // Start an extended or inset section
                            started = true;
                            this.backwall.push('E');
                        }
                        else {
                            this.backwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsW / 2) && rand < 0.8) { // End the section
                            ended = true;
                            this.backwall.push('w');
                        }
                        else {
                            this.backwall.push('E');
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.backwall.push('w');
                    } 
                }
                started = false;
                ended = false;
                for (let i = 0; i < this.sectionsD; i++) { // Do the same for the left wall
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsD / 2) && rand < 0.1) { // Start an extended or inset section
                            started = true;
                            this.leftwall.push('E');
                        }
                        else {
                            this.leftwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsD / 2) && rand < 0.9) { // End the section
                            ended = true;
                            this.leftwall.push('w');
                        }
                        else {
                            this.leftwall.push('E');
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.leftwall.push('w');
                    } 
                }
                started = false;
                ended = false;
                for (let i = 0; i < this.sectionsD; i++) { // Do the same for the right wall
                    let rand = Math.random();
                    if (!started) {
                        if (i < (this.sectionsD / 2) && rand < 0.1) { // Start an extended or inset section
                            started = true;
                            this.rightwall.push('E');
                        }
                        else {
                            this.rightwall.push('w');
                        }
                    }
                    else if (!ended) { // If we have started but not ended the extended/inset section
                        if (i > (this.sectionsD / 2) && rand < 0.9) { // End the section
                            ended = true;
                            this.rightwall.push('w');
                        }
                        else {
                            this.rightwall.push('E');
                        }
                    }
                    else { // If we already started and ended a section on this wall
                        this.rightwall.push('w');
                    } 
                }

                this.frontwall.push(']'); // Characters ends a story
                this.backwall.push(']');
                this.leftwall.push(']');
                this.rightwall.push(']');
            }

        this.garage = false; // no garage in an office

        let doorWidth = Math.floor(Math.random() * (this.sectionsW - 2)) + 2; // door must be at least 2 sections wide
        let doorStart = Math.floor(Math.random() * (this.sectionsW - doorWidth));
        for (let i = 0; i < doorWidth; i++) { // Set door sections
            this.frontwall[doorStart + i + 1] = 'D';
        }

    }

    generateSkyscraper() {
        let width = this.dimensions[0];
        let depth = this.dimensions[2];
        
        let roofrand = Math.random();
        // The first 3 types of office buildings are very standardized
        if (roofrand < 0.4) { // flat top skyscraper
            this.roof.push('F');
        }
        else if (roofrand < 0.8) { // Pointed top skyscraper
            this.roof.push('P')
        }
        else { // A Round Skyscraper
            this.roof.push('R');
        }
        roofrand = (Math.random() * 5) + 1; // How many layered tiers the roof has

        for (let i = 0; i < roofrand; i++) { // Add each tier to the array
            this.roof.push('T');
        }

        // Skyscrapers assume all sections are window/wall/window pattern
        // the ground floor is all doors

        this.garage = false; // no garage
    }

    pushColor(r: number, g: number, b: number, n: number) {
        for (let i = 0; i < n; i++) {
            this.colors.push(r);
            this.colors.push(g);
            this.colors.push(b);
            this.colors.push(1);
        }
    }

    // the next few functions parse the string data and create vbos for the building
    generateHouseVbos() { 
        let temppos = Structure.createCubePos();
        let tempnor = Structure.createCubeNor();
        let tempidx = Structure.createCubeIdx(0);

        for (let i = 0; i < temppos.length; i = i + 4) {
            temppos[i] *= this.dimensions[0];
            temppos[i + 1] *= this.dimensions[1];
            temppos[i + 2] *= this.dimensions[2];
        }

        this.positions = temppos;
        this.normals = tempnor;
        this.indices = tempidx;
        this.pushColor(0.96, 0.96, 0.89, temppos.length / 4);

        let offsetW = this.dimensions[0] / this.sectionsW;
        let offsetD = this.dimensions[2] / this.sectionsD;
        let offsetH = this.dimensions[1] / this.stories;

        let story = 0;
        let section = 0;
        for (let i = 0; i < this.backwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetW,offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetW * section, offsetH * story, this.dimensions[2]);
            let s = this.backwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.6, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.2, 0.3, 0.01));
                section++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos();
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0.1, 0.1, 0.1, 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.8, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.1, 0.3, 0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.frontwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetW, offsetH, -1);
            let off: vec3 = vec3.fromValues(offsetW * section, offsetH * story, 0);
            let s = this.frontwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'D') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.18, 0.18, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.5, 0.8, 1));
                vec3.add(off, off, vec3.fromValues(0.25, 0, -0.01));
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.6, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.2, 0.3, -0.01));
                section++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos();
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0.1, 0.1, 0.1, 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.8, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.1, 0.3, -0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(-nor[n], -nor[n + 1], -nor[n + 2]));

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.leftwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetD, offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetD * section, offsetH * story, 0);
            let s = this.leftwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.4, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.3, 0.3, -0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                let vpos = vec3.rotateY(vec3.create(), vec3.fromValues(pos[n], pos[n + 1], pos[n + 2]), 
                vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), PI / 2);

                this.positions.push(vpos[0]);
                this.positions.push(vpos[1]);
                this.positions.push(vpos[2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));
                vec3.rotateY(nvec, nvec, vec3.fromValues(0,0,0), PI / 2);

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.leftwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetD, offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetD * section, offsetH * story, 0);
            let s = this.leftwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'w') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.4, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.3, 0.3, -0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                let vpos = vec3.rotateY(vec3.create(), vec3.fromValues(pos[n], pos[n + 1], pos[n + 2]), 
                vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), -PI / 2);

                this.positions.push(vpos[0]);
                this.positions.push(vpos[1]);
                this.positions.push(vpos[2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));
                vec3.rotateY(nvec, nvec, vec3.fromValues(0,0,0), -PI / 2);

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        let pos: number[] = [];
        let nor: number[] = [];
        let idx: number[] = [];
        let scale: vec3 = vec3.fromValues(this.dimensions[0] + offsetW / 2, offsetH / 2, this.dimensions[2] + offsetD / 2);
        let off: vec3 = vec3.fromValues(-offsetW / 4, this.dimensions[1], -offsetD / 4);
        if (this.roof[0] == 'F') {
            pos = Structure.createCubePos();
            nor = Structure.createCubeNor();
            idx = Structure.createCubeIdx(this.positions.length / 4);
        }
        else {
            pos = Structure.createPRoofPos();
            nor = Structure.createPRoofNor();
            idx = Structure.createPRoofIdx(this.positions.length / 4);
            scale[1] = this.dimensions[1] / 2;
        }
        this.pushColor(0.1, 0.1, 0.1, pos.length / 4);
        for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];

                this.normals.push(nor[n]);
                this.normals.push(nor[n + 1]);
                this.normals.push(nor[n + 2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
    }

    generateBigHouseVbos() {
        let temppos = Structure.createCubePos();
        let tempnor = Structure.createCubeNor();
        let tempidx = Structure.createCubeIdx(0);

        for (let i = 0; i < temppos.length; i = i + 4) {
            temppos[i] *= this.dimensions[0];
            temppos[i + 1] *= this.dimensions[1];
            temppos[i + 2] *= this.dimensions[2];
        }

        this.positions = temppos;
        this.normals = tempnor;
        this.indices = tempidx;
        this.pushColor(0.96, 0.96, 0.89, temppos.length / 4);

        let offsetW = this.dimensions[0] / this.sectionsW;
        let offsetD = this.dimensions[2] / this.sectionsD;
        let offsetH = this.dimensions[1] / this.stories;

        let leftTower = false;
        let rightTower = false;
        let leftExt = false;
        let rightExt = false;

        let story = 0;
        let section = 0;
        for (let i = 0; i < this.backwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetW,offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetW * section, offsetH * story, this.dimensions[2]);
            let s = this.backwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos();
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0.1, 0.1, 0.1, 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.8, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.1, 0.3, 0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.frontwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetW, offsetH, -1);
            let off: vec3 = vec3.fromValues(offsetW * section, offsetH * story, 0);
            let s = this.frontwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == 'B') {
                if (story == 0) {
                    if (section == 0) {
                        leftExt = true;
                    }
                    else {
                        rightExt = true;
                    }
                }
                section++;
            }
            else if (s == 'T') {
                if (story == 0) {
                    if (section == 0) {
                        leftTower = true;
                    }
                    else {
                        rightTower = true;
                    }
                }
                section++;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'D') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.18, 0.18, pos.length / 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.9, 0.8, 1));
                vec3.add(off, off, vec3.fromValues(0.05, 0, -0.01));
                section++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos();
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(this.positions.length / 4);
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0.1, 0.1, 0.1, 4);
                vec3.multiply(scale, scale, vec3.fromValues(0.8, 0.6, 1));
                vec3.add(off, off, vec3.fromValues(0.1, 0.3, -0.01));
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(-nor[n], -nor[n + 1], -nor[n + 2]));

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.leftwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetD, offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetD * section, offsetH * story, 0);
            let s = this.leftwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }

            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                let vpos = vec3.rotateY(vec3.create(), vec3.fromValues(pos[n], pos[n + 1], pos[n + 2]), 
                vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), PI / 2);

                this.positions.push(vpos[0]);
                this.positions.push(vpos[1]);
                this.positions.push(vpos[2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));
                vec3.rotateY(nvec, nvec, vec3.fromValues(0,0,0), PI / 2);

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        story = 0;
        section = 0;
        for (let i = 0; i < this.leftwall.length; i++) {
            let pos: number[] = [];
            let nor: number[] = [];
            let idx: number[] = [];
            let scale: vec3 = vec3.fromValues(offsetD, offsetH, 1);
            let off: vec3 = vec3.fromValues(offsetD * section, offsetH * story, 0);
            let s = this.leftwall[i];
            if (s == ']') {
                story++;
                section = 0;
            }
            else if (s == '_') {
                section++;
            }
            for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                let vpos = vec3.rotateY(vec3.create(), vec3.fromValues(pos[n], pos[n + 1], pos[n + 2]), 
                vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), -PI / 2);

                this.positions.push(vpos[0]);
                this.positions.push(vpos[1]);
                this.positions.push(vpos[2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];
                let nvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n], nor[n + 1], nor[n + 2]));
                vec3.rotateY(nvec, nvec, vec3.fromValues(0,0,0), -PI / 2);

                this.normals.push(nvec[0]);
                this.normals.push(nvec[1]);
                this.normals.push(nvec[2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }
        }

        let pos: number[] = [];
        let nor: number[] = [];
        let idx: number[] = [];
        let scale: vec3 = vec3.fromValues(this.dimensions[0] + offsetW / 2, offsetH / 2, this.dimensions[2] + offsetD / 2);
        let off: vec3 = vec3.fromValues(-offsetW / 4, this.dimensions[1], -offsetD / 4);
        if (this.roof[0] == 'F') {
            pos = Structure.createCubePos();
            nor = Structure.createCubeNor();
            idx = Structure.createCubeIdx(this.positions.length / 4);
        }
        else {
            pos = Structure.createPRoofPos();
            nor = Structure.createPRoofNor();
            idx = Structure.createPRoofIdx(this.positions.length / 4);
            scale[1] = this.dimensions[1] / 2;
        }
        this.pushColor(0.1, 0.1, 0.1, pos.length / 4);
        for(let n = 0; n < pos.length; n = n + 4) {
                pos[n] *= scale[0];
                pos[n] += off[0]
                pos[n + 1] *= scale[1];
                pos[n + 1] += off[1];
                pos[n + 2] *= scale[2];
                pos[n + 2] += off[2];

                this.positions.push(pos[n]);
                this.positions.push(pos[n + 1]);
                this.positions.push(pos[n + 2]);
                this.positions.push(pos[n + 3]);

                nor[n] /= scale[0];
                nor[n + 1] /= scale[1];
                nor[n + 2] /= scale[2];

                this.normals.push(nor[n]);
                this.normals.push(nor[n + 1]);
                this.normals.push(nor[n + 2]);
                this.normals.push(nor[n + 3]);
            }
            for(let n = 0; n < idx.length; n++) {
                this.indices.push(idx[n]);
            }

            let origLength = this.positions.length;
            let extScale = vec3.fromValues((Math.random() * 0.4 - 0.2) + 1, 1, Math.random() * 0.2 + 0.6);
            let newDim = vec3.multiply(vec3.create(), extScale, this.dimensions);
            if (leftExt) { // Add an extention if left ext is true

                for(let i = 0; i < origLength; i = i + 4) {
                    let posvec = vec3.fromValues(this.positions[i] * extScale[0], this.positions[i + 1], this.positions[i + 2] * extScale[2]);
                    vec3.rotateY(posvec, posvec, vec3.fromValues(0,0,0), PI / 4);
                    vec3.add(posvec, posvec, vec3.fromValues(this.dimensions[0] + 1, 0, 0));
    
                    this.positions.push(posvec[0]);
                    this.positions.push(posvec[1]);
                    this.positions.push(posvec[2]);
                    this.positions.push(this.positions[i + 3]);
    
                    let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]); // Dont need to scale because everything is a square
                    vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), PI / 4);
    
                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(this.normals[i + 3]);
    
                    this.colors.push(this.colors[i]);
                    this.colors.push(this.colors[i + 1]);
                    this.colors.push(this.colors[i + 2]);
                    this.colors.push(this.colors[i + 3]);
                }
                let idxlength = this.indices.length;
                for(let i = 0; i < idxlength; i++) {
                    this.indices.push(this.indices[i] + (origLength / 4));
                }
    
            }

            if (rightExt) { // Add an extention if right ext is true

                for(let i = 0; i < origLength; i = i + 4) {
                    let posvec = vec3.fromValues(this.positions[i] * extScale[0], this.positions[i + 1], this.positions[i + 2] * extScale[2]);
                    vec3.rotateY(posvec, posvec, vec3.fromValues(0,0,0), -PI / 4);
                    vec3.add(posvec, posvec, vec3.fromValues(-newDim[0] * 0.71 - 1, 0, -newDim[0] * 0.71));
    
                    this.positions.push(posvec[0]);
                    this.positions.push(posvec[1]);
                    this.positions.push(posvec[2]);
                    this.positions.push(this.positions[i + 3]);
    
                    let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]); // Dont need to scale because everything is a square
                    vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), -PI / 4);

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(this.normals[i + 3]);
    
                    this.colors.push(this.colors[i]);
                    this.colors.push(this.colors[i + 1]);
                    this.colors.push(this.colors[i + 2]);
                    this.colors.push(this.colors[i + 3]);
                }
                let idxlength = this.indices.length;
                for(let i = 0; i < idxlength; i++) {
                    this.indices.push(this.indices[i] + (origLength / 4));
                }
    
            }

    }

    generateHotelVbos() {
        let pos = Structure.createCubePos();
        let nor = Structure.createCubeNor();
        let idx = Structure.createCubeIdx(0);

        for (let i = 0; i < pos.length; i = i + 4) {
            this.positions.push(pos[i] * this.dimensions[0]);
            this.positions.push(pos[i + 1] * this.dimensions[1]);
            this.positions.push(pos[i + 2] * this.dimensions[2]);
            this.positions.push(pos[i + 3]);

            // This will properly transform the normal based on the scaling of the building
            let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / this.dimensions[1], nor[i + 2] / this.dimensions[2]));

            this.normals.push(norvec[0]);
            this.normals.push(norvec[1]);
            this.normals.push(norvec[2]);
            this.normals.push(nor[i + 3]);                    
        }


        for(let i = 0; i < idx.length; i++) {
            this.indices.push(idx[i]);
        }
        this.pushColor(0.8, 0.65, 0.6, pos.length / 4);

        let section = 0;
        let story = 0;
        let offsetW = this.dimensions[0] / this.sectionsW;
        let offsetH = this.dimensions[1] / this.stories;
        let leftExt = false; // these are used to know if we have building extentions
        let rightExt = false;
        for (let i = 0; i < this.frontwall.length; i++) {
            let s = this.frontwall[i];
            if (s == '[') {
                section = 0;
            }
            else if (s == ']') {
                story++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos(); // At the end of a story push any extended parts to the vbos
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(this.positions.length / 4);

                for (let n = 0; n < pos.length; n = n + 4) {
                    this.positions.push(pos[n] * offsetW * 0.8 + offsetW * section + 0.1);
                    this.positions.push(pos[n + 1] * offsetH * 0.6 + offsetH * story + 0.2);
                    this.positions.push(-pos[n + 2] - 0.01);
                    this.positions.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2] / 0.5));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    this.indices.push(idx[n]);
                }
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0,0,0, 4);

                section++;
            }
            else if (s == 'D') {
                pos = Structure.createSquarePos(); // At the end of a story push any extended parts to the vbos
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(this.positions.length / 4);

                for (let n = 0; n < pos.length; n = n + 4) {
                    this.positions.push(pos[n] * offsetW * 0.5 + offsetW * section + 0.25);
                    this.positions.push(pos[n + 1] * offsetH * 0.8 + offsetH * story);
                    this.positions.push(pos[n + 2] - 0.01);
                    this.positions.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2] / 0.5));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    this.indices.push(idx[n]);
                }
                this.pushColor(0.6, 0.18, 0.18, pos.length / 4);

                section++;
            }
            else if (s == '_') {
                section++;
            }
            else if (s == 'B'){
                if (story == 0) {
                    if (section == 0) {
                        leftExt = true;
                    }
                    else {
                        rightExt = true;
                    }
                }
                section++;
            }
        }

        section = 0;
        story = 0;

        let temppos: number[] = [];
        let tempnor: number[] = [];
        let tempidx: number[] = [];
        for (let i = 0; i < this.backwall.length; i++) {
            let s = this.backwall[i];
            if (s == '[') {
                section = 0;
            }
            else if (s == ']') {
                story++;
            }
            else if (s == 'W') {
                pos = Structure.createBWindowPos(); // At the end of a story push any extended parts to the vbos
                nor = Structure.createBWindowNor();
                idx = Structure.createBWindowIdx(temppos.length / 4);

                for (let n = 0; n < pos.length; n = n + 4) {
                    temppos.push(pos[n] * offsetW * 0.8 + offsetW * section + 0.1);
                    temppos.push(pos[n + 1] * offsetH * 0.6 + offsetH * story + 0.2);
                    temppos.push(-pos[n + 2] - 0.01);
                    temppos.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / (offsetW * 0.8), nor[n + 1] / (offsetH * 0.6), nor[n + 2]));

                    tempnor.push(norvec[0]);
                    tempnor.push(norvec[1]);
                    tempnor.push(norvec[2]);
                    tempnor.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    tempidx.push(idx[n]);
                }
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0,0,0, 4);

                section++;
            }
            else if (s == 'D') {
                pos = Structure.createSquarePos(); // At the end of a story push any extended parts to the vbos
                nor = Structure.createSquareNor();
                idx = Structure.createSquareIdx(temppos.length / 4);

                for (let n = 0; n < pos.length; n = n + 4) {
                    temppos.push(pos[n] * offsetW * 0.5 + offsetW * section + 0.25);
                    temppos.push(pos[n + 1] * offsetH * 0.8 + offsetH * story);
                    temppos.push(pos[n + 2] - 0.01);
                    temppos.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / (offsetW * 0.5), nor[n + 1] / (offsetH * 0.8), nor[n + 2]));

                    tempnor.push(norvec[0]);
                    tempnor.push(norvec[1]);
                    tempnor.push(norvec[2]);
                    tempnor.push(nor[n + 3]); 
                }

                for(let n = 0; n < idx.length; n++) {
                    tempidx.push(idx[n]);
                }
                this.pushColor(0.6, 0.18, 0.18, pos.length / 4);

                section++;
            }
            else if (s == '_') {
                section++;
            }
        }

        for(let i = 0; i < tempidx.length; i++) {
            this.indices.push(tempidx[i] + (this.positions.length / 4));
        }

        for(let i = 0; i < temppos.length; i = i + 4) {
            let posvec = vec3.fromValues(temppos[i], temppos[i + 1], temppos[i + 2]);
            vec3.rotateY(posvec, posvec, vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), PI);

            this.positions.push(posvec[0]);
            this.positions.push(posvec[1]);
            this.positions.push(posvec[2]);
            this.positions.push(temppos[i + 3]);

            let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]);
            vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), PI);

            this.normals.push(norvec[0]);
            this.normals.push(norvec[1]);
            this.normals.push(norvec[2]);
            this.normals.push(tempnor[i + 3]);
        }

        let origLength = this.positions.length;
        let extScale = vec3.fromValues((Math.random() * 0.4 - 0.2) + 1, 1, Math.random() * 0.2 + 0.6);
        let newDim = vec3.multiply(vec3.create(), extScale, this.dimensions);
        if (leftExt) { // Add an extention if left ext is true

            for(let i = 0; i < origLength; i = i + 4) {
                let posvec = vec3.fromValues(this.positions[i] * extScale[0], this.positions[i + 1], this.positions[i + 2] * extScale[2]);
                vec3.rotateY(posvec, posvec, vec3.fromValues(0,0,0), PI / 2);
                vec3.add(posvec, posvec, vec3.fromValues(this.dimensions[0], 0, 0));

                this.positions.push(posvec[0]);
                this.positions.push(posvec[1]);
                this.positions.push(posvec[2]);
                this.positions.push(this.positions[i + 3]);

                let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]); // Dont need to scale because everything is a square
                vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), PI / 2);

                this.normals.push(norvec[0]);
                this.normals.push(norvec[1]);
                this.normals.push(norvec[2]);
                this.normals.push(this.normals[i + 3]);

                this.colors.push(this.colors[i]);
                this.colors.push(this.colors[i + 1]);
                this.colors.push(this.colors[i + 2]);
                this.colors.push(this.colors[i + 3]);
            }
            let idxlength = this.indices.length;
            for(let i = 0; i < idxlength; i++) {
                this.indices.push(this.indices[i] + (origLength / 4));
            }

            pos = Structure.createCubePos();
            nor = Structure.createCubeNor();
            idx = Structure.createCubeIdx(this.positions.length / 4);
            for (let i = 0; i < pos.length; i = i + 4) {
                this.positions.push(pos[i] * newDim[2] + this.dimensions[0]);
                this.positions.push(pos[i + 1] * this.dimensions[1]);
                this.positions.push(pos[i + 2] * this.dimensions[2]);
                this.positions.push(pos[i + 3]);
    
                // This will properly transform the normal based on the scaling of the building
                let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / this.dimensions[1], nor[i + 2] / this.dimensions[2]));
    
                this.normals.push(norvec[0]);
                this.normals.push(norvec[1]);
                this.normals.push(norvec[2]);
                this.normals.push(nor[i + 3]);                    
            }
    
    
            for(let i = 0; i < idx.length; i++) {
                this.indices.push(idx[i]);
            }
            this.pushColor(0.8, 0.65, 0.6, pos.length / 4);

        }

        if (rightExt) { // Add an extention if right ext is true

            for(let i = 0; i < origLength; i = i + 4) {
                let posvec = vec3.fromValues(this.positions[i] * extScale[0], this.positions[i + 1], this.positions[i + 2] * extScale[2]);
                vec3.rotateY(posvec, posvec, vec3.fromValues(0,0,0), -PI / 2);
                vec3.add(posvec, posvec, vec3.fromValues(0, 0, -newDim[0]));

                this.positions.push(posvec[0]);
                this.positions.push(posvec[1]);
                this.positions.push(posvec[2]);
                this.positions.push(this.positions[i + 3]);

                let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]); // Dont need to scale because everything is a square
                vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), -PI / 2);

                this.normals.push(norvec[0]);
                this.normals.push(norvec[1]);
                this.normals.push(norvec[2]);
                this.normals.push(this.normals[i + 3]);

                this.colors.push(this.colors[i]);
                this.colors.push(this.colors[i + 1]);
                this.colors.push(this.colors[i + 2]);
                this.colors.push(this.colors[i + 3]);
            }
            let idxlength = this.indices.length;
            for(let i = 0; i < idxlength; i++) {
                this.indices.push(this.indices[i] + (origLength / 4));
            }

            pos = Structure.createCubePos();
            nor = Structure.createCubeNor();
            idx = Structure.createCubeIdx(this.positions.length / 4);
            for (let i = 0; i < pos.length; i = i + 4) {
                this.positions.push(pos[i] * newDim[2] - newDim[2]);
                this.positions.push(pos[i + 1] * this.dimensions[1]);
                this.positions.push(pos[i + 2] * this.dimensions[2]);
                this.positions.push(pos[i + 3]);
    
                // This will properly transform the normal based on the scaling of the building
                let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / this.dimensions[1], nor[i + 2] / this.dimensions[2]));
    
                this.normals.push(norvec[0]);
                this.normals.push(norvec[1]);
                this.normals.push(norvec[2]);
                this.normals.push(nor[i + 3]);                    
            }
    
    
            for(let i = 0; i < idx.length; i++) {
                this.indices.push(idx[i]);
            }
            this.pushColor(0.8, 0.65, 0.6, pos.length / 4);

        }


    }

    generateOfficeVbos() {
        let pos = Structure.createCubePos();
        let nor = Structure.createCubeNor();
        let idx = Structure.createCubeIdx(this.positions.length / 4);

        for (let i = 0; i < pos.length; i = i + 4) {
            this.positions.push(pos[i] * this.dimensions[0]);
            this.positions.push(pos[i + 1] * this.dimensions[1]);
            this.positions.push(pos[i + 2] * this.dimensions[2]);
            this.positions.push(pos[i + 3]);

            // This will properly transform the normal based on the scaling of the building
            let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / this.dimensions[1], nor[i + 2] / this.dimensions[2]));

            this.normals.push(norvec[0]);
            this.normals.push(norvec[1]);
            this.normals.push(norvec[2]);
            this.normals.push(nor[i + 3]);                    
        }


        for(let i = 0; i < idx.length; i++) {
            this.indices.push(idx[i]);
        }

        this.pushColor(0.76, 0.76, 0.69, pos.length / 4);
        
        let startpos = -1;
        let length = 0;
        let story = 0;
        let section = 0;
        let extended = false;

        let offsetW = this.dimensions[0] / this.sectionsW;
        let offsetD = this.dimensions[2] / this.sectionsD;
        let offsetH = this.dimensions[1] / this.stories;

        for (let i = 0; i < this.frontwall.length; i++) {
            let s = this.frontwall[i];
            if (s == '[') {
                startpos = -1;
                length = 0;
                extended = false;
            }
            else if (s == ']') {
                if (startpos != -1 && story >= 1) { // Can only extend if above ground floor
                    pos = Structure.createCubePos(); // At the end of a story push any extended parts to the vbos
                    nor = Structure.createCubeNor();
                    let idx = Structure.createCubeIdx(this.positions.length / 4);

                    for (let n = 0; n < pos.length; n = n + 4) {
                        this.positions.push(pos[n] * offsetW * length + offsetW * startpos);
                        this.positions.push(pos[n + 1] * offsetH + offsetH * story);
                        this.positions.push(pos[n + 2] * 0.5 - 0.51);
                        this.positions.push(pos[n + 3]);

                        // This will properly transform the normal based on the scaling of the building
                        let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2] / 0.5));

                        this.normals.push(norvec[0]);
                        this.normals.push(norvec[1]);
                        this.normals.push(norvec[2]);
                        this.normals.push(nor[n + 3]);  
                    }

                    for(let n = 0; n < idx.length; n++) {
                        this.indices.push(idx[n]);
                    }
                    this.pushColor(0.56, 0.56, 0.59, pos.length / 4);
                }

                story++;
                section = 0;
            }
            else if (s == 'E') {
                if (startpos == -1) {
                    startpos = section;
                    extended = true;
                }
                length++;
                section++;
            }
            else if (s == 'w') {
                if (startpos != -1) {
                    extended = false;
                }

                section++;
            }
            else if (s == 'D') { // Creates doors
                pos = Structure.createBWindowPos();
                nor = Structure.createBWindowNor();
                let idx = Structure.createBWindowIdx(this.positions.length / 4);
                
                for (let n = 0; n < pos.length; n = n + 4) {
                    this.positions.push(pos[n] * offsetW * 0.9 + offsetW * section + 0.5);
                    this.positions.push(pos[n + 1] * offsetH * 0.9);
                    this.positions.push(-pos[n + 2] - 0.01);
                    this.positions.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / (offsetW * 0.9), nor[n + 1] / (offsetH * 0.9) , nor[n + 2]));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    this.indices.push(idx[n]);
                }
                this.pushColor(0.6, 0.6, 0.8, 4);
                this.pushColor(0.0, 0.0, 0.0, 4);

                section++;
            }

            if (story >= 1 && s != '[' && s != ']') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                let idx = Structure.createSquareIdx(this.positions.length / 4);
                let zoff = 0.01;
                if (extended) {
                    zoff += 0.51;
                }
                
                for (let n = 0; n < pos.length; n = n + 4) {
                    this.positions.push(pos[n] * offsetW * 0.8 + offsetW * (section - 1) + 0.1);
                    this.positions.push(pos[n + 1] * offsetH * 0.8 + offsetH * story + 0.1);
                    this.positions.push(pos[n + 2] - zoff);
                    this.positions.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2]));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    this.indices.push(idx[n]);
                }
                this.pushColor(0.1, 0.1, 0.1, pos.length / 4);
            }
        } // end of frontwall

        // create the vbos for the backwall
        startpos = -1;
        length = 0;
        story = 0;
        section = 0;
        extended = false;

        let temppos: number[] = []; // push to these before transforming for appropriate wall
        let tempnor: number[] = [];
        let tempidx: number[] = [];

        for (let i = 0; i < this.backwall.length; i++) {
            let s = this.backwall[i];
            if (s == '[') {
                startpos = -1;
                length = 0;
                extended = false;
            }
            else if (s == ']') {
                if (startpos != -1 && story >= 1) {
                    pos = Structure.createCubePos(); // At the end of a story push any extended parts to the vbos
                    nor = Structure.createCubeNor();
                    let idx = Structure.createCubeIdx(temppos.length / 4);

                    for (let n = 0; n < pos.length; n = n + 4) {
                        temppos.push(pos[n] * offsetW * length + offsetW * startpos);
                        temppos.push(pos[n + 1] * offsetH + offsetH * story);
                        temppos.push(pos[n + 2] * 0.5 - 0.51);
                        temppos.push(pos[n + 3]);

                        // This will properly transform the normal based on the scaling of the building
                        let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2] / 0.5));

                        tempnor.push(norvec[0]);
                        tempnor.push(norvec[1]);
                        tempnor.push(norvec[2]);
                        tempnor.push(nor[n + 3]);  
                    }

                    for(let n = 0; n < idx.length; n++) {
                        tempidx.push(idx[n]);
                    }
                    this.pushColor(0.56, 0.56, 0.59, pos.length / 4);
                }

                story++;
                section = 0;
            }
            else if (s == 'E') {
                if (startpos == -1) {
                    startpos = section;
                    extended = true;
                }
                length++;
                section++;
            }
            else if (s == 'w') {
                if (startpos != -1) {
                    extended = false;
                }

                section++;
            }

            if (story >= 1 && s != '[' && s != ']') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                let idx = Structure.createSquareIdx(temppos.length / 4);
                let zoff = 0.01;
                if (extended) {
                    zoff += 0.51;
                }
                
                for (let n = 0; n < pos.length; n = n + 4) {
                    temppos.push(pos[n] * offsetW * 0.8 + offsetW * (section - 1) + 0.1);
                    temppos.push(pos[n + 1] * offsetH * 0.8 + offsetH * story + 0.1);
                    temppos.push(pos[n + 2] - zoff);
                    temppos.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2]));

                    tempnor.push(norvec[0]);
                    tempnor.push(norvec[1]);
                    tempnor.push(norvec[2]);
                    tempnor.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    tempidx.push(idx[n]);
                }
                this.pushColor(0.1, 0.1, 0.1, pos.length / 4);
            }
        } // end of backwall

        for (let i = 0; i < tempidx.length; i++) {
            this.indices.push(tempidx[i] + (this.positions.length / 4)); // do this first because we need to offset by the existing verts
        }

        for(let i = 0; i < temppos.length; i = i + 4) {
            let posvec = vec3.fromValues(temppos[i], temppos[i + 1], temppos[i + 2]);
            vec3.rotateY(posvec, posvec, vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[2] / 2), PI);

            this.positions.push(posvec[0]);
            this.positions.push(posvec[1]);
            this.positions.push(posvec[2]);
            this.positions.push(temppos[i + 3]);

            let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]);
            vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), PI);

            this.normals.push(norvec[0]);
            this.normals.push(norvec[1]);
            this.normals.push(norvec[2]);
            this.normals.push(tempnor[i + 3]);
        }

        // Repeat for left wall
        startpos = -1;
        length = 0;
        story = 0;
        section = 0;
        extended = false;

        temppos = []; // push to these before transforming for appropriate wall
        tempnor = [];
        tempidx = [];

        for (let i = 0; i < this.leftwall.length; i++) {
            let s = this.leftwall[i];
            if (s == '[') {
                startpos = -1;
                length = 0;
                extended = false;
            }
            else if (s == ']') {
                if (startpos != -1 && story >= 1) {
                    pos = Structure.createCubePos(); // At the end of a story push any extended parts to the vbos
                    nor = Structure.createCubeNor();
                    let idx = Structure.createCubeIdx(temppos.length / 4);

                    for (let n = 0; n < pos.length; n = n + 4) {
                        temppos.push(pos[n] * offsetW * length + offsetW * startpos);
                        temppos.push(pos[n + 1] * offsetH + offsetH * story);
                        temppos.push(pos[n + 2] * 0.5 - 0.51);
                        temppos.push(pos[n + 3]);

                        // This will properly transform the normal based on the scaling of the building
                        let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2] / 0.5));

                        tempnor.push(norvec[0]);
                        tempnor.push(norvec[1]);
                        tempnor.push(norvec[2]);
                        tempnor.push(nor[n + 3]);  
                    }

                    for(let n = 0; n < idx.length; n++) {
                        tempidx.push(idx[n]);
                    }
                    this.pushColor(0.56, 0.56, 0.59, pos.length / 4);
                }

                story++;
                section = 0;
            }
            else if (s == 'E') {
                if (startpos == -1) {
                    startpos = section;
                    extended = true;
                }
                length++;
                section++;
            }
            else if (s == 'w') {
                if (startpos != -1) {
                    extended = false;
                }

                section++;
            }

            if (story >= 1 && s != '[' && s != ']') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                let idx = Structure.createSquareIdx(temppos.length / 4);
                let zoff = 0.01;
                if (extended) {
                    zoff += 0.51;
                }
                
                for (let n = 0; n < pos.length; n = n + 4) {
                    temppos.push(pos[n] * offsetW * 0.8 + offsetW * (section - 1) + 0.1);
                    temppos.push(pos[n + 1] * offsetH * 0.8 + offsetH * story + 0.1);
                    temppos.push(pos[n + 2] - zoff);
                    temppos.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2]));

                    tempnor.push(norvec[0]);
                    tempnor.push(norvec[1]);
                    tempnor.push(norvec[2]);
                    tempnor.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    tempidx.push(idx[n]);
                }
                this.pushColor(0.1, 0.1, 0.1, pos.length / 4);
            }
        } // end of leftwall

        for (let i = 0; i < tempidx.length; i++) {
            this.indices.push(tempidx[i] + (this.positions.length / 4)); // do this first because we need to offset by the existing verts
        }

        for(let i = 0; i < temppos.length; i = i + 4) {
            let posvec = vec3.fromValues(temppos[i], temppos[i + 1], temppos[i + 2]);
            vec3.rotateY(posvec, posvec, vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[0] / 2), PI / 2);
            vec3.add(posvec, posvec, vec3.fromValues(0, 0, this.dimensions[2] - this.dimensions[0]));

            this.positions.push(posvec[0]);
            this.positions.push(posvec[1]);
            this.positions.push(posvec[2]);
            this.positions.push(temppos[i + 3]);

            let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]);
            vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), PI / 2);

            this.normals.push(norvec[0]);
            this.normals.push(norvec[1]);
            this.normals.push(norvec[2]);
            this.normals.push(tempnor[i + 3]);
        }

        // Repeat for right wall
        startpos = -1;
        length = 0;
        story = 0;
        section = 0;
        extended = false;

        temppos = []; // push to these before transforming for appropriate wall
        tempnor = [];
        tempidx = [];

        for (let i = 0; i < this.rightwall.length; i++) {
            let s = this.rightwall[i];
            if (s == '[') {
                startpos = -1;
                length = 0;
                extended = false;
            }
            else if (s == ']') {
                if (startpos != -1 && story >= 1) {
                    pos = Structure.createCubePos(); // At the end of a story push any extended parts to the vbos
                    nor = Structure.createCubeNor();
                    let idx = Structure.createCubeIdx(temppos.length / 4);

                    for (let n = 0; n < pos.length; n = n + 4) {
                        temppos.push(pos[n] * offsetW * length + offsetW * startpos);
                        temppos.push(pos[n + 1] * offsetH + offsetH * story);
                        temppos.push(pos[n + 2] * 0.5 - 0.51);
                        temppos.push(pos[n + 3]);

                        // This will properly transform the normal based on the scaling of the building
                        let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2] / 0.5));

                        tempnor.push(norvec[0]);
                        tempnor.push(norvec[1]);
                        tempnor.push(norvec[2]);
                        tempnor.push(nor[n + 3]);  
                    }

                    for(let n = 0; n < idx.length; n++) {
                        tempidx.push(idx[n]);
                    }
                    this.pushColor(0.56, 0.56, 0.59, pos.length / 4);
                }

                story++;
                section = 0;
            }
            else if (s == 'E') {
                if (startpos == -1) {
                    startpos = section;
                    extended = true;
                }
                length++;
                section++;
            }
            else if (s == 'w') {
                if (startpos != -1) {
                    extended = false;
                }

                section++;
            }

            if (story >= 1 && s != '[' && s != ']') {
                pos = Structure.createSquarePos();
                nor = Structure.createSquareNor();
                let idx = Structure.createSquareIdx(temppos.length / 4);
                let zoff = 0.01;
                if (extended) {
                    zoff += 0.51;
                }
                
                for (let n = 0; n < pos.length; n = n + 4) {
                    temppos.push(pos[n] * offsetW * 0.8 + offsetW * (section - 1) + 0.1);
                    temppos.push(pos[n + 1] * offsetH * 0.8 + offsetH * story + 0.1);
                    temppos.push(pos[n + 2] - zoff);
                    temppos.push(pos[n + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[n] / offsetW, nor[n + 1] / offsetH, nor[n + 2]));

                    tempnor.push(norvec[0]);
                    tempnor.push(norvec[1]);
                    tempnor.push(norvec[2]);
                    tempnor.push(nor[n + 3]);  
                }

                for(let n = 0; n < idx.length; n++) {
                    tempidx.push(idx[n]);
                }
                this.pushColor(0.1, 0.1, 0.1, pos.length / 4);
            }
        } // end of rightwall

        for (let i = 0; i < tempidx.length; i++) {
            this.indices.push(tempidx[i] + (this.positions.length / 4)); // do this first because we need to offset by the existing verts
        }

        for(let i = 0; i < temppos.length; i = i + 4) {
            let posvec = vec3.fromValues(temppos[i], temppos[i + 1], temppos[i + 2]);
            vec3.rotateY(posvec, posvec, vec3.fromValues(this.dimensions[0] / 2, 0, this.dimensions[0] / 2), -PI / 2);

            this.positions.push(posvec[0]);
            this.positions.push(posvec[1]);
            this.positions.push(posvec[2]);
            this.positions.push(temppos[i + 3]);

            let norvec = vec3.fromValues(tempnor[i], tempnor[i + 1], tempnor[i + 2]);
            vec3.rotateY(norvec, norvec, vec3.fromValues(0, 0, 0), -PI / 2);

            this.normals.push(norvec[0]);
            this.normals.push(norvec[1]);
            this.normals.push(norvec[2]);
            this.normals.push(tempnor[i + 3]);
        }

        pos = Structure.createCubePos();
        nor = Structure.createCubeNor();
        idx = Structure.createCubeIdx(this.positions.length / 4);

        for(let i = 0; i < pos.length; i = i + 4) {

            this.positions.push(pos[i] * this.dimensions[0]);
            this.positions.push(pos[i + 1] * 0.2 + this.dimensions[1]);
            this.positions.push(pos[i + 2] * this.dimensions[2]);
            this.positions.push(pos[i + 3]);


            this.normals.push(nor[i]);
            this.normals.push(nor[i + 1]);
            this.normals.push(nor[i + 2]);
            this.normals.push(nor[i + 3]);
        }
        for(let n = 0; n < idx.length; n++) {
            this.indices.push(idx[n]);
        }
        this.pushColor(0.5, 0.5, 0.5, pos.length / 4);

    }

    generateSkyscraperVbos() {
        if (this.roof[0] == 'R') {
            let pos = Structure.createCylinderPos();
            let nor = Structure.createCylinderNor();

            for(let s = 0; s < this.dimensions[1]; s++) {
                let idx = Structure.createCylinderIdx(this.positions.length / 4);
                let idx2 = Structure.createCylinderIdx((this.positions.length / 4) + (pos.length / 4));
                let offset = vec3.fromValues(0, s, 0);
                let windH = 0.9;
                let gapH = 0.1;

                for (let i = 0; i < pos.length; i = i + 4) {
                    this.positions.push(pos[i] * this.dimensions[0]);
                    this.positions.push(pos[i + 1] * windH + offset[1]);
                    this.positions.push(pos[i + 2] * this.dimensions[2]);
                    this.positions.push(pos[i + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / windH, nor[i + 2] / this.dimensions[2]));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[i + 3]);                    
                }

                for (let i = 0; i < pos.length; i = i + 4) {
                    this.positions.push(pos[i] * this.dimensions[0]);
                    this.positions.push(pos[i + 1] * gapH + (offset[1] + windH));
                    this.positions.push(pos[i + 2] * this.dimensions[2]);
                    this.positions.push(pos[i + 3]);

                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / gapH, nor[i + 2] / this.dimensions[2]));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[i + 3]);  
                }

                for(let i = 0; i < idx.length; i++) {
                    this.indices.push(idx[i]);
                }

                for(let i = 0; i < idx.length; i++) {
                    this.indices.push(idx2[i]);
                }
                
                this.pushColor(0.5, 0.5, 0.5, pos.length / 4);
                this.pushColor(0.96, 0.96, 0.89, pos.length / 4);
            }

            pos = Structure.createRRoofPos();
            nor = Structure.createRRoofNor();
            let idx = Structure.createRRoofIdx(this.positions.length / 4);

            for (let i = 0; i < pos.length; i = i + 4) {
                this.positions.push(pos[i] * this.dimensions[0]);
                this.positions.push(pos[i + 1] * this.dimensions[1] / 3 + this.dimensions[1]);
                this.positions.push(pos[i + 2] * this.dimensions[2]);
                this.positions.push(pos[i + 3]);

                let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / (this.dimensions[1] / 3), nor[i + 2] / this.dimensions[2]));

                this.normals.push(norvec[0]);
                this.normals.push(norvec[1]);
                this.normals.push(norvec[2]);
                this.normals.push(nor[i + 3]);                     
            }

            for(let i = 0; i < idx.length; i++) {
                this.indices.push(idx[i]);
            }

            this.pushColor(0.76, 0.76, 0.69, pos.length / 4);

        }

        else {
            let pos = Structure.createCubePos();
            let nor = Structure.createCubeNor();

            for(let s = 0; s < this.dimensions[1]; s++) {
                let idx = Structure.createCubeIdx(this.positions.length / 4);
                let idx2 = Structure.createCubeIdx((this.positions.length / 4) + (pos.length / 4));
                let offset = vec3.fromValues(0, s, 0);
                let windH = 0.9;
                let gapH = 0.1;

                for (let i = 0; i < pos.length; i = i + 4) {
                    this.positions.push(pos[i] * this.dimensions[0]);
                    this.positions.push(pos[i + 1] * windH + offset[1]);
                    this.positions.push(pos[i + 2] * this.dimensions[2]);
                    this.positions.push(pos[i + 3]);

                    // This will properly transform the normal based on the scaling of the building
                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / windH, nor[i + 2] / this.dimensions[2]));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[i + 3]);                    
                }

                for (let i = 0; i < pos.length; i = i + 4) {
                    this.positions.push(pos[i] * this.dimensions[0]);
                    this.positions.push(pos[i + 1] * gapH + (offset[1] + windH));
                    this.positions.push(pos[i + 2] * this.dimensions[2]);
                    this.positions.push(pos[i + 3]);

                    let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / this.dimensions[0], nor[i + 1] / gapH, nor[i + 2] / this.dimensions[2]));

                    this.normals.push(norvec[0]);
                    this.normals.push(norvec[1]);
                    this.normals.push(norvec[2]);
                    this.normals.push(nor[i + 3]);  
                }

                for(let i = 0; i < idx.length; i++) {
                    this.indices.push(idx[i]);
                }

                for(let i = 0; i < idx.length; i++) {
                    this.indices.push(idx2[i]);
                }
                
                this.pushColor(0.5, 0.5, 0.5, pos.length / 4);
                this.pushColor(0.96, 0.96, 0.89, pos.length / 4);
            }

            let roofnum = 0;
            for (let i = 0; i < this.roof.length; i++) {
                if (this.roof[i] == 'T') {
                    roofnum++;
                }
            }

            if (this.roof[0] == 'F') {

                let offset = vec3.fromValues(0, this.dimensions[1], 0);
                for (let i = 0; i < roofnum; i++) {
                    offset[0] = (this.dimensions[0] - (this.dimensions[0] / ((i + 2) / 2))) / 2;
                    offset[2] = (this.dimensions[2] - (this.dimensions[2] / ((i + 2) / 2))) / 2;

                    let scale = vec3.fromValues(this.dimensions[0] / ((i + 2) / 2), 1.0 - (i / 10), this.dimensions[2] / ((i + 2) / 2));
                    let idx = Structure.createCubeIdx(this.positions.length / 4);

                    for (let n = 0; n < pos.length; n = n + 4) {
                        this.positions.push(pos[n] * scale[0] + offset[0]);
                        this.positions.push(pos[n + 1] * scale[1] + offset[1]);
                        this.positions.push(pos[n + 2] * scale[2] + offset[2]);
                        this.positions.push(pos[n + 3]);

                        let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / scale[0], nor[i + 1] / scale[1], nor[i + 2] / scale[2]));

                        this.normals.push(norvec[0]);
                        this.normals.push(norvec[1]);
                        this.normals.push(norvec[2]);
                        this.normals.push(nor[i + 3]);  
                    }
                    this.pushColor(0.76, 0.76, 0.69, pos.length / 4);
                    
                    for (let n = 0; n < idx.length; n++) {
                        this.indices.push(idx[n]);
                    }
                    
                    offset[1] += scale[1];
                }
            }

            else {
                pos = Structure.createSRoofPos();
                nor = Structure.createSRoofNor();

                let offset = vec3.fromValues(0, this.dimensions[1], 0);
                let scale = vec3.fromValues(this.dimensions[0], 2, this.dimensions[2]);
                for (let i = 0; i < roofnum; i++) {
                    offset[0] = (this.dimensions[0] - scale[0]) / 2;
                    offset[2] = (this.dimensions[2] - scale[2]) / 2;

                    let idx = Structure.createCubeIdx(this.positions.length / 4);

                    for (let n = 0; n < pos.length; n = n + 4) {
                        this.positions.push(pos[n] * scale[0] + offset[0]);
                        this.positions.push(pos[n + 1] * scale[1] + offset[1]);
                        this.positions.push(pos[n + 2] * scale[2] + offset[2]);
                        this.positions.push(pos[n + 3]);

                        let norvec = vec3.normalize(vec3.create(), vec3.fromValues(nor[i] / scale[0], nor[i + 1] / scale[1], nor[i + 2] / scale[2]));

                        this.normals.push(norvec[0]);
                        this.normals.push(norvec[1]);
                        this.normals.push(norvec[2]);
                        this.normals.push(nor[i + 3]);  
                    }
                    this.pushColor(0.76, 0.76, 0.69, pos.length / 4);
                    
                    for (let n = 0; n < idx.length; n++) {
                        this.indices.push(idx[n]);
                    }
                    
                    offset[1] += scale[1];
                    scale[0] *= 0.5;
                    scale[1] *= 0.8;
                    scale[2] *= 0.5;
                }
            }
        }
    }

};

export default Building;