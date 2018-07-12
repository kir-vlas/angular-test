import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher, MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatIconRegistry} from "@angular/material";
import {ConfigService} from "./config/config.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MatDialogModule} from "@angular/material";
import {Routes} from "@angular/router";

export interface SubData {
    value: string;
    viewValue: string;
}
export class Config {
    msisdn: string
    sourceName: string;
    sourceCountry: string;
    sourceDoc: string;
    sourceDate: string;
    sourceSerNum:string;
    sourceCode: string;
    sourceAgency:string;
    sourceAddress:string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export interface Document {
    value: string;
    viewValue: string;
}

export class OutputForm{
    outName: string;
    outDocument: string;
    outCountry: string;
    outDate: string;
    outSerNum:string;
    outCode: string;
    outAgency:string;
    outAddress:string;
}

@Component({
    selector: 'my-app',
    template: `
        <h3>Редактирование данных абонента</h3>
        <form [method]="HTTP2_METHOD_POST" novalidate name="mainForm" #mForm="ngForm" (submit)="onSubmit(out)">
            <div id="top">
                <mat-form-field style="width: 100%;">
                    <mat-select [formControl]="selector2Validator" placeholder="Смена данных" [(ngModel)]="SelectedValue1" name="subd">
                        <mat-option *ngFor="let subdat of subdata" [value]="subdat.value">
                            {{subdat.viewValue}}
                        </mat-option>
                        <br/>
                    </mat-select>
                </mat-form-field>
            </div>
            <div class="form-left">
                <span class="form-label">Старые данные:</span>
                <br/>
                <mat-form-field class="output-field">
                    <input matInput name="sourceName" placeholder="Фамилия" disabled [value]="conf.sourceName">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData1()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
                <br/>
                <mat-form-field class="output-field">
                    <mat-select placeholder="Тип документа" [disabled]="true" [(ngModel)]="conf.sourceDoc" name="docs">
                        <mat-option *ngFor="let docs of docums" [value]="docs.value">
                            {{docs.viewValue}}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData2()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
                <br/>
                <mat-form-field  class="output-field">
                    <input matInput name="sourceCountry" placeholder="Страна выдачи" disabled [value]="conf.sourceCountry">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData3()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
                <br/>
                <mat-form-field  class="output-field">
                    <input name="sourceDate" matInput="date" placeholder="Дата" disabled [value]="conf.sourceDate">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData4()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
                <br/>
                <mat-form-field  class="output-field">
                    <input name="sourceSerNum" matInput="number" placeholder="Серия и номер" disabled [value]="conf.sourceSerNum">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData5()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
                <br/>
                <mat-form-field  class="output-field">
                    <input name="sourceCode" matInput="number" placeholder="Код подразделения" disabled [value]="conf.sourceCode">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData6()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
                <br/>
                <mat-form-field  class="output-field">
                    <input name="sourceAgency" matInput="number" placeholder="Орган, выдавший документ" disabled [value]="conf.sourceAgency">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData7()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
                <br/>
                <mat-form-field  class="output-field">
                    <input name="sourceAgency" matInput="number" placeholder="Адрес регистрации" disabled [value]="conf.sourceAddress">
                </mat-form-field>
                <button type="button" mat-icon-button (click)="this.copyData8()">
                    <mat-icon svgIcon="copy"></mat-icon>
                </button>
            </div>
            <div class="form-right">
                <span class="form-label">Изменить на:</span>
                <br/>
                <mat-form-field class="input-field">
                    <input id="f1" required name="lastName" matInput [value]="out.outName"
                           [errorStateMatcher]="matcher" [formControl]="lastNameValidator" placeholder="Фамилия">
                    <mat-error *ngIf="lastNameValidator.hasError('required')">
                        Необходимо ввести фамилию                        
                    </mat-error>
                    <mat-error *ngIf="lastNameValidator.hasError('pattern')">
                        Фамилия введена неправильно
                    </mat-error>
                </mat-form-field>
                <br/>
                <mat-form-field class="input-field">
                    <mat-select id="f2" placeholder="Тип документа" [value]="out.outDocument" [(ngModel)]="SelectedValue3" [formControl]="selectorValidator" name="docs">
                        <mat-option *ngFor="let docs of docums" [value]="docs.value">
                            {{docs.viewValue}}
                        </mat-option>
                    </mat-select>
                    <mat-error *ngIf="selectorValidator.invalid"> 
                        Документ не выбран
                    </mat-error>
                </mat-form-field>
                <br/>
                <mat-form-field class="input-field">
                    <input id="f3" required name="country" matInput [value]="out.outCountry"
                           [errorStateMatcher]="matcher" [formControl]="countryValidator" placeholder="Страна выдачи">
                    <mat-error *ngIf="countryValidator.hasError('required')">
                        Необходимо ввести страну выдачи
                    </mat-error>
                    <mat-error *ngIf="countryValidator.hasError('pattern')">
                        Страна выдачи введена неправильно
                    </mat-error>
                </mat-form-field>
                <br/>
                <mat-form-field class="input-field">
                    <input id="f4" required matInput min="{{mindate | date:'yyyy-MM-dd'}}" max="{{maxdate | date:'yyyy-MM-dd'}}"
                           [matDatepicker]="picker1" placeholder="Введите дату" [formControl]="date" [value]="out.outDate">
                    <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
                    <mat-datepicker #picker1></mat-datepicker>
                </mat-form-field>
                <br/>
                <mat-form-field class="input-field">
                    <input id="f5" required name="serialNum" matInput [value]="out.outSerNum"
                           [errorStateMatcher]="matcher" [formControl]="serialValidator" placeholder="Серия и номер">
                    <mat-error *ngIf="serialValidator.hasError('required')">
                        Необходимо ввести серию и номер
                    </mat-error>
                    <mat-error *ngIf="serialValidator.hasError('pattern')">
                        Данные введены некорректно
                    </mat-error>
                </mat-form-field>
                <br/>
                <mat-form-field class="input-field">
                    <input id="f6" required id = "codeInp" matInput type="number" name="codeInput" 
                           [errorStateMatcher]="matcher" [formControl]="codeValidator" placeholder="Код подразделения" [value]="out.outCode">
                    <mat-error *ngIf="codeValidator.hasError('required')">
                        Необходимо ввести код подразделения
                    </mat-error>
                    <mat-error *ngIf="codeValidator.hasError('pattern')">
                        Код указан неверно
                    </mat-error>
                </mat-form-field>
                <br/>
                <mat-form-field class="input-field">
                    <input id="f7" required id = "ageInp" matInput  name="agencyInput"
                           [errorStateMatcher]="matcher" [formControl]="agencyValidator" placeholder="Орган, выдавший документ" [value]="out.outAgency">
                    <mat-error *ngIf="agencyValidator.hasError('required')">
                        Необходимо ввести орган, выдавший документ
                    </mat-error>
                    <mat-error *ngIf="agencyValidator.hasError('pattern')">
                        Указаны неверные данные
                    </mat-error>
                </mat-form-field>
                <br/>
                <mat-form-field class="input-field">
                    <input id="f8" required id = "ageInp" matInput  name="agencyInput"
                           [errorStateMatcher]="matcher" [formControl]="addressValidator" placeholder="Адрес регистрации" [value]="out.outAddress">
                    <mat-error *ngIf="addressValidator.hasError('required')">
                        Необходимо ввести адрес регистрации
                    </mat-error>
                    <mat-error *ngIf="addressValidator.hasError('pattern')">
                        Указаны неверные данные
                    </mat-error>
                </mat-form-field>
            </div>
            <div id="bottom">
                <button type="button" (click)="callAlert()" mat-stroked-button color="primary">Прервать сценарий</button>
                <button type="button" (click)="redir()"  [disabled]="mForm.invalid || lastNameValidator.invalid || date.invalid || addressValidator.invalid ||
                selectorValidator.invalid || codeValidator.invalid ||selector2Validator.invalid || countryValidator.invalid || serialValidator.invalid || agencyValidator.invalid" mat-raised-button color="primary">Добавить в корзину</button>
            </div>
        </form>

    `,
    providers: [ConfigService]

})
export class AppComponent implements OnInit{
    constructor (public configService: ConfigService, public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer){
        iconRegistry.addSvgIcon(
            'copy',
            sanitizer.bypassSecurityTrustResourceUrl('copy-content.svg'));
    }

