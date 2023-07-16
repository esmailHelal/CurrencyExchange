import { ApiService } from "./api.service"
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { mockedGetSingleRate, mockedGetSingleRateWithDate, mockedSymbols } from "./testing/mockdata";

describe('apiServices',()=>{
    let apiService :ApiService,
    _HttpTestingController:HttpTestingController;
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers:[
                ApiService
            ]
        })

        apiService=TestBed.get(ApiService);
        _HttpTestingController=TestBed.get(HttpTestingController);
    })

    it('should get all symbols',()=>{
        apiService.getSymbolsList().subscribe(symbols=>{
            expect(symbols).toBeTruthy('No Symbols returned');
             expect(symbols.symbols).toBe(mockedSymbols); 

        });
        const req = _HttpTestingController.expectOne('http://data.fixer.io/api/symbols?access_key=42990b497de0cd14522e7b1e94c2629d');
        expect(req.request.method).toEqual("GET")  
    })

    it('should get select rate',()=>{
        const from ='EUR';
        const to='USD';
        apiService.getRate(from,to).subscribe(rates=>{
            expect(rates).toBeTruthy('No rates returned');
             expect(rates.rates).toBe(mockedGetSingleRate); 

        });
        const req = _HttpTestingController.expectOne(`http://data.fixer.io/api/latest?access_key=42990b497de0cd14522e7b1e94c2629d&base=${from}&symbols=${to}`);
        expect(req.request.method).toEqual("GET")  
    })

    it('should get select histroic',()=>{
        const from ='EUR';
        const to='USD';
        const date='2022-05-01'
        apiService.getHistroic(from,to,date).subscribe(rates=>{
            expect(rates).toBeTruthy('No rates returned');
             expect(rates.rates).toBe(mockedGetSingleRateWithDate); 

        });
        const req = _HttpTestingController.expectOne(`http://data.fixer.io/api/${date}?access_key=42990b497de0cd14522e7b1e94c2629d&base=${from}&symbols=${to}`);
        expect(req.request.method).toEqual("GET")  
    })
})