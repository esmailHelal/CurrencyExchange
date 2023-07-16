

  export interface SymbolsResponce {
    "success": true,
    "symbols":Record<string,string>
  }
  export interface RateResponce {
    "success": boolean,
    "timestamp": number,
    "base": string,
    "date": string,
    "rates": Record<string,number>
  }


  export interface ConvertResponce {
    "success": boolean,
    "query": Record<string,any>,
    "info": Record<string,number>,
    "date": string
    "result": number
}
export interface HistroicResponce {
  "success": boolean,
  "historical": boolean,
  "date": string,
  "timestamp": number,
  "base": string,
  "rates":Record<string,number>
}
export interface DataMostPopular {
 to:string,
 rate:number
}

  