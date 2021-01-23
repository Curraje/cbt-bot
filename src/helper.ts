// Use this function to load data as a specific type
export async function loadData<T>(dataPath: string, someType: T): Promise<T>
{
    const data = await import(`${dataPath}`);
    return data.default as typeof someType;
}

// use lodash random instead
export function getRandomInt(min?: number, max?: number): number
{
    if (max === undefined)
    {
        max = Number.MAX_SAFE_INTEGER;
    }
    if (min === undefined)
    {
        min = Number.MIN_SAFE_INTEGER;
    }
    if (min > max)
    {
        const temp = max;
        max = min;
        min = temp;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// use lodash capitalize instead
export function capitalize(s: string): string
{
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function sortString(s: string): string
{
    return s.split('').sort().join('');
}

export function isAnagram(s1: string, s2: string): boolean
{
    s1 = s1.replace(/[^\w]/g, "").toLowerCase();

    s2 = s2.replace(/[^\w]/g, "").toLowerCase();

    return sortString(s1) === sortString(s2);
}

export function factorial(num: number): number
{
    let rval = 1;
    for (let i = 2; i <= num; i++)
    {
        rval = rval * i;
    }
    return rval;
}

export function permutation(n: number, k: number|number[]): number
{
    const p = factorial(n);

    let v: number;
    if (Array.isArray(k)) {
        v = 1;
        k.forEach(subset => {
            v *= factorial(subset);
        });
    } else {
        v = factorial(n-k);
    }
    return p/v;
}

export function swap<T>(pos: T[], i: number, j: number): void
{
    const tmp = pos[i];
    pos[i] = pos[j];
    pos[j] = tmp;
}

// Kinda Useless
export function isIsogram(str: string): boolean
{
    return !/(.).*\1/.test(str);
}

// Kinda useless
export function repeatCharCount(str: string): number
{
    const count = str.toLowerCase().split('').sort().join('').match(/(.)\1+/g)?.length;

    return count || 0;
}

export function findAnagrams(input: string, count?: number) : string[]
{
    const counter = [],
        anagrams: string[] = [],
        chars = input.split(''),
        length = chars.length;
    let i;

    for (i = 0; i < length; i++)
    {
        counter[i] = 0;
    }

    i = 0;
    while (i < length)
    {
        if (counter[i] < i)
        {
            swap(chars, i % 2 === 1 ? counter[i] : 0, i);
            counter[i]++;
            i = 0;
            const word = chars.join('');
            if (!anagrams.includes(word) && word != input)
            {
                anagrams.push(word);
            }
        }
        else {
            counter[i] = 0;
            i++;
        }
    }

    return count ? anagrams.slice(count, count) : anagrams;
}

export function groupByLetter(arr: string[], char: string): string[] {
    return arr.sort().filter((str) => {
        return str.charAt(0).toLowerCase() === char.toLowerCase();
    });
}

export function repeatCounts<T>(arr: T[]): number[] {

    arr = arr.sort();
    let prev = arr[0];
    let count = 1;
    const out: number[] = [];

    for (let i = 1; i <= arr.length; i++) {
        if (arr[i] === prev) {
            count++;
        }
        else {
            out.push(count);
            prev = arr[i];
            count = 1;
        }
    }
    return out;
}