    conf:Config;
    ngOnInit(){
        this.showConfig();
        console.log(this.conf.sourceName);
    }
    out = new OutputForm();
    copyData1(){
        this.out.outName = this.conf.sourceName;
        this.lastNameValidator.patchValue(this.out.outName);
    }
    copyData2(){
        this.out.outDocument = this.conf.sourceDoc;
        this.selectorValidator.patchValue(this.out.outDocument);
    }
    copyData3(){
        this.out.outCountry = this.conf.sourceCountry;
        this.countryValidator.patchValue(this.out.outCountry);
    }
    copyData4(){
        this.out.outDate = this.conf.sourceDate;
        this.date.patchValue(this.out.outDate);
    }
    copyData5(){
        this.out.outSerNum = this.conf.sourceSerNum;
        this.serialValidator.patchValue(this.out.outSerNum);
    }
    copyData6(){
        this.out.outCode = this.conf.sourceCode;
        this.codeValidator.patchValue(this.out.outCode);
    }
    copyData7(){
        this.out.outAgency = this.conf.sourceAgency;
        this.agencyValidator.patchValue(this.out.outAgency);
    }
    copyData8(){
        this.out.outAddress = this.conf.sourceAddress;
        this.addressValidator.patchValue(this.out.outAddress);
    }

