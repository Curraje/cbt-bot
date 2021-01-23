import Pokedex from 'pokedex-promise-v2';

export const pokedex = new Pokedex({timeout: 5 * 1000});

export type Region = {
    name: string,
    generation: [string, number],
    begin: number,
    end: number,
    new: number,
    smogon: string
}

export type pokeData = {
    name: string,
    url: string,
    region?: Region,
    galar?: boolean,
    alola?: boolean,
    hasMega?: boolean,
    hasXY?: boolean,
    forms?: string[]
}

export const Regions = {
    Kanto: {name: "Kanto", smogon: "RB", generation: ["I", 1], begin: 1, end: 151, new: 151} as Region,
    Johto: {name: "Johto", smogon: "GS", generation: ["II", 2], begin: 152, end: 251, new: 100} as Region,
    Hoenn: {name: "Hoenn", smogon: "RS", generation: ["III", 3], begin: 252, end: 386, new: 135} as Region,
    Sinnoh: {name: "Sinnoh", smogon: "DP", generation: ["IV", 4], begin: 387, end: 493, new: 107} as Region,
    Unova: {name: "Unova", smogon: "BW", generation: ["V", 5], begin: 494, end: 649, new: 156} as Region,
    Kalos: {name: "Kalos", smogon: "XY", generation: ["VI", 6], begin: 650, end: 721, new: 72} as Region,
    Alola: {name: "Alola", smogon: "SM", generation: ["VII", 7], begin: 722, end: 809, new: 88} as Region,
    Galar: {name: "Galar", smogon: "SS", generation: ["VIII", 8], begin: 810, end: 898, new: 89} as Region,
};