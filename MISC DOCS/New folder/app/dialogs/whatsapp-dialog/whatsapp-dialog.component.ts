import { Component, OnInit, ViewEncapsulation, Directive } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { AuthService } from '../../../services/AuthenticationService';
import { MatDialogRef } from '@angular/material/dialog';
import { SocketService } from '../../../services/SocketService';
import { WhatsAppService } from '../../../services/WhatsAppService';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-whatsapp-dialog',
    templateUrl: './whatsapp-dialog.component.html',
    styleUrls: ['./whatsapp-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WhatsappDialogComponent implements OnInit {

    private emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public loading = false;
    private subscriptions: Subscription[] = [];

    public contactRegForm: FormGroup;

    public isEmailUnique: Boolean = true;
    public addAnother: boolean = false;
    public alreadyExisits = false;

    constructor(public _authService: AuthService,
        private formbuilder: FormBuilder,
        private dialogRef: MatDialogRef<WhatsappDialogComponent>,
        private _whatsAppService: WhatsAppService
    ) {
        this.contactRegForm = formbuilder.group({
            'customerName': [null, Validators.required],
            'countryCode': ['',
                [
                    Validators.pattern(/^[0-9\-]+$/),
                    Validators.required
                ]
            ],
            'customerNo': ['',
                [
                    Validators.pattern(/^[0-9\-]+$/),
                    Validators.required
                ]
            ]

        });
    }

    ngOnInit() {


    }

    ngAfterViewInit() { }

    ngOnDestroy() {
        this.subscriptions.map(subscription => { subscription.unsubscribe(); });
    }

    public NumbersOnly(event: any) {
        const pattern = /[0-9\-]+/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    submitForm() {
        //this.contactRegForm.valid
        // console.log('Submitting Form');
        this.loading = true;
        this.alreadyExisits = false;
        if (this.contactRegForm.valid) {
            let contact = {
                customerName: this.contactRegForm.get('customerName').value,
                customerNo: this.contactRegForm.get('countryCode').value + this.contactRegForm.get('customerNo').value,
            }
            this._whatsAppService.AddContact(contact).subscribe(res => {
                this.loading = false;
                if (res == 'ok') {
                    if (this.addAnother) this.contactRegForm.reset();
                    else this.dialogRef.close();

                } else {
                    this.alreadyExisits = true;
                }

            }, err => {
                this.loading = false;
            });
        }
    }

    Close(event: Event) {
        this.dialogRef.close();
    }

    CountrySelected(event: string) {
        // console.log(event);
        if (event.trim()) this.contactRegForm.get('countryCode').setValue(event.match(/\((.*)\)/).pop());
        else this.contactRegForm.get('countryCode').setValue('');
    }

    public GetCountryCodes() {
        return Object.keys(this.countryWithCodes);
    }

    public GetCountryValue() {
        return Object.values(this.countryWithCodes);
    }


    public countryWithCodes = {
        "AD": "Andorra (376)",
        "AE": "United Arab Emirates (971)",
        "AF": "Afghanistan (93)",
        "AG": "Antigua and Barbuda (1-268)",
        "AI": "Anguilla (1-264)",
        "AL": "Albania (355)",
        "AM": "Armenia (374)",
        "AO": "Angola (244)",
        "AQ": "Antarctica (672)",
        "AR": "Argentina (54)",
        "AS": "American Samoa (1-684)",
        "AT": "Austria (43)",
        "AU": "Australia (61)",
        "AW": "Aruba (297)",
        "AZ": "Azerbaijan (994)",
        "BA": "Bosnia and Herzegovina (387)",
        "BB": "Barbados (1-246)",
        "BD": "Bangladesh (880)",
        "BE": "Belgium (32)",
        "BF": "Burkina Faso (226)",
        "BG": "Bulgaria (359)",
        "BH": "Bahrain (973)",
        "BI": "Burundi (257)",
        "BJ": "Benin (229)",
        "BL": "Saint Barthelemy (590)",
        "BM": "Bermuda (1-441)",
        "BN": "Brunei (673)",
        "BO": "Bolivia (591)",
        "BR": "Brazil (55)",
        "BS": "Bahamas (1-242)",
        "BT": "Bhutan (975)",
        "BW": "Botswana (267)",
        "BY": "Belarus (375)",
        "BZ": "Belize (501)",
        "CA": "Canada (1)",
        "CC": "Cocos Islands (61)",
        "CD": "Democratic Republic of the Congo (243)",
        "CF": "Central African Republic (236)",
        "CG": "Republic of the Congo (242)",
        "CH": "Switzerland (41)",
        "CI": "Ivory Coast (225)",
        "CK": "Cook Islands (682)",
        "CL": "Chile (56)",
        "CM": "Cameroon (237)",
        "CN": "China (86)",
        "CO": "Colombia (57)",
        "CR": "Costa Rica (506)",
        "CU": "Cuba (53)",
        "CV": "Cape Verde (238)",
        "CW": "Curacao (599)",
        "CX": "Christmas Island (61)",
        "CY": "Cyprus (357)",
        "CZ": "Czech Republic (420)",
        "DE": "Germany (49)",
        "DJ": "Djibouti (253)",
        "DK": "Denmark (45)",
        "DM": "Dominica (1-767)",
        "DO": "Dominican Republic (1-809)",
        "D1": "Dominican Republic (1-829)",
        "D2": "Dominican Republic (1-824)",
        "DZ": "Algeria (213)",
        "EC": "Ecuador (593)",
        "EE": "Estonia (372)",
        "EG": "Egypt (20)",
        "EH": "Western Sahara (212)",
        "ER": "Eritrea (291)",
        "ES": "Spain (34)",
        "ET": "Ethiopia (251)",
        "FI": "Finland (358)",
        "FJ": "Fiji (679)",
        "FK": "Falkland Islands (500)",
        "FM": "Micronesia (691)",
        "FO": "Faroe Islands (298)",
        "FR": "France (33)",
        "GA": "Gabon (241)",
        "GB": "United Kingdom (44)",
        "GD": "Grenada (1-473)",
        "GE": "Georgia (995)",
        "GG": "Guernsey (44-1481)",
        "GH": "Ghana (233)",
        "GI": "Gibraltar (350)",
        "GL": "Greenland (299)",
        "GM": "Gambia (220)",
        "GN": "Guinea (224)",
        "GQ": "Equatorial Guinea (240)",
        "GR": "Greece (30)",
        "GT": "Guatemala (502)",
        "GU": "Guam (1-671)",
        "GW": "Guinea-Bissau (245)",
        "GY": "Guyana (592)",
        "HK": "Hong Kong (852)",
        "HN": "Honduras (504)",
        "HR": "Croatia (385)",
        "HT": "Haiti (509)",
        "HU": "Hungary (36)",
        "ID": "Indonesia (62)",
        "IE": "Ireland (353)",
        "IL": "Israel (972)",
        "IM": "Isle of Man (44-1624)",
        "IN": "India (91)",
        "IQ": "Iraq (964)",
        "IR": "Iran (98)",
        "IS": "Iceland (354)",
        "IT": "Italy (39)",
        "JE": "Jersey (44-1534)",
        "JM": "Jamaica (1-876)",
        "JO": "Jordan (962)",
        "JP": "Japan (81)",
        "KE": "Kenya (254)",
        "KG": "Kyrgyzstan (996)",
        "KH": "Cambodia (855)",
        "KI": "Kiribati (686)",
        "KM": "Comoros (269)",
        "KN": "Saint Kitts and Nevis (1-869)",
        "KP": "North Korea (850)",
        "KR": "South Korea (82)",
        "KW": "Kuwait (965)",
        "KY": "Cayman Islands (1-345)",
        "KZ": "Kazakhstan (7)",
        "LA": "Laos (856)",
        "LB": "Lebanon (961)",
        "LC": "Saint Lucia (1-758)",
        "LI": "Liechtenstein (423)",
        "LK": "Sri Lanka (94)",
        "LR": "Liberia (231)",
        "LS": "Lesotho (266)",
        "LT": "Lithuania (370)",
        "LU": "Luxembourg (352)",
        "LV": "Latvia (371)",
        "LY": "Libya (218)",
        "MA": "Morocco(212)",
        "MC": "Monaco (377)",
        "MD": "Moldova (373)",
        "ME": "Montenegro (382)",
        "MF": "Saint Martin (590)",
        "MG": "Madagascar (261)",
        "MH": "Marshall Islands (692)",
        "MK": "Macedonia (389)",
        "ML": "Mali (223)",
        "MM": "Myanmar (95)",
        "MN": "Mongolia (976)",
        "MO": "Macau (853)",
        "MR": "Mauritania(222)",
        "MS": "Montserrat (1-664)",
        "MT": "Malta (356)",
        "MU": "Mauritius (230)",
        "MV": "Maldives (960)",
        "MW": "Malawi(265)",
        "MX": "Mexico (52)",
        "MY": "Malaysia (60)",
        "MZ": "Mozambique(258)",
        "NA": "Namibia (264)",
        "NC": "New Caledonia (687)",
        "NE": "Niger (227)",
        "NG": "Nigeria (234)",
        "NI": "Nicaragua (505)",
        "NL": "Netherlands (31)",
        "NO": "Norway (47)",
        "NP": "Nepal (977)",
        "NR": "Nauru (674)",
        "NU": "Niue (683)",
        "NZ": "New Zealand (64)",
        "OM": "Oman (968)",
        "PA": "Panama (507)",
        "PE": "Peru (51)",
        "PF": "French Polynesia (689)",
        "PG": "Papua New Guinea (675)",
        "PH": "Philippines (63)",
        "PK": "Pakistan (92)",
        "PL": "Poland (48)",
        "PM": "Saint Pierre and Miquelon (508)",
        "PN": "Pitcairn (64)",
        "PR": "Puerto Rico (1-939)",
        "PS": "Palestinian (970)",
        "PT": "Portugal (351)",
        "PW": "Palau (680)",
        "PY": "Paraguay (595)",
        "QA": "Qatar (974)",
        "RE": "Reunion (262)",
        "RS": "Serbia (381)",
        "RU": "Russia (7)",
        "RW": "Rwanda (250)",
        "SA": "Saudi Arabia (966)",
        "SB": "Solomon Islands (677)",
        "SC": "Seychelles (248)",
        "SD": "Sudan (249)",
        "SE": "Sweden (46)",
        "SG": "Singapore (65)",
        "SH": "Saint Helena (290)",
        "SI": "Slovenia (386)",
        "SJ": "Svalbard and Jan Mayen (47)",
        "SK": "Slovakia (421)",
        "SL": "Sierra Leone (232)",
        "SM": "San Marino (378)",
        "SN": "Senegal (221)",
        "SO": "Somalia (252)",
        "SR": "Suriname (597)",
        "SS": "South Sudan (211)",
        "ST": "Sao Tome and Principe (239)",
        "SV": "El Salvador (503)",
        "SX": "Sint Maarten (1-721)",
        "SY": "Syria (963)",
        "SZ": "Swaziland (268)",
        "TC": "Turks and Caicos Islands (1-649)",
        "TD": "Chad (235)",
        "TG": "Togo (228)",
        "TH": "Thailand (66)",
        "TJ": "Tajikistan (992)",
        "TK": "Tokelau (690)",
        "TL": "East Timor (670)",
        "TM": "Turkmenistan (993)",
        "TN": "Tunisia (216)",
        "TO": "Tonga (676)",
        "TR": "Turkey (90)",
        "TT": "Trinidad and Tobago (1-868)",
        "TV": "Tuvalu (688)",
        "TW": "Taiwan (886)",
        "TZ": "Tanzania (255)",
        "RO": "Romania (40)",
        "UA": "Ukraine (380)",
        "UG": "Uganda (256)",
        "US": "United States (1)",
        "UY": "Uruguay (598)",
        "UZ": "Uzbekistan (998)",
        "VA": "Vatican (379)",
        "VC": "Saint Vincent and the Grenadines (1-784)",
        "VE": "Venezuela (58)",
        "VG": "British Virgin Islands (1-284)",
        "VI": "U.S. Virgin Islands (1-340)",
        "VN": "Vietnam (84)",
        "VU": "Vanuatu (678)",
        "WF": "Wallis and Futuna (681)",
        "WS": "Samoa (685)",
        "XK": "Kosovo (383)",
        "YE": "Yemen (967)",
        "YT": "Mayotte (262)",
        "ZA": "South Africa (27)",
        "ZM": "Zambia (260)",
        "ZW": "Zimbabwe (263)"
    }



}