    callAlert():void{
        const dialogRef = this.dialog.open(ModaDialog, {
            width: '250px'
        });
    }
    redir(){
        location.assign("/after.html");
    }
    SelectedValue1: string;
    SelectedValue2: string;
    SelectedValue3: string;
    date = new FormControl(new Date());


    selectorValidator = new FormControl('',[Validators.required]);
    selector2Validator = new FormControl('',[Validators.required]);
    lastNameValidator = new FormControl( '',[Validators.required, Validators.pattern("[а-яА-Я]+")]);
    countryValidator = new FormControl( '',[Validators.required, Validators.pattern("[а-яА-Я]+")]);
    serialValidator = new FormControl( '',[Validators.required, Validators.pattern("^[1-9]{4}-[1-9]{6}")]);
    agencyValidator = new FormControl( '',[Validators.required, Validators.pattern("[1-9а-яА-Я.,\\- ]+")]);
    addressValidator = new FormControl( '',[Validators.required, Validators.pattern("[1-9а-яА-Я.,\\- ]+")]);
    codeValidator = new FormControl( '',[Validators.required, Validators.pattern("[1-9]+")]);
    matcher = new MyErrorStateMatcher();

    mindate = new Date(1991, 1, 1);
    maxdate = Date.now();

    subdata: SubData[] = [
        {value: 'lastname-0', viewValue: 'Фамилия'},
        {value: 'document-1', viewValue: 'Тип документа'},
        {value: 'country-2', viewValue: 'Страна выдачи'},
        {value: 'date-3', viewValue: 'Дата выдачи'},
        {value: 'serial-4', viewValue: 'Серия и номер'},
        {value: 'code-5', viewValue: 'Код подразделения'},
        {value: 'agency-6', viewValue: 'Орган, выдавший документ'},
        {value: 'address-7', viewValue: 'Адрес регистрации'}
    ];
    docums: Document[] = [
        {value: 'passport-0', viewValue: 'Паспорт'},
        {value: 'intpass-1', viewValue: 'Загран паспорт'},
        {value: 'seapass-2', viewValue: 'Паспорт моряка'}
    ];

    showConfig() {
        this.configService.getConfig()
            .subscribe((data: Config) => this.conf = {
                msisdn: data['msisdn'],
                sourceName: data['sourceName'],
                sourceDoc: data['sourceDoc'],
                sourceCountry: data['sourceCountry'],
                sourceDate: data['sourceDate'],
                sourceSerNum: data['sourceSerNum'],
                sourceCode: data['sourceCode'],
                sourceAgency: data['sourceAgency'],
                sourceAddress: data['sourceAddress']
            });
    }
}

@Component({
    selector: 'modal-dialog',
    template: `
        <h1 mat-dialog-title></h1>
        <div mat-dialog-content>
            <p>Сценарий прерван!</p>
        </div>
        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close] cdkFocusInitial>Ok</button>
        </div>

    `
})
export class ModaDialog{
    constructor(public dialogRef: MatDialogRef<ModaDialog>) {}
}

@Component({
    selector: 'success',
    template: `
        <h1>Сценарий добавлен в корзину!</h1>
    `
})
export class AfterSubmit{

}

