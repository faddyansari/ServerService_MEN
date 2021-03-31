import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import 'codemirror/mode/javascript/javascript';
import { EmailTemplateService } from '../../../../../services/LocalServices/EmailTemplateService';
import { Subscription } from 'rxjs/Subscription';
import { ToastNotifications } from '../../../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UploadingService } from '../../../../../services/UtilityServices/UploadingService';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalStateService } from '../../../../../services/GlobalStateService';
// import { CanComponentDeactivate } from '../../../../../services/ConfirmationGuard';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import * as CodeMirror from 'codemirror';
@Component({
	selector: 'app-template-builder',
	templateUrl: './template-builder.component.html',
	styleUrls: ['./template-builder.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TemplateBuilderComponent implements OnInit {
	bindedId: any;
	element: any;
	elRef: ElementRef;
	fileerror: string;
	@ViewChild('fileInput') fileInput: ElementRef;
	@ViewChild('preview') preview: ElementRef;
	@ViewChild('mainDiv') mainDiv: ElementRef;
	@ViewChild('changeHeading') changeHeading: ElementRef;

	Object = Object;
	isDragged = false;
	fileUrl: any;
	section: any;
	previewTemplate: any;
	previewCode: string;
	mainObj: any;
	offY: number;
	offX: number;

	//pills
	pill1 = true;
	pill2 = false;
	pill3 = false;

	codeMirrorOptions: any = {
		theme: 'base16-light',
		mode: { name: 'javascript' },
		lineNumbers: true,
		lineWrapping: true,
		foldGutter: true,
		gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
		autoCloseBrackets: true,
		matchBrackets: true,
		lint: true
	  };
	//options and their options
	links =
		{
			'Facebook': 'facebook',
			'LinkedIn': 'linkedin',
			'Twitter': 'twitter',
			'Youtube': 'youtube',
			'Instagram': 'instagram',
		};
	//for summernote
	config: any = {
		placeholder: 'Enter Paragraph..',
		toolbar: [
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontname', ['fontname']],
			['table', ['table']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontstyle', ['backcolor']],
			['fontsize', ['fontsize']],
			['color', ['color']],
			['para', ['ul', 'ol', 'listStyles', 'paragraph', 'indent', 'outdent']],
			['height', ['height']],
			['insert', ['linkDialogShow', 'unlink']],
			['view', ['fullscreen', 'codeview', 'help', 'undo', 'redo']]
		]
	};
	sectionChildClone = [];

	//Default options

	defaultButtonSettings = {
		buttonText: 'Button',
		buttonLink: ''
	};
	defaultParaSettings = {
		ParagraphText: "Sample Text ..."
	};
	defaultImageSettings = {
		src: null
	};
	defaultLinkSettings = [
		{
			linkType: 'Facebook',
			path: ''
		},
		{
			linkType: 'LinkedIn',
			path: ''
		},
		{
			linkType: 'Twitter',
			path: ''
		},
		{
			linkType: 'Youtube',
			path: ''
		},
		{
			linkType: 'Instagram',
			path: ''
		}
	];
	AlignmentOptions = ['center', 'left', 'right'];

	//for tracking of elements.
	currentElement: any;
	editCurrentElement: any;
	elementsList = [];
	update = false;
	// cancel = false;
	imagetarget: any;
	template_name = '';
	file: File;
	nsp: string = '';
	email: string = '';

	public templateForm: FormGroup;

	//all flags
	ButtonFlag = false;
	ParaFlag = false;
	ImageFlag = false;
	dragFromLayout = false;
	LinksFlag = false;
	divFlag = false;
	separatorFlag = false;
	uploading = false;
	addLinkBool = false;
	showCode = false;
	fileValid = false;

	//bold and italic
	bold = false;
	italic = false;

	//toggling flags
	toggleComp = false;
	toggleElement = false;
	toggleCont = false;

	showDropdown = false;

	//true when edit area opens
	enableEdit = false;
	selectedTemplate = undefined;

	//subscriptions
	subscriptions: Subscription[] = [];

	// For list of templates
	all_templates = [];
	DefaultSettings = undefined;
	buttons: any;
	data: any;
	ChildSettings: any;
	ParentSettings: any;
	mainContainerSettings: any;
	params: any;
	templateChanges: any;
	//regex for color.
	public colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;

	constructor(private _globalStateService: GlobalStateService,
		private sanitized: DomSanitizer,
		private _uploadingService: UploadingService,
		public formbuilder: FormBuilder,
		private _router: ActivatedRoute,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private _emailTemplateService: EmailTemplateService
	) {
		this.nsp = this._emailTemplateService.Agent.nsp;
		this.email = this._emailTemplateService.Agent.email;
		//getting all templates.
		this.subscriptions.push(this._emailTemplateService.AllTemplates.subscribe(data => {
			if (data && data.length) {
				this.all_templates = data;
			}
		}));



		//identifying which button is pressed.
		this.subscriptions.push(this._emailTemplateService.ButtonPressed.subscribe(data => {
			this.buttons = data;
			switch (this.buttons.buttonType) {
				case 'save':
					this.SaveTemplate();
					break;
				case 'cancel':
					this.Cancel();
					break;
				case 'update':
					this.UpdateTemplate();
					break;
				case 'saveAsFile':
					this.SaveAsFile();
					break;
				case 'saveAsNew':
					this.SaveTemplate();
					break;
			}

		}));

		this.subscriptions.push(this._emailTemplateService.defaultSettings.subscribe(data => {
			if (data) { this.DefaultSettings = data; }
			else { this.DefaultSettings = undefined; }
		}));

		//in case of edit, selected template to edit
		this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(data => {
			if (data) {
				this.selectedTemplate = data;

				this.template_name = this.selectedTemplate.templateName;
				this.elementsList = this.selectedTemplate.createdElements;

				this.mainObj = this.selectedTemplate.main_Div;
			}
			else {
				this.selectedTemplate = undefined;
			}

		}));

		if (!this.selectedTemplate) {

			this.subscriptions.push(this._router.params.subscribe(params => {
				this.params = params;

				if (params.type) {
					this._emailTemplateService.passLayout.next(params.type);
					this._emailTemplateService.getLayoutByName();
					this.subscriptions.push(this._emailTemplateService.EmailLayout.subscribe(data => {
						if (data && data.layout) {
							this.elementsList = data.layout.createdElements;
							this.mainObj = data.layout.main_Div;
						}
						else {
							this.elementsList = [];
							this.mainObj = [];
						}
					}));
				}

			}));
		}

		//settings that are changing, defined in service.
		this.subscriptions.push(this._emailTemplateService.defaultSettings.subscribe(data => {
			if (data) { this.DefaultSettings = data; }
			else { this.DefaultSettings = undefined; }
		}));

		this.subscriptions.push(this._emailTemplateService.defualtProperties.subscribe(data => {
			if (data) {
				this.data = data;
				this.ChildSettings = data.ChildSettings;
				this.ParentSettings = data.ParentSettings;
				this.mainContainerSettings = data.mainContainerSettings;
			}
		}));
	}

	ngOnInit() {
		this.templateForm = this.formbuilder.group({
			//PARENT CONTROLS
			'backgroundColorParent':
				[this.DefaultSettings.ParentSettings.backgroundColorParent,
				[
					Validators.pattern(this.colorRegex)
				]
				],
			'textAlignParent':
				[this.DefaultSettings.ParentSettings.textAlignParent,
				[]
				],
			// 'placement':
			//   [this.DefaultSettings.ParentSettings.placement,
			//   []
			//   ],
			'paddingParent_top':
				[this.DefaultSettings.ParentSettings.paddingParent_top,
				[]
				],
			'paddingParent_bottom':
				[this.DefaultSettings.ParentSettings.paddingParent_bottom,
				[]
				],
			'paddingParent_left':
				[this.DefaultSettings.ParentSettings.paddingParent_left,
				[]
				],
			'paddingParent_right':
				[this.DefaultSettings.ParentSettings.paddingParent_right,
				[]
				],
			'borderParent_width':
				[this.DefaultSettings.ParentSettings.borderParent_width,
				[]
				],
			'borderParent_style':
				[this.DefaultSettings.ParentSettings.borderParent_style,
				[]
				],
			'borderParent_color':
				[this.DefaultSettings.ParentSettings.borderParent_color,
				[]
				],
			'marginParent_top':
				[this.DefaultSettings.ParentSettings.marginParent_top,
				[]
				],
			'marginParent_bottom':
				[this.DefaultSettings.ParentSettings.marginParent_bottom,
				[]
				],
			'marginParent_left':
				[this.DefaultSettings.ParentSettings.marginParent_left,
				[]
				],
			'marginParent_right':
				[this.DefaultSettings.ParentSettings.marginParent_right,
				[]
				],

			//CHILD CONTROLS
			'borderChild_width':
				[this.DefaultSettings.ChildSettings.borderChild_width,
				[]
				],
			'borderRadiusChild':
				[this.DefaultSettings.ChildSettings.borderRadiusChild,
				[]
				],
			'textColorChild':
				[this.DefaultSettings.ChildSettings.textColorChild,
				[]
				],
			'colorChild':
				[this.DefaultSettings.ChildSettings.colorChild,
				[
					Validators.pattern(this.colorRegex)
				]
				],
			'button_FontSizeChild':
				[this.DefaultSettings.ChildSettings.button_FontSizeChild,
				[]
				],
			'fontWeightChild':
				[this.DefaultSettings.ChildSettings.fontWeightChild,
				[]
				],
			'fontStyleChild':
				[this.DefaultSettings.ChildSettings.fontStyleChild,
				[]
				],
			'button_Width_Type_Child':
				[this.DefaultSettings.ChildSettings.button_Width_Type_Child,
				[]
				],
			'button_WidthChild':
				[this.DefaultSettings.ChildSettings.button_WidthChild,
				[]
				],
			'scaleTypeChild':
				[this.DefaultSettings.ChildSettings.scaleTypeChild,
				[]
				],
			'borderChild_style':
				[this.DefaultSettings.ChildSettings.borderChild_style,
				[]
				],
			'borderChild_color':
				[this.DefaultSettings.ChildSettings.borderChild_color,
				[]
				],
			'paddingChild_top':
				[this.DefaultSettings.ChildSettings.paddingChild_top,
				[]
				],
			'paddingChild_bottom':
				[this.DefaultSettings.ChildSettings.paddingChild_bottom,
				[]
				],
			'paddingChild_left':
				[this.DefaultSettings.ChildSettings.paddingChild_left,
				[]
				],
			'paddingChild_right':
				[this.DefaultSettings.ChildSettings.paddingChild_right,
				[]
				],
			//CONTAINER CONTROLS
			'marginContainer_top':
				[this.DefaultSettings.ContainerSettings.marginContainer_top,
				[]
				],
			'marginContainer_bottom':
				[this.DefaultSettings.ContainerSettings.marginContainer_bottom,
				[]
				],
			'marginContainer_left':
				[this.DefaultSettings.ContainerSettings.marginContainer_left,
				[]
				],
			'marginContainer_right':
				[this.DefaultSettings.ContainerSettings.marginContainer_right,
				[]
				],
			'paddingContainer_top':
				[this.DefaultSettings.ContainerSettings.paddingContainer_top,
				[]
				],
			'paddingContainer_bottom':
				[this.DefaultSettings.ContainerSettings.paddingContainer_bottom,
				[]
				],
			'paddingContainer_left':
				[this.DefaultSettings.ContainerSettings.paddingContainer_left,
				[]
				],
			'paddingContainer_right':
				[this.DefaultSettings.ContainerSettings.paddingContainer_right,
				[]
				],
			'backgroundColor_Container':
				[this.DefaultSettings.ContainerSettings.backgroundColorImage_Container,
				[]
				],
			'backgroundImg_Container':
				[this.DefaultSettings.ContainerSettings.backgroundImg_Container,
				[]
				],
			'backgroundRepeat_Container':
				[this.DefaultSettings.ContainerSettings.backgroundRepeat_Container,
				[]
				],
			'backgroundSize_Container':
				[this.DefaultSettings.ContainerSettings.backgroundSize_Container,
				[]
				],
			'backgroundSizePercent_Container':
				[this.DefaultSettings.ContainerSettings.backgroundSizePercent_Container,
				[]
				],
			'backgroundPositionX_Container':
				[this.DefaultSettings.ContainerSettings.backgroundPositionX_Container,
				[]
				],
			'backgroundPositionY_Container':
				[this.DefaultSettings.ContainerSettings.backgroundPositionY_Container,
				[]
				],
			'borderWidthContainer':
				[this.DefaultSettings.ContainerSettings.borderWidthContainer,
				[]
				],
			'borderStyleContainer':
				[this.DefaultSettings.ContainerSettings.borderStyleContainer,
				[]
				],
			'borderColorContainer':
				[this.DefaultSettings.ContainerSettings.borderColorContainer,
				[]
				],
			'containerWidth':
				[this.DefaultSettings.ContainerSettings.containerWidth,
				[]
				],
			'containerimageOpacity':
				[this.DefaultSettings.ContainerSettings.imageOpacity,
				[]
				],
			//GENERAL CONTROLS
			'buttonText':
				[this.defaultButtonSettings.buttonText,
				[]
				],
			'buttonLink':
				[this.defaultButtonSettings.buttonLink,
				[]
				],
			'paragraphText':
				[this.defaultParaSettings.ParagraphText,
				[]
				],
			'SocialLinks': this.formbuilder.array(this.TransformLinks(this.defaultLinkSettings), Validators.required),

			'imageSrc':
				[null,
					[]
				],
		});
		this.Validation();
		this.onChanges();
	}

	TransformLinks(links?: Array<any>): FormGroup[] {

		let fb: FormGroup[] = [];
		links.map(op => {
			fb.push(this.formbuilder.group({
				linkType: [op.linkType, Validators.required],
				path: [op.path, Validators.required]
			}));

		});
		return fb;
	}

	onChanges() {
		this.templateForm.valueChanges.subscribe(val => {
			this.templateChanges = val;
			this.MapToDOM(this.currentElement, val);
		});
	}


	Validation() {
		if (!this.template_name) {
			setTimeout(() => {
				this._emailTemplateService.validation.next({
					buttonType: 'save',
					disabled: true
				})
			}, 0)
		}
		else {
			setTimeout(() => {
				this._emailTemplateService.validation.next({
					buttonType: 'save',
					disabled: false
				})
			}, 0)
		}
	}

	ReturnBackgroundsize(mainObj) {
		if (mainObj && mainObj.backgroundSize_Container) {
			if (mainObj.backgroundSize_Container != '%') { return mainObj.backgroundSize_Container }
			else return mainObj.backgroundSizePercent_Container + '%'
		}
		else {
			return this.mainContainerSettings.backgroundSize_Container;
		}
	}

	MapToList(element, list, Editcase?) {
		let parentStyling = {};
		let childStyling = {};
		Object.keys(this.templateForm.controls).map(key => {
			if (key.includes('Parent')) {
				parentStyling[key] = this.templateForm.controls[key].value;
			}
			else {
				return;
			}
		});
		Object.keys(this.templateForm.controls).map(key => {
			if (key.includes('Child')) {
				childStyling[key] = this.templateForm.controls[key].value;
			}
			else {
				return;
			}
		});
		let generalSettings = {
			'buttonText': this.templateForm.get('buttonText').value,
			'buttonLink': this.templateForm.get('buttonLink').value,
			'SocialLinks': (this.templateForm.get('SocialLinks') as FormArray).value,
			'paragraphText': this.templateForm.get('paragraphText').value,
			'imageSrc': this.templateForm.get('imageSrc').value
		}

		list.map(f => {
			if (f['id'].includes('container')) {

				f.childs.map(search => {
					//console.log(search.sectionChilds);
					if (search.id.split(':')[1] == element.parentNode.id.split(':')[1]) {
						search.sectionChilds.map(sectionElt => {
							if (sectionElt.id == element.id) {
								//console.log("here", sectionElt);
								sectionElt.parentStyling = parentStyling;
								sectionElt.childStyling = childStyling;
								sectionElt.generalSettings = generalSettings;
							}
						});
					}
				});
			}
			else {
				if (f['id'] == element.id) {
					f['parentStyling'] = parentStyling;
					f['childStyling'] = childStyling;
					f['generalSettings'] = generalSettings;
				}
			}
		});
	}

	addLink() {
		const fg = this.formbuilder.group({
			'linkType': ['', Validators.compose([Validators.required])],
			'path': ['', Validators.compose([Validators.required])]
		});
		(<FormArray>this.templateForm.controls['SocialLinks']).push(fg);
		this.addLinkBool = true;
	}

	removeLink(index) {
		const formLink = this.templateForm.get('SocialLinks') as FormArray
		formLink.removeAt(index);
		let ind = this.elementsList.findIndex(x => x.id == this.element.id);
		this.elementsList[ind].generalSettings.SocialLinks.splice(index, 1);
	}

	GetControls(name: string) {
		return (this.templateForm.get(name) as FormArray).controls;
	}

	setPillActive(pill) {
		switch (pill) {
			case 'pill1':
				this.pill1 = true;
				this.pill2 = false;
				this.pill3 = false;
				break;
			case 'pill2':
				let readCode = this.CopyOfTarget();
				this.previewTemplate = this.sanitized.bypassSecurityTrustHtml(readCode);
				this.pill1 = false;
				this.pill2 = true;
				this.pill3 = false;
				break;
				case 'pill3':
				let code = this.CopyOfTarget();
				this.previewCode = this._emailTemplateService.SetCodeAndReturn(code);

				this.pill1 = false;
				this.pill2 = false;
				this.pill3 = true;
				break;
		}
	}

	// divMove(event) {
	// 	event.stopImmediatePropagation();
	// 	event.stopPropagation();
	// 	if (event.target.id) {
	// 		event.preventDefault();
	// 		this.DraggedDiv = (event.target.cloneNode(true) as HTMLElement);
	// 		this.DraggerDiv = (event.target as HTMLElement);
	// 	}
	// 	else if (!event.target.id && event.target.tagName.toLowerCase() == 'img') {
	// 		event.preventDefault();
	// 		this.DraggedDiv = (event.target.parentNode.cloneNode(true) as HTMLElement);
	// 		this.DraggerDiv = (event.target.parentNode as HTMLElement);
	// 	}
	// 	else if (!event.target.id && event.target.tagName.toLowerCase() == 'b') {
	// 		event.preventDefault();
	// 		this.DraggedDiv = (event.target.parentNode.cloneNode(true) as HTMLElement);
	// 		this.DraggerDiv = (event.target.parentNode as HTMLElement);
	// 	}
	// 	else {
	// 		this.snackBar.openFromComponent(ToastNotifications, {
	// 			data: {
	// 				img: 'warning',
	// 				msg: 'Incorrect Drag!'
	// 			},
	// 			duration: 3000,
	// 			panelClass: ['user-alert', 'error']
	// 		});
	// 		return false
	// 	}

	// 	this.offY = event.clientY - parseInt((event.target as HTMLElement).offsetTop as any);
	// 	this.offX = event.clientX - parseInt((event.target as HTMLElement).offsetLeft as any);

	// 	//console.log(this.offY, this.offX);


	// 	this.mainDiv.nativeElement.addEventListener('mouseup', (ev: MouseEvent) => {
	// 		this.divMoveStop(ev);
	// 	}, false);

	// 	window.addEventListener('mousemove', (ev: MouseEvent) => {
	// 		// //console.log(ev.clientY - this.offY, ev.clientX - this.offX);

	// 		if (this.DraggerDiv) {
	// 			(this.DraggerDiv as HTMLElement).style.position = 'absolute';
	// 			(this.DraggerDiv as HTMLElement).style.top = (ev.clientY - this.offY) + 'px';
	// 			(this.DraggerDiv as HTMLElement).style.left = (ev.clientX - this.offX) + 'px';
	// 			(this.DraggerDiv as HTMLElement).style.zIndex = "9999";
	// 		}
	// 	});


	// }

	// divMoveStop(event: MouseEvent) {
	// 	event.stopPropagation();
	// 	event.stopImmediatePropagation();
	// 	if (this.DraggerDiv) {
	// 		this.DraggerDiv.style.position = 'absolute';
	// 		this.DraggerDiv.style.top = (event.clientY - this.offY) + 'px';
	// 		this.DraggerDiv.style.left = (event.clientX - this.offX) + 'px';
	// 		this.DraggerDiv.style.display = 'none';

	// 		if (this.DraggedDiv && (((event.target as HTMLElement) == this.mainDiv.nativeElement) || (event.target as HTMLElement).id.includes('container') || (event.target as HTMLElement).className.includes('actions'))) {

	// 			this.Ondrop(this.DraggedDiv, event);
	// 		}
	// 		window.removeEventListener('mouseover', function (e: MouseEvent) {
	// 		}, false);
	// 		// this.DraggerDiv.remove();

	// 	}
	// 	else {
	// 		return;
	// 	}
	// 	this.DraggerDiv = undefined;
	// 	this.DraggedDiv = undefined;
	// }

	getOffset(el) {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY
		};
	}
	setEditorContent(e){

		console.log(this.previewCode);

	}

	Ondrop(el, e) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		e.target.classList.remove('no-elements');
		let divCollection = (el as HTMLElement).getElementsByClassName('svgOnHover');
		if (el.id.includes('container')) {
			let imageCollection = (el as HTMLElement).getElementsByClassName('svg');
			let labelCollection = (el as HTMLElement).getElementsByClassName('label');
			if (imageCollection) {
				Array.from(imageCollection).map(node => {
					el.removeChild(node);
				});
			}
			if (labelCollection) {
				Array.from(labelCollection).map(node => {
					el.removeChild(node);
				});
			}
		}

		if (divCollection) {
			Array.from(divCollection).map(node => {
				el.removeChild(node);
			});
		}
		(el as HTMLElement).firstElementChild.classList.remove('hide');

		this.InitiateElementAndReturnId(el, e);
		// keeping separate b/c it of clone..
		this.ApplyDefaultSettings(el, e);
	}
	allowDrop(event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.isDragged = true;
	}

	drag(event) {
		if ((event.target as HTMLElement).id) {
			event.dataTransfer.setData("text", event.target.id);
		}
		else if (!event.target.id && event.target.tagName.toLowerCase() == 'img') {
			event.dataTransfer.setData("text", event.target.parentNode.id);
		}
		else if (!event.target.id && event.target.tagName.toLowerCase() == 'b') {
			event.dataTransfer.setData("text", event.target.parentNode.id);
		}
	}
	drop(event) {
		event.preventDefault();
		this.isDragged = false;
		let id = event.dataTransfer.getData("text");
		let el = document.getElementById(id);
		if (this.dragFromLayout) {
			// //console.log(el);
			// //console.log(event.target.id);
			// this.elementsList[this.returnIndex(this.elementsList, el.id)] = event.target.id;
			// this.elementsList[this.returnIndex(this.elementsList, event.target.id)] = el.id;
			// el.id = event.target.id;
			// event.target.id = el.id;
			// let xCcord = event.clientX, yCord = event.clientY;
			// let elementMouseIsOver = document.elementFromPoint(xCcord, yCord);
			// //console.log(elementMouseIsOver);
			// if (this.contains(event.target.id,arr)) {
			let index = this.elementsList.findIndex(x => x.id == event.target.id);
			let indx = this.elementsList.findIndex(x => x.id == id);
			let swappingElt = this.elementsList[index];
			this.elementsList[index] = this.elementsList[indx];
			this.elementsList[indx] = swappingElt;
			this.dragFromLayout = false;
			//console.log(this.elementsList);
			// } else {
			//   //console.log("wrong drag");
			// }
		}
		else {
			let node = (el.cloneNode(true) as HTMLElement);
			this.Ondrop(node, event);
		}
	}

	DragLeave(event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.isDragged = false;
	}

	InitiateElementAndReturnId(el, event?) {
		if (!(this.elementsList.filter(check => check.id && check.id == el.id).length > 0)) {
			//common id for each elt.
			el.id = 'elementId' + '-' + Math.random() + '_' + el.id;
			let input: any = {
				id: el.id,
				type: el.id.split('_')[1],
			}
			if (event.target.tagName.toLowerCase() == 'td' && !event.target.id.includes('section') && !el.id.includes('container') && !el.id.includes('section')) {
				//means in maindiv and independent element.
				this.elementsList.push(input);
			}
			else if (event.target.id.includes('section') && !(el.id.includes('container'))) {
				// element inside section
				el.id = 'Insection' + '-' + el.id;
				input.id = el.id;
				this.elementsList.map(search => {
					if (search.id == event.target.id.split(':')[0]) {
						search.childs.map(sectionSearch => {
							if (sectionSearch.id.split(':')[1] == event.target.id.split(':')[1]) {
								sectionSearch.sectionChilds.push(input);
							}
						});
					}
				});
			}
			else {
				//means section
				if (el.firstElementChild.tagName.toLowerCase() == 'table') {
					input.childs = [];
					let tb = el.firstElementChild;
					let tbodys = tb.getElementsByTagName("tbody")[0],
						trs = tbodys.getElementsByTagName("tr");
					let tds = trs[0].children;
					for (let i = 0; i < tds.length; i++) {
						tds[i].id = input.id + ':' + 'sectionId' + '-' + Math.random();

						input.childs.push(
							{
								id: tds[i].id,
								type: 'section',
								width: tds[i].getAttribute('width'),
								sectionChilds: []
							});
					}
					this.elementsList.push(input);
				} else {

					this.snackBar.openFromComponent(ToastNotifications, {
						data: {
							img: 'warning',
							msg: 'Incorrect drop! Drop again'
						},
						duration: 2000,
						panelClass: ['user-alert', 'warning']
					});
				}
			}
		}
		else {
			return;
		}
	}
	CloneElementAndReturnId(el, orgNode, td?) {
		el.id = 'elementId' + '-' + Math.random() + '_' + el.id;
		let input: any = {
			id: el.id,
			type: el.id.split('_')[1],
		}
		//means in maindiv and independent element.
		if (!el.id.includes('container') && !td) {
			this.elementsList.push(input);
		}
		else if (!el.id.includes('container') && td) {
			input.childs = [];
			let EltInSection;
			td.sectionChilds.forEach(child => {
				if (child.id == orgNode.id) {
					EltInSection = JSON.parse(JSON.stringify(orgNode));
					EltInSection.id = 'Insection' + '-' + 'elementId' + '-' + Math.random() + '_' + input.type;
				}
			});
			td.sectionChilds.push(EltInSection);
			input.childs.push(
				{
					id: td.id,
					type: 'section',
					width: td.width,
					sectionChilds: td.sectionChilds
				});
		}
		else {
			input.childs = [];
			let temp;
			el.childs.forEach((td, i) => {
				let sectionChilds = [];
				td.sectionChilds.forEach(child => {
					temp = JSON.parse(JSON.stringify(child));
					temp.id = 'elementId' + '-' + Math.random() + '_' + child.type;
					sectionChilds.push(temp);
				});
				input.childs.push(
					{
						id: input.id + ':' + 'sectionId' + '-' + Math.random(),
						type: 'section',
						width: el.childs[i].width,
						sectionChilds: sectionChilds
					});
			});
			this.elementsList.push(input);
		}
	}

	ApplyDefaultSettings(element, event) {
		let type = element.id.split('_')[1];
		let generalSettings = {
			'buttonText': this.defaultButtonSettings.buttonText,
			'buttonLink': this.defaultButtonSettings.buttonLink,
			'SocialLinks': this.defaultLinkSettings,
			'paragraphText': this.defaultParaSettings.ParagraphText,
			'imageSrc': this.defaultImageSettings.src,
		}
		//independent element..
		this.elementsList.map(inList => {
			if ((inList['id'] == element.id) && type != 'container') {
				let val = this.DefaultStyling(type);
				inList['parentStyling'] = val.parentStyling;
				inList['childStyling'] = val.childStyling;
				inList['generalSettings'] = generalSettings;
			}
			else {
				if (inList.id.includes('container') && event.target.id.split(':')[0].includes('container')) {
					inList.childs.map(sectionSearch => {

						if (sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
							sectionSearch.sectionChilds.forEach(pushInChild => {
								if (pushInChild.id == element.id) {
									////console.log("2nd one");
									let val = this.DefaultStyling(type);
									pushInChild.parentStyling = val.parentStyling;
									pushInChild.childStyling = val.childStyling;
									pushInChild.generalSettings = generalSettings;
								}
							});
						}
					});
				}
			}
		});

	}

	patchValues(label, value) {
		return this.formbuilder.group({
			linkType: [label],
			path: [value]
		})
	}

	DefaultStyling(type) {
		let parentStyling = {};
		let childStyling = {};
		Object.assign(parentStyling, this.ParentSettings[type]);
		Object.assign(childStyling, this.ChildSettings[type]);
		return ({ childStyling: childStyling, parentStyling: parentStyling });
	}

	CloneElement(event, node, td?) {
		event.preventDefault();
		event.stopImmediatePropagation();
		//change ids to default one.
		let temp = JSON.parse(JSON.stringify(node));
		if (node.id.includes('button')) {
			temp.id = 'button'
		} else if (node.id.includes('paragraph')) {
			temp.id = 'paragraph';
		} else if (node.id.includes('image')) {
			temp.id = 'image';
		} else if (node.id.includes('SocialMediaLinks')) {
			temp.id = 'SocialMediaLinks';
		} else if (node.id.includes('separator')) {
			temp.id = 'separator';
		} else if (node.id.includes('container1')) {
			temp.id = 'container1';
		} else if (node.id.includes('container2')) {
			temp.id = 'container2';
		} else if (node.id.includes('container3')) {
			temp.id = 'container3';
		} else if (node.id.includes('container4')) {
			temp.id = 'container4';
		}

		this.CloneElementAndReturnId(temp, node, td);

		if (!node.id.includes('container') && !td) {
			//store properties
			let tempParentStyling = node.parentStyling;
			let tempChildStyling = node.childStyling;
			let tempGeneralSettings = node.generalSettings;
			//changed id of cloned node

			let ind = this.elementsList.findIndex(x => x.id == temp.id);
			this.elementsList[ind].parentStyling = tempParentStyling;
			this.elementsList[ind].childStyling = tempChildStyling;
			this.elementsList[ind].generalSettings = tempGeneralSettings;
		}
		this.snackBar.openFromComponent(ToastNotifications, {
			data: {
				img: 'ok',
				msg: 'Element Cloned Sucessfully!'
			},
			duration: 2000,
			panelClass: ['user-alert', 'success']
		});
	}

	MapValues(f) {
		if (f && f["generalSettings"] && f["childStyling"] && f["parentStyling"]) {
			//for childStyling
			Object.keys(f["childStyling"]).map(key => {

				this.templateForm.controls[key].setValue(f['childStyling'][key]);
				this.DefaultSettings.ChildSettings[key] = f['childStyling'][key];
			});

			//for parentStyling
			Object.keys(f["parentStyling"]).map(key => {
				this.templateForm.controls[key].setValue(f['parentStyling'][key]);
				this.DefaultSettings.ParentSettings[key] = f['parentStyling'][key];
			});

			//for generalSettings
			(<FormArray>this.templateForm.controls['SocialLinks']) = this.formbuilder.array([]);
			let control = (<FormArray>this.templateForm.controls['SocialLinks']);
			if (f["generalSettings"].SocialLinks && f["generalSettings"].SocialLinks.length) f["generalSettings"].SocialLinks.forEach(x => {
				control.push(this.patchValues(x.linkType, x.path) as any)
			});
			this.templateForm.controls['buttonText'].setValue(f['generalSettings'].buttonText);
			this.templateForm.controls['buttonLink'].setValue(f['generalSettings'].buttonLink);
			this.templateForm.controls['paragraphText'].setValue(f['generalSettings'].paragraphText);
			this.templateForm.controls['imageSrc'].setValue(f['generalSettings'].imageSrc ? f['generalSettings'].imageSrc : "/assets/img/icons/icons-sprite.svg#attachment");
		}
		//console.log(this.templateForm);

	}

	CheckAndMapForm(list, element, editCase?) {
		//console.log(list);

		let type = element.id.split('_')[1];
		switch (type) {
			case 'button':
				this.ButtonFlag = true; this.ParaFlag = false; this.ImageFlag = false; this.LinksFlag = false; this.divFlag = false;
				break;
			case 'paragraph':
				this.ParaFlag = true; this.ButtonFlag = false; this.ImageFlag = false; this.LinksFlag = false; this.divFlag = false;
				break;
			case 'image':
				this.ImageFlag = true; this.ParaFlag = false; this.ButtonFlag = false; this.LinksFlag = false; this.divFlag = false;
				break;
			case 'SocialMediaLinks':
				this.LinksFlag = true; this.ParaFlag = false; this.ButtonFlag = false; this.ButtonFlag = false; this.divFlag = false;
				break;
			case 'separator':
				this.separatorFlag = true; this.ParaFlag = false; this.ButtonFlag = false; this.LinksFlag = false; this.divFlag = false;
				break;
			case 'div':
				this.divFlag = true; this.separatorFlag = false; this.ParaFlag = false; this.ButtonFlag = false; this.LinksFlag = false;

		}
		if (element.id == "main_div") {
			if (this.mainObj) {
				Object.keys(this.mainObj).map(key => {
					this.templateForm.controls[key].setValue(this.mainObj[key]);
					this.DefaultSettings.ContainerSettings[key] = this.mainObj[key];
				});
			}
			else {
				Object.keys(this.mainContainerSettings).map(key => {
					this.templateForm.controls[key].setValue(this.mainContainerSettings[key]);
					this.DefaultSettings.ContainerSettings[key] = this.mainContainerSettings[key];
				});
			}
		}
		else {
			//if it is section elt..
			list.map(f => {
				if (f['type'].includes('container')) {
					f.childs.map(search => {
						//console.log(search.sectionChilds);
						if (search.id.split(':')[1] == element.parentNode.id.split(':')[1]) {
							search.sectionChilds.forEach(sectionElt => {
								if (sectionElt.id == element.id) {
									this.MapValues(sectionElt);
								}
							});
						}
					});
				}
				else {
					//else independent elt..
					if (f.id == element.id && (f['generalSettings'] || f['parentStyling'] || f['childStyling'])) {
						this.MapValues(f);
						return true;
					}
					else {
						return false;
					}
				}
			});
		}
	}

	UploadImage() {
		if (this.file && !this.uploading) {
			this.uploading = true;
			this._uploadingService.SignRequest(this.file, 'uploadBackgroundImage').subscribe(response => {
				let params = JSON.parse(response.text());
				params.file = this.file
				this._uploadingService.uploadAttachment(params).subscribe(s3response => {
					if (s3response.status == '201') {
						this._uploadingService.parseXML(s3response.text()).subscribe(json => {
							if (this.currentElement) ((this.currentElement as HTMLElement).firstElementChild.firstElementChild as HTMLImageElement).src = json.response.PostResponse.Location[0];
							else ((this.editCurrentElement as HTMLElement).firstElementChild.firstElementChild as HTMLImageElement).src = json.response.PostResponse.Location[0];

							this.uploading = false;
						}, err => {
							this.uploading = false;
						});
					}
				}, err => {
					this.uploading = false;
				});
			}, err => {
				this._uploadingService.ShowAttachmentError(JSON.parse(err)).subscribe(fileerror => {
					this.fileerror = fileerror;
					if (err) {
						this.uploading = false;
						this.fileValid = false;
						setTimeout(() => [
							this.fileValid = true
						], 4500);
						this.ClearFile();
					}
				}, err => {
				});
			});
		}
	}

	//for editing main container, which is in this component only.
	EditElement(event, id) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		this.enableEdit = true;
		this.currentElement = document.getElementById(id);
		//console.log(this.currentElement);

		this.CheckAndMapForm(this.elementsList, this.currentElement);
	}

	editChangedHandler(sentElement) {
		this.enableEdit = sentElement.showPanel;
		this.bindedId = sentElement.id;
		this.currentElement = document.getElementById(this.bindedId);
		//console.log(this.currentElement);

		if (sentElement.showPanel) {
			this.CheckAndMapForm(this.elementsList, this.currentElement);
		}
	}

	deleteHandler(DeleteElement) {
		this.enableEdit = DeleteElement.showPanel;
	}

	CloneHandler(sentElement) {
		if (sentElement.td) this.CloneElement(sentElement.event, sentElement.element, sentElement.td);
		else this.CloneElement(sentElement.event, sentElement.element);
	}

	ShowCode() {
		this.showCode = !this.showCode;
		let parser = new DOMParser();
		if (this.mainDiv && this.mainDiv.nativeElement) {
			let htmlDoc = parser.parseFromString(this.mainDiv.nativeElement.outerHTML, 'text/html');
			let allButtons = Array.from(htmlDoc.querySelectorAll('.actions'));
			allButtons.forEach(x => x.remove());
			this.previewCode = htmlDoc.body.firstElementChild.outerHTML;
		}
	}

	ToggleElt() {
		this.toggleElement = !this.toggleElement;
	}

	ToggleCont() {
		this.toggleCont = !this.toggleCont;
	}

	ToggleComp() {
		this.toggleComp = !this.toggleComp;
	}

	ToggleSectionDropdown() {
		this.showDropdown = !this.showDropdown;
	}

	MapToDOM(element, val) {
		if (element) {
			if (element.id == 'main_div') {
				this.changeHeading.nativeElement.innerHTML = 'Template Box Width: ' + val.containerWidth + 'px';

				(element as HTMLElement).style.backgroundImage = 'url(' + val.backgroundImg_Container + ')';
				(element as HTMLElement).style.backgroundColor = val.backgroundColor_Container;
				(element as HTMLElement).style.opacity = val.containerimageOpacity;
				(element as HTMLElement).style.borderWidth = val.borderWidthContainer + 'px';
				if (val.borderStyleContainer == 'none') (element as HTMLElement).style.borderStyle = 'none';
				else (element as HTMLElement).style.borderStyle = val.borderStyleContainer;
				(element as HTMLElement).style.borderColor = val.borderColorContainer;
				(element as HTMLElement).style.paddingTop = val.paddingContainer_top + 'px';
				(element as HTMLElement).style.paddingBottom = val.paddingContainer_bottom + 'px';
				(element as HTMLElement).style.paddingLeft = val.paddingContainer_left + 'px';
				(element as HTMLElement).style.paddingRight = val.paddingContainer_right + 'px';
				(element as HTMLElement).style.marginTop = val.marginContainer_top + 'px';
				(element as HTMLElement).style.marginBottom = val.marginContainer_bottom + 'px';
				(element as HTMLElement).style.marginLeft = val.marginContainer_left + 'px';
				(element as HTMLElement).style.marginRight = val.marginContainer_right + 'px';
				(element as HTMLElement).style.backgroundRepeat = val.backgroundRepeat_Container;
				(element as HTMLElement).style.backgroundPositionX = val.backgroundPositionX_Container;
				(element as HTMLElement).style.backgroundPositionY = val.backgroundPositionY_Container;
				if (val.backgroundSize_Container == '%') {
					(element as HTMLElement).style.backgroundSize = val.backgroundSizePercent_Container + '%';
				}
				else (element as HTMLElement).style.backgroundSize = val.backgroundSize_Container;
			}
			else {
				//Parent Mapping..
				(element as HTMLElement).style.backgroundColor = val.backgroundColorParent;
				if (val.borderParent_style == 'none') (element as HTMLElement).style.borderStyle = 'none';
				else (element as HTMLElement).style.border = val.borderParent_width + 'px' + ' ' + val.borderParent_style + ' ' + val.borderParent_color;
				(element as HTMLElement).style.paddingTop = val.paddingParent_top + 'px';
				(element as HTMLElement).style.paddingBottom = val.paddingParent_bottom + 'px';
				(element as HTMLElement).style.paddingLeft = val.paddingParent_left + 'px';
				(element as HTMLElement).style.paddingRight = val.paddingParent_right + 'px';
				(element as HTMLElement).style.marginTop = val.marginParent_top + 'px';
				(element as HTMLElement).style.marginBottom = val.marginParent_bottom + 'px';
				(element as HTMLElement).style.marginLeft = val.marginParent_left + 'px';
				(element as HTMLElement).style.marginRight = val.marginParent_right + 'px';
				(element as HTMLElement).style.textAlign = val.textAlignParent ? val.textAlignParent.toString() : 'left';

				if (element.id.split('_')[1] == 'paragraph') {
					((element as HTMLElement).firstElementChild as HTMLParagraphElement).innerHTML = val.paragraphText;
					if (val.scaleTypeChild == 'px') ((element as HTMLElement).firstElementChild as HTMLParagraphElement).style.width = val.button_WidthChild + 'px';
					else if ((val.scaleTypeChild == '%')) ((element as HTMLParagraphElement).firstElementChild as HTMLParagraphElement).style.width = val.button_WidthChild + '%';
					else if (val.scaleTypeChild == 'auto') ((element as HTMLElement).firstElementChild as HTMLParagraphElement).style.width = 'auto';
				}
				if (element.id.split('_')[1] == 'button') {
					((element as HTMLElement).firstElementChild as HTMLButtonElement).innerText = val.buttonText;
					((element as HTMLElement).firstElementChild as HTMLButtonElement).style.fontSize = val.button_FontSizeChild + 'px';
					if ((val.scaleTypeChild == 'px') && !element.id.includes('image')) ((element as HTMLElement).firstElementChild as HTMLElement).style.width = val.button_WidthChild + 'px';
					else if ((val.scaleTypeChild == '%') && !element.id.includes('image')) ((element as HTMLElement).firstElementChild as HTMLElement).style.width = val.button_WidthChild + '%';
					else if (val.scaleTypeChild == 'auto') ((element as HTMLElement).firstElementChild as HTMLElement).style.width = 'auto';
					((element as HTMLElement).firstElementChild as HTMLElement).style.display = 'inline-block';


					((element as HTMLElement).firstElementChild as HTMLElement).style.color = val.textColorChild;

				}
				if ((val.scaleTypeChild == 'px') && !element.id.includes('image')) ((element as HTMLElement).firstElementChild as HTMLElement).style.width = val.button_WidthChild + 'px';
				else if ((val.scaleTypeChild == '%') && !element.id.includes('image')) ((element as HTMLElement).firstElementChild as HTMLElement).style.width = val.button_WidthChild + '%';
				else if ((val.scaleTypeChild == 'auto') && !element.id.includes('image')) ((element as HTMLElement).firstElementChild as HTMLElement).style.width = 'auto';
				((element as HTMLElement).firstElementChild as HTMLElement).style.borderRadius = val.borderRadiusChild + 'px';

				if (element.id.includes('SocialMediaLinks')) {
					Array.from((element as HTMLElement).querySelectorAll("a")).forEach(linkStyle => {
						(linkStyle.firstElementChild as HTMLElement).style.paddingTop = val.paddingChild_top + 'px';
						(linkStyle.firstElementChild as HTMLElement).style.paddingBottom = val.paddingChild_bottom + 'px';
						(linkStyle.firstElementChild as HTMLElement).style.paddingLeft = val.paddingChild_left + 'px';
						(linkStyle.firstElementChild as HTMLElement).style.width = val.button_WidthChild + val.scaleTypeChild;
						(linkStyle.firstElementChild as HTMLElement).style.paddingRight = val.paddingChild_right + 'px';
						if (val.borderChild_style == 'none') (linkStyle.firstElementChild as HTMLElement).style.borderStyle = 'none';
						else (linkStyle.firstElementChild as HTMLElement).style.border = val.borderChild_width + 'px' + ' ' + val.borderChild_style + ' ' + val.borderChild_color;
						(linkStyle.firstElementChild as HTMLElement).style.backgroundColor = val.colorChild;
						(linkStyle.firstElementChild as HTMLElement).style.borderRadius = val.borderRadiusChild + 'px';
					});
				}
				else if (element.id.includes('image')) {
					if (val.scaleTypeChild == 'px') ((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.width = val.button_WidthChild + 'px';
					else if (val.scaleTypeChild == '%') ((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.width = val.button_WidthChild + '%';
					else if (val.scaleTypeChild == 'auto') ((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.width = 'auto';
					((element as HTMLElement).firstElementChild.firstElementChild as HTMLImageElement).src = val.imageSrc;
					((element as HTMLElement).firstElementChild.firstElementChild as HTMLImageElement).style.backgroundColor = val.colorChild;
					((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.border = val.borderChild_width + 'px' + ' ' + val.borderChild_style + ' ' + val.borderChild_color;
					((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.paddingTop = val.paddingChild_top + 'px';
					((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.paddingBottom = val.paddingChild_bottom + 'px';
					((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.paddingLeft = val.paddingChild_left + 'px';
					((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.paddingRight = val.paddingChild_right + 'px';
					if (val.scaleTypeChild == 'px') ((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.width = val.button_WidthChild + 'px';
					else if (val.scaleTypeChild == '%') ((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.width = val.button_WidthChild + '%';
					else if (val.scaleTypeChild == 'auto') ((element as HTMLElement).firstElementChild.firstElementChild as HTMLElement).style.width = 'auto';
				}
				else {
					if (!element.id.includes('image')) ((element as HTMLElement).firstElementChild as HTMLElement).style.backgroundColor = val.colorChild;
					if (val.borderChild_style == 'none') ((element as HTMLElement).firstElementChild as HTMLElement).style.borderStyle = 'none';
					else ((element as HTMLElement).firstElementChild as HTMLElement).style.border = val.borderChild_width + 'px' + ' ' + val.borderChild_style + ' ' + val.borderChild_color;
					((element as HTMLElement).firstElementChild as HTMLElement).style.paddingTop = val.paddingChild_top + 'px';
					((element as HTMLElement).firstElementChild as HTMLElement).style.paddingBottom = val.paddingChild_bottom + 'px';
					((element as HTMLElement).firstElementChild as HTMLElement).style.paddingLeft = val.paddingChild_left + 'px';
					((element as HTMLElement).firstElementChild as HTMLElement).style.paddingRight = val.paddingChild_right + 'px';
				}
				// if (element.id.includes('image')) {

				// }
			}
		}
	}

	ChangeImgAndHref(ParticularLink, index) {
		//If: when icon already exists and you are editing it
		if (!this.element.children[index].className.includes("actions")) {
			this.element.children[index].childNodes[1].src = this.links[ParticularLink.controls['linkType'].value];
		}
		//Else: when icon not exists, and you are cloning it.
		else {
			let node = this.element.children[0].cloneNode(true);
			node.href = ParticularLink.controls['path'].value;
			node.firstElementChild.src = this.links[ParticularLink.controls['linkType'].value];
			let ind = this.elementsList.findIndex(x => x.id == this.element.id);
			let temp = {
				linkType: ParticularLink.controls['linkType'].value,
				path: ParticularLink.controls['path'].value
			}
			this.elementsList[ind].generalSettings.SocialLinks.push(temp);
		}

	}

	LinkChange(index) {
		let ParticularLink = ((this.templateForm.get('SocialLinks') as FormArray).controls[index] as FormGroup);
		this.ChangeImgAndHref(ParticularLink, index);
	}

	DisableInput(event: KeyboardEvent) {
		event.preventDefault();
	}

	ColorChange(event: string, data: any) {
		this.templateForm.get(event).setValue(this._emailTemplateService.RGBAToHexAString(data));
	}

	FontWeight() {
		this.bold = !this.bold;
		if (!this.currentElement.id.includes('Insection')) {
			let ind = this.elementsList.findIndex(x => x.id == this.currentElement.id);
			if (this.bold) {
				this.templateForm.get('fontWeightChild').setValue('bold');
				this.elementsList[ind].childStyling.fontWeightChild = 'bold';
			}
			else {
				this.templateForm.get('fontWeightChild').setValue('');
				this.elementsList[ind].childStyling.fontWeightChild = '';
			}
		}
		else {
			this.elementsList.map(search => {
				search.childs.forEach(sectionSearch => {

					sectionSearch.sectionChilds.forEach(sectionElt => {
						if (sectionSearch.id.split(':')[1] == this.currentElement.parentNode.id.split(':')[1]) {
							if (this.bold) {
								this.templateForm.get('fontWeightChild').setValue('bold');
								sectionElt.childStyling.fontWeightChild = 'bold';
							}
							else {
								this.templateForm.get('fontWeightChild').setValue('');
								sectionElt.childStyling.fontWeightChild = '';
							}
							return true;
						}
						else {
							return false;
						}
					});
				});
			});
		}
	}

	FontStyle() {
		this.italic = !this.italic;
		//console.log(this.currentElement.id);
		if (!this.currentElement.id.includes('Insection')) {
			let ind = this.elementsList.findIndex(x => x.id == this.currentElement.id);
			if (this.italic) {
				this.templateForm.get('fontStyleChild').setValue('italic');
				this.elementsList[ind].childStyling.fontStyleChild = 'italic';
			}
			else {
				this.templateForm.get('fontStyleChild').setValue('');
				this.elementsList[ind].childStyling.fontStyleChild = '';
			}
		}
		else {
			this.elementsList.map(search => {
				search.childs.forEach(sectionSearch => {

					sectionSearch.sectionChilds.forEach(sectionElt => {
						if (sectionSearch.id.split(':')[1] == this.currentElement.parentNode.id.split(':')[1]) {
							if (this.italic) {
								this.templateForm.get('fontStyleChild').setValue('italic');
								sectionElt.childStyling.fontStyleChild = 'italic';
							}
							else {
								this.templateForm.get('fontStyleChild').setValue('italic');
								sectionElt.childStyling.fontStyleChild = '';
							}
							return true;
						}
						else {
							return false;
						}
					});
				});
			});
		}
	}

	FileSelected() {
		this.fileValid = true;
		if ((<HTMLInputElement>event.target).files[0]) {

			this.file = (<HTMLInputElement>event.target).files[0];
			// this.readURL(this.file);
			return;
		} else {
			this.fileValid = false;
			this.ClearFile();

			setTimeout(() => [
				this.fileValid = true
			], 3000);

		}

		this.file = undefined;
		return;
	}

	ClearFile() {
		this.file = undefined;
		this.fileInput.nativeElement.value = '';
		this.uploading = false;
	}

	// readURL(file) {
	//   if (file) {
	//     let picReader = new FileReader();
	//     picReader.addEventListener("load", (event: any) => {
	//       this.templateForm.patchValue({
	//         imageSrc: event.target.result
	//       });
	//     });
	//     picReader.readAsDataURL(file);
	//   }
	// }

	SaveEdit(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		this.mainObj = {};
		if (this.currentElement.id == "main_div") {
			Object.keys(this.templateForm.controls).map(key => {
				if (key.includes('Container') || key.includes('container')) {
					this.mainObj[key] = this.templateForm.controls[key].value;
				}
			});
		} else {
			this.MapToList(this.currentElement, this.elementsList);
		}
		this.enableEdit = false;
	}
	GetLinks(i) {
		let actionList = {
			'Facebook': '',
			'LinkedIn': '',
			'Twitter': '',
			'Youtube': '',
			'Instagram': ''
		}
		let actions = this.templateForm.get('SocialLinks') as FormArray;
		actions.controls.map((control, index) => {
			if (actionList[actions.controls[index].get('linkType').value] && index != i) delete actionList[actions.controls[index].get('linkType').value]
		});
		return actionList;
	}

	ResetToDefault() {

		if (this.currentElement.id == "main_div") {
			Object.keys(this.mainContainerSettings).map(key => {
				this.templateForm.controls[key].setValue(this.mainContainerSettings[key]);
				this.DefaultSettings.ContainerSettings[key] = this.mainContainerSettings[key];
			});
		}
		else {
			let type = this.currentElement.id.split('_')[1];
			let val = this.DefaultStyling(type);
			let index = this.elementsList.findIndex(x => x.id == this.currentElement.id);
			this.elementsList[index].parentStyling = val.parentStyling;
			this.elementsList[index].childStyling = val.childStyling;
		}
		//console.log(this.elementsList);
		this.enableEdit = false;
	}

	// confirm() {
	// 	console.log(this.elementsList);

	// 	if (this.update) return true;
	// 	// if(this.cancel) return false;
	// 	else return !(this.elementsList && this.elementsList.length)
	// }

	SaveTemplate() {
		if (this.all_templates && this.all_templates.filter(data => data.templateName == this.template_name.toLowerCase()).length > 0) {
			this.snackBar.openFromComponent(ToastNotifications, {
				data: {
					img: 'warning',
					msg: 'Template name already exists!'
				},
				duration: 3000,
				panelClass: ['user-alert', 'error']
			});
			return;
		}
		else {
			this.mainDiv.nativeElement.style.width = this.mainObj && this.mainObj.containerWidth ? this.mainObj.containerWidth + 'px' : this.mainContainerSettings.containerWidth + 'px';
			this.mainObj = this.mainObj && this.mainObj.length ? this.mainObj : this.mainContainerSettings;
			let allButtons = this.mainDiv.nativeElement.querySelectorAll('.actions');
			allButtons.forEach(x => x.remove());
			let TextClasses = this.mainDiv.nativeElement.querySelectorAll('.textClass');
			TextClasses.forEach(x => x.remove());

			let noElementRemove = this.mainDiv.nativeElement.querySelectorAll('.no-elements');
			noElementRemove.forEach(el => el.classList.remove("no-elements"));
			let removeClass = this.mainDiv.nativeElement.querySelectorAll('.no-pointer');
			removeClass.forEach(el => el.classList.remove("no-pointer"));
			let html = this._emailTemplateService.SetCodeAndReturn(this.mainDiv.nativeElement.outerHTML);
			let obj = {
				sourceType: this.params.type,
				templateName: this.template_name,
				nsp: this.nsp,
				html: html,
				lastModified: {},
				createdDate: new Date().toISOString(),
				createdBy: this.email,
				createdElements: this.elementsList,
				main_Div: this.mainObj
			}
			this._emailTemplateService.insertEmailTemplate(obj).subscribe(response => {
				if (response.status == "ok") {
					this.template_name = '';
					this.elementsList = [];
					this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
				}
			});
		}
	}

	SaveAsFile() {
		let data = this.CopyOfTarget();
		let result = this._emailTemplateService.SetCodeAndReturn(data);
		let a = document.createElement('a');
		a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
		a.setAttribute('download', 'TemplateLayout.html');
		a.remove();
		a.click();
	}

	CopyOfTarget() {
		let parser = new DOMParser();
		let htmlDoc = parser.parseFromString(this.mainDiv.nativeElement.outerHTML, 'text/html');
		let allButtons = Array.from(htmlDoc.querySelectorAll('.actions'));
		allButtons.forEach(x => x.remove());
		let TextClasses = Array.from(htmlDoc.querySelectorAll('.textClass'));
		TextClasses.forEach(x => x.remove());
		let allDropText = Array.from(htmlDoc.querySelectorAll('.no-elements'));
		allDropText.forEach(x => x.remove());
		let removeClass = Array.from(htmlDoc.querySelectorAll('.no-pointer'));
		removeClass.forEach(el => el.classList.remove("no-pointer"));
		let noElementRemove = Array.from(htmlDoc.querySelectorAll('.no-elements'));
		noElementRemove.forEach(el => el.classList.remove("no-elements"));

		let droppableclass = Array.from(htmlDoc.querySelectorAll('.elements-droppable'));
		droppableclass.forEach(el => el.classList.remove("elements-droppable"));
		return htmlDoc.body.firstElementChild.outerHTML;
	}

	UpdateTemplate() {
		this.update = true;
		let allButtons = this.mainDiv.nativeElement.querySelectorAll('.actions');
		allButtons.forEach(x => x.remove());
		this.mainDiv.nativeElement.style.width = this.mainObj && this.mainObj.containerWidth ? this.mainObj.containerWidth + 'px' : this.mainContainerSettings.containerWidth + 'px';
		this.mainObj = this.mainObj && this.mainObj.length ? this.mainObj : this.mainContainerSettings;

		let noElementRemove = this.mainDiv.nativeElement.querySelectorAll('.no-elements');
		noElementRemove.forEach(el => el.classList.remove("no-elements"));
		let TextClasses = this.mainDiv.nativeElement.querySelectorAll('.textClass');
		TextClasses.forEach(x => x.remove());
		let removeClass = this.mainDiv.nativeElement.querySelectorAll('.no-pointer');
		removeClass.forEach(el => el.classList.remove("no-pointer"));
		this.previewCode = this._emailTemplateService.SetCodeAndReturn(this.mainDiv.nativeElement.outerHTML);
		let obj = {
			sourceType: this.selectedTemplate.type,
			templateName: this.template_name,
			nsp: this.nsp,
			html: this.previewCode,
			lastModified: {},
			createdDate: '',
			createdBy: '',
			createdElements: this.elementsList,
			main_Div: this.mainObj
		}
		this._emailTemplateService.UpdateTemplate(this.selectedTemplate._id, obj).subscribe(response => {
			if (response.status == "ok") {
				this._emailTemplateService.selectedTemplate.next(undefined);
				this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
			}
		});
	}

	Cancel() {
		if (this.templateChanges || this.template_name || (this.elementsList && this.elementsList.length)) {
			this.dialog.open(ConfirmationDialogComponent, {
				panelClass: ['confirmation-dialog'],
				data: { headermsg: 'Are you sure want to exit?' }
			}).afterClosed().subscribe(data => {
				if (data == 'ok') {
					this._emailTemplateService.selectedTemplate.next(undefined);
					this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
					this.elementsList = [];
					this.templateForm.reset();
				}
			});
		}
		else{
			console.log('template builder else');
			this._emailTemplateService.selectedTemplate.next(undefined);
			this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
			this.elementsList = [];
			this.templateForm.reset();
		}

	}

	dragged(elt) {
		//console.log(elt.target.id);
		this.dragFromLayout = true;
		elt.dataTransfer.setData("text", elt.target.id);
		elt.dataTransfer.effectAllowed = "move";
	}

	// dropDragged(ev) {
	//   // ev.preventDefault();
	//   //console.log(ev);

	//   let srcNode = document.getElementById(ev.target.id);

	//   let srcParent = srcNode.parentNode;
	// //console.log(ev.currentTarget);


	//   // var tgt = ev.currentTarget.;
	//   //console.log(tgt);

	//   ev.currentTarget.replaceChild(srcNode, tgt);
	//   srcParent.appendChild(tgt);
	// }

	CancelEdit() {
		this.enableEdit = false;
	}
	ngOnDestroy() {
		this.subscriptions.map(res => {
			res.unsubscribe();
		});
		this._emailTemplateService.selectedTemplate.next(undefined);
	}
}