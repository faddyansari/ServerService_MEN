"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateBuilderComponent = void 0;
var core_1 = require("@angular/core");
// import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
require("codemirror/mode/javascript/javascript");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var forms_1 = require("@angular/forms");
var confirmation_dialog_component_1 = require("../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var TemplateBuilderComponent = /** @class */ (function () {
    function TemplateBuilderComponent(_globalStateService, sanitized, _uploadingService, formbuilder, _router, snackBar, dialog, _emailTemplateService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this.sanitized = sanitized;
        this._uploadingService = _uploadingService;
        this.formbuilder = formbuilder;
        this._router = _router;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._emailTemplateService = _emailTemplateService;
        this.Object = Object;
        this.isDragged = false;
        //pills
        this.pill1 = true;
        this.pill2 = false;
        this.pill3 = false;
        this.codeMirrorOptions = {
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
        this.links = {
            'Facebook': 'facebook',
            'LinkedIn': 'linkedin',
            'Twitter': 'twitter',
            'Youtube': 'youtube',
            'Instagram': 'instagram',
        };
        //for summernote
        this.config = {
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
        this.sectionChildClone = [];
        //Default options
        this.defaultButtonSettings = {
            buttonText: 'Button',
            buttonLink: ''
        };
        this.defaultParaSettings = {
            ParagraphText: "Sample Text ..."
        };
        this.defaultImageSettings = {
            src: null
        };
        this.defaultLinkSettings = [
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
        this.AlignmentOptions = ['center', 'left', 'right'];
        this.elementsList = [];
        this.update = false;
        this.template_name = '';
        this.nsp = '';
        this.email = '';
        //all flags
        this.ButtonFlag = false;
        this.ParaFlag = false;
        this.ImageFlag = false;
        this.dragFromLayout = false;
        this.LinksFlag = false;
        this.divFlag = false;
        this.separatorFlag = false;
        this.uploading = false;
        this.addLinkBool = false;
        this.showCode = false;
        this.fileValid = false;
        //bold and italic
        this.bold = false;
        this.italic = false;
        //toggling flags
        this.toggleComp = false;
        this.toggleElement = false;
        this.toggleCont = false;
        this.showDropdown = false;
        //true when edit area opens
        this.enableEdit = false;
        this.selectedTemplate = undefined;
        //subscriptions
        this.subscriptions = [];
        // For list of templates
        this.all_templates = [];
        this.DefaultSettings = undefined;
        //regex for color.
        this.colorRegex = /^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/;
        this.nsp = this._emailTemplateService.Agent.nsp;
        this.email = this._emailTemplateService.Agent.email;
        //getting all templates.
        this.subscriptions.push(this._emailTemplateService.AllTemplates.subscribe(function (data) {
            if (data && data.length) {
                _this.all_templates = data;
            }
        }));
        //identifying which button is pressed.
        this.subscriptions.push(this._emailTemplateService.ButtonPressed.subscribe(function (data) {
            _this.buttons = data;
            switch (_this.buttons.buttonType) {
                case 'save':
                    _this.SaveTemplate();
                    break;
                case 'cancel':
                    _this.Cancel();
                    break;
                case 'update':
                    _this.UpdateTemplate();
                    break;
                case 'saveAsFile':
                    _this.SaveAsFile();
                    break;
                case 'saveAsNew':
                    _this.SaveTemplate();
                    break;
            }
        }));
        this.subscriptions.push(this._emailTemplateService.defaultSettings.subscribe(function (data) {
            if (data) {
                _this.DefaultSettings = data;
            }
            else {
                _this.DefaultSettings = undefined;
            }
        }));
        //in case of edit, selected template to edit
        this.subscriptions.push(this._emailTemplateService.selectedTemplate.subscribe(function (data) {
            if (data) {
                _this.selectedTemplate = data;
                _this.template_name = _this.selectedTemplate.templateName;
                _this.elementsList = _this.selectedTemplate.createdElements;
                _this.mainObj = _this.selectedTemplate.main_Div;
            }
            else {
                _this.selectedTemplate = undefined;
            }
        }));
        if (!this.selectedTemplate) {
            this.subscriptions.push(this._router.params.subscribe(function (params) {
                _this.params = params;
                if (params.type) {
                    _this._emailTemplateService.passLayout.next(params.type);
                    _this._emailTemplateService.getLayoutByName();
                    _this.subscriptions.push(_this._emailTemplateService.EmailLayout.subscribe(function (data) {
                        if (data && data.layout) {
                            _this.elementsList = data.layout.createdElements;
                            _this.mainObj = data.layout.main_Div;
                        }
                        else {
                            _this.elementsList = [];
                            _this.mainObj = [];
                        }
                    }));
                }
            }));
        }
        //settings that are changing, defined in service.
        this.subscriptions.push(this._emailTemplateService.defaultSettings.subscribe(function (data) {
            if (data) {
                _this.DefaultSettings = data;
            }
            else {
                _this.DefaultSettings = undefined;
            }
        }));
        this.subscriptions.push(this._emailTemplateService.defualtProperties.subscribe(function (data) {
            if (data) {
                _this.data = data;
                _this.ChildSettings = data.ChildSettings;
                _this.ParentSettings = data.ParentSettings;
                _this.mainContainerSettings = data.mainContainerSettings;
            }
        }));
    }
    TemplateBuilderComponent.prototype.ngOnInit = function () {
        this.templateForm = this.formbuilder.group({
            //PARENT CONTROLS
            'backgroundColorParent': [this.DefaultSettings.ParentSettings.backgroundColorParent,
                [
                    forms_1.Validators.pattern(this.colorRegex)
                ]
            ],
            'textAlignParent': [this.DefaultSettings.ParentSettings.textAlignParent,
                []
            ],
            // 'placement':
            //   [this.DefaultSettings.ParentSettings.placement,
            //   []
            //   ],
            'paddingParent_top': [this.DefaultSettings.ParentSettings.paddingParent_top,
                []
            ],
            'paddingParent_bottom': [this.DefaultSettings.ParentSettings.paddingParent_bottom,
                []
            ],
            'paddingParent_left': [this.DefaultSettings.ParentSettings.paddingParent_left,
                []
            ],
            'paddingParent_right': [this.DefaultSettings.ParentSettings.paddingParent_right,
                []
            ],
            'borderParent_width': [this.DefaultSettings.ParentSettings.borderParent_width,
                []
            ],
            'borderParent_style': [this.DefaultSettings.ParentSettings.borderParent_style,
                []
            ],
            'borderParent_color': [this.DefaultSettings.ParentSettings.borderParent_color,
                []
            ],
            'marginParent_top': [this.DefaultSettings.ParentSettings.marginParent_top,
                []
            ],
            'marginParent_bottom': [this.DefaultSettings.ParentSettings.marginParent_bottom,
                []
            ],
            'marginParent_left': [this.DefaultSettings.ParentSettings.marginParent_left,
                []
            ],
            'marginParent_right': [this.DefaultSettings.ParentSettings.marginParent_right,
                []
            ],
            //CHILD CONTROLS
            'borderChild_width': [this.DefaultSettings.ChildSettings.borderChild_width,
                []
            ],
            'borderRadiusChild': [this.DefaultSettings.ChildSettings.borderRadiusChild,
                []
            ],
            'textColorChild': [this.DefaultSettings.ChildSettings.textColorChild,
                []
            ],
            'colorChild': [this.DefaultSettings.ChildSettings.colorChild,
                [
                    forms_1.Validators.pattern(this.colorRegex)
                ]
            ],
            'button_FontSizeChild': [this.DefaultSettings.ChildSettings.button_FontSizeChild,
                []
            ],
            'fontWeightChild': [this.DefaultSettings.ChildSettings.fontWeightChild,
                []
            ],
            'fontStyleChild': [this.DefaultSettings.ChildSettings.fontStyleChild,
                []
            ],
            'button_Width_Type_Child': [this.DefaultSettings.ChildSettings.button_Width_Type_Child,
                []
            ],
            'button_WidthChild': [this.DefaultSettings.ChildSettings.button_WidthChild,
                []
            ],
            'scaleTypeChild': [this.DefaultSettings.ChildSettings.scaleTypeChild,
                []
            ],
            'borderChild_style': [this.DefaultSettings.ChildSettings.borderChild_style,
                []
            ],
            'borderChild_color': [this.DefaultSettings.ChildSettings.borderChild_color,
                []
            ],
            'paddingChild_top': [this.DefaultSettings.ChildSettings.paddingChild_top,
                []
            ],
            'paddingChild_bottom': [this.DefaultSettings.ChildSettings.paddingChild_bottom,
                []
            ],
            'paddingChild_left': [this.DefaultSettings.ChildSettings.paddingChild_left,
                []
            ],
            'paddingChild_right': [this.DefaultSettings.ChildSettings.paddingChild_right,
                []
            ],
            //CONTAINER CONTROLS
            'marginContainer_top': [this.DefaultSettings.ContainerSettings.marginContainer_top,
                []
            ],
            'marginContainer_bottom': [this.DefaultSettings.ContainerSettings.marginContainer_bottom,
                []
            ],
            'marginContainer_left': [this.DefaultSettings.ContainerSettings.marginContainer_left,
                []
            ],
            'marginContainer_right': [this.DefaultSettings.ContainerSettings.marginContainer_right,
                []
            ],
            'paddingContainer_top': [this.DefaultSettings.ContainerSettings.paddingContainer_top,
                []
            ],
            'paddingContainer_bottom': [this.DefaultSettings.ContainerSettings.paddingContainer_bottom,
                []
            ],
            'paddingContainer_left': [this.DefaultSettings.ContainerSettings.paddingContainer_left,
                []
            ],
            'paddingContainer_right': [this.DefaultSettings.ContainerSettings.paddingContainer_right,
                []
            ],
            'backgroundColor_Container': [this.DefaultSettings.ContainerSettings.backgroundColorImage_Container,
                []
            ],
            'backgroundImg_Container': [this.DefaultSettings.ContainerSettings.backgroundImg_Container,
                []
            ],
            'backgroundRepeat_Container': [this.DefaultSettings.ContainerSettings.backgroundRepeat_Container,
                []
            ],
            'backgroundSize_Container': [this.DefaultSettings.ContainerSettings.backgroundSize_Container,
                []
            ],
            'backgroundSizePercent_Container': [this.DefaultSettings.ContainerSettings.backgroundSizePercent_Container,
                []
            ],
            'backgroundPositionX_Container': [this.DefaultSettings.ContainerSettings.backgroundPositionX_Container,
                []
            ],
            'backgroundPositionY_Container': [this.DefaultSettings.ContainerSettings.backgroundPositionY_Container,
                []
            ],
            'borderWidthContainer': [this.DefaultSettings.ContainerSettings.borderWidthContainer,
                []
            ],
            'borderStyleContainer': [this.DefaultSettings.ContainerSettings.borderStyleContainer,
                []
            ],
            'borderColorContainer': [this.DefaultSettings.ContainerSettings.borderColorContainer,
                []
            ],
            'containerWidth': [this.DefaultSettings.ContainerSettings.containerWidth,
                []
            ],
            'containerimageOpacity': [this.DefaultSettings.ContainerSettings.imageOpacity,
                []
            ],
            //GENERAL CONTROLS
            'buttonText': [this.defaultButtonSettings.buttonText,
                []
            ],
            'buttonLink': [this.defaultButtonSettings.buttonLink,
                []
            ],
            'paragraphText': [this.defaultParaSettings.ParagraphText,
                []
            ],
            'SocialLinks': this.formbuilder.array(this.TransformLinks(this.defaultLinkSettings), forms_1.Validators.required),
            'imageSrc': [null,
                []
            ],
        });
        this.Validation();
        this.onChanges();
    };
    TemplateBuilderComponent.prototype.TransformLinks = function (links) {
        var _this = this;
        var fb = [];
        links.map(function (op) {
            fb.push(_this.formbuilder.group({
                linkType: [op.linkType, forms_1.Validators.required],
                path: [op.path, forms_1.Validators.required]
            }));
        });
        return fb;
    };
    TemplateBuilderComponent.prototype.onChanges = function () {
        var _this = this;
        this.templateForm.valueChanges.subscribe(function (val) {
            _this.templateChanges = val;
            _this.MapToDOM(_this.currentElement, val);
        });
    };
    TemplateBuilderComponent.prototype.Validation = function () {
        var _this = this;
        if (!this.template_name) {
            setTimeout(function () {
                _this._emailTemplateService.validation.next({
                    buttonType: 'save',
                    disabled: true
                });
            }, 0);
        }
        else {
            setTimeout(function () {
                _this._emailTemplateService.validation.next({
                    buttonType: 'save',
                    disabled: false
                });
            }, 0);
        }
    };
    TemplateBuilderComponent.prototype.ReturnBackgroundsize = function (mainObj) {
        if (mainObj && mainObj.backgroundSize_Container) {
            if (mainObj.backgroundSize_Container != '%') {
                return mainObj.backgroundSize_Container;
            }
            else
                return mainObj.backgroundSizePercent_Container + '%';
        }
        else {
            return this.mainContainerSettings.backgroundSize_Container;
        }
    };
    TemplateBuilderComponent.prototype.MapToList = function (element, list, Editcase) {
        var _this = this;
        var parentStyling = {};
        var childStyling = {};
        Object.keys(this.templateForm.controls).map(function (key) {
            if (key.includes('Parent')) {
                parentStyling[key] = _this.templateForm.controls[key].value;
            }
            else {
                return;
            }
        });
        Object.keys(this.templateForm.controls).map(function (key) {
            if (key.includes('Child')) {
                childStyling[key] = _this.templateForm.controls[key].value;
            }
            else {
                return;
            }
        });
        var generalSettings = {
            'buttonText': this.templateForm.get('buttonText').value,
            'buttonLink': this.templateForm.get('buttonLink').value,
            'SocialLinks': this.templateForm.get('SocialLinks').value,
            'paragraphText': this.templateForm.get('paragraphText').value,
            'imageSrc': this.templateForm.get('imageSrc').value
        };
        list.map(function (f) {
            if (f['id'].includes('container')) {
                f.childs.map(function (search) {
                    //console.log(search.sectionChilds);
                    if (search.id.split(':')[1] == element.parentNode.id.split(':')[1]) {
                        search.sectionChilds.map(function (sectionElt) {
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
    };
    TemplateBuilderComponent.prototype.addLink = function () {
        var fg = this.formbuilder.group({
            'linkType': ['', forms_1.Validators.compose([forms_1.Validators.required])],
            'path': ['', forms_1.Validators.compose([forms_1.Validators.required])]
        });
        this.templateForm.controls['SocialLinks'].push(fg);
        this.addLinkBool = true;
    };
    TemplateBuilderComponent.prototype.removeLink = function (index) {
        var _this = this;
        var formLink = this.templateForm.get('SocialLinks');
        formLink.removeAt(index);
        var ind = this.elementsList.findIndex(function (x) { return x.id == _this.element.id; });
        this.elementsList[ind].generalSettings.SocialLinks.splice(index, 1);
    };
    TemplateBuilderComponent.prototype.GetControls = function (name) {
        return this.templateForm.get(name).controls;
    };
    TemplateBuilderComponent.prototype.setPillActive = function (pill) {
        switch (pill) {
            case 'pill1':
                this.pill1 = true;
                this.pill2 = false;
                this.pill3 = false;
                break;
            case 'pill2':
                var readCode = this.CopyOfTarget();
                this.previewTemplate = this.sanitized.bypassSecurityTrustHtml(readCode);
                this.pill1 = false;
                this.pill2 = true;
                this.pill3 = false;
                break;
            case 'pill3':
                var code = this.CopyOfTarget();
                this.previewCode = this._emailTemplateService.SetCodeAndReturn(code);
                this.pill1 = false;
                this.pill2 = false;
                this.pill3 = true;
                break;
        }
    };
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
    TemplateBuilderComponent.prototype.getOffset = function (el) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    };
    TemplateBuilderComponent.prototype.setEditorContent = function (e) {
        console.log(this.previewCode);
    };
    TemplateBuilderComponent.prototype.Ondrop = function (el, e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.target.classList.remove('no-elements');
        var divCollection = el.getElementsByClassName('svgOnHover');
        if (el.id.includes('container')) {
            var imageCollection = el.getElementsByClassName('svg');
            var labelCollection = el.getElementsByClassName('label');
            if (imageCollection) {
                Array.from(imageCollection).map(function (node) {
                    el.removeChild(node);
                });
            }
            if (labelCollection) {
                Array.from(labelCollection).map(function (node) {
                    el.removeChild(node);
                });
            }
        }
        if (divCollection) {
            Array.from(divCollection).map(function (node) {
                el.removeChild(node);
            });
        }
        el.firstElementChild.classList.remove('hide');
        this.InitiateElementAndReturnId(el, e);
        // keeping separate b/c it of clone..
        this.ApplyDefaultSettings(el, e);
    };
    TemplateBuilderComponent.prototype.allowDrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = true;
    };
    TemplateBuilderComponent.prototype.drag = function (event) {
        if (event.target.id) {
            event.dataTransfer.setData("text", event.target.id);
        }
        else if (!event.target.id && event.target.tagName.toLowerCase() == 'img') {
            event.dataTransfer.setData("text", event.target.parentNode.id);
        }
        else if (!event.target.id && event.target.tagName.toLowerCase() == 'b') {
            event.dataTransfer.setData("text", event.target.parentNode.id);
        }
    };
    TemplateBuilderComponent.prototype.drop = function (event) {
        event.preventDefault();
        this.isDragged = false;
        var id = event.dataTransfer.getData("text");
        var el = document.getElementById(id);
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
            var index = this.elementsList.findIndex(function (x) { return x.id == event.target.id; });
            var indx = this.elementsList.findIndex(function (x) { return x.id == id; });
            var swappingElt = this.elementsList[index];
            this.elementsList[index] = this.elementsList[indx];
            this.elementsList[indx] = swappingElt;
            this.dragFromLayout = false;
            //console.log(this.elementsList);
            // } else {
            //   //console.log("wrong drag");
            // }
        }
        else {
            var node = el.cloneNode(true);
            this.Ondrop(node, event);
        }
    };
    TemplateBuilderComponent.prototype.DragLeave = function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.isDragged = false;
    };
    TemplateBuilderComponent.prototype.InitiateElementAndReturnId = function (el, event) {
        if (!(this.elementsList.filter(function (check) { return check.id && check.id == el.id; }).length > 0)) {
            //common id for each elt.
            el.id = 'elementId' + '-' + Math.random() + '_' + el.id;
            var input_1 = {
                id: el.id,
                type: el.id.split('_')[1],
            };
            if (event.target.tagName.toLowerCase() == 'td' && !event.target.id.includes('section') && !el.id.includes('container') && !el.id.includes('section')) {
                //means in maindiv and independent element.
                this.elementsList.push(input_1);
            }
            else if (event.target.id.includes('section') && !(el.id.includes('container'))) {
                // element inside section
                el.id = 'Insection' + '-' + el.id;
                input_1.id = el.id;
                this.elementsList.map(function (search) {
                    if (search.id == event.target.id.split(':')[0]) {
                        search.childs.map(function (sectionSearch) {
                            if (sectionSearch.id.split(':')[1] == event.target.id.split(':')[1]) {
                                sectionSearch.sectionChilds.push(input_1);
                            }
                        });
                    }
                });
            }
            else {
                //means section
                if (el.firstElementChild.tagName.toLowerCase() == 'table') {
                    input_1.childs = [];
                    var tb = el.firstElementChild;
                    var tbodys = tb.getElementsByTagName("tbody")[0], trs = tbodys.getElementsByTagName("tr");
                    var tds = trs[0].children;
                    for (var i = 0; i < tds.length; i++) {
                        tds[i].id = input_1.id + ':' + 'sectionId' + '-' + Math.random();
                        input_1.childs.push({
                            id: tds[i].id,
                            type: 'section',
                            width: tds[i].getAttribute('width'),
                            sectionChilds: []
                        });
                    }
                    this.elementsList.push(input_1);
                }
                else {
                    this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
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
    };
    TemplateBuilderComponent.prototype.CloneElementAndReturnId = function (el, orgNode, td) {
        el.id = 'elementId' + '-' + Math.random() + '_' + el.id;
        var input = {
            id: el.id,
            type: el.id.split('_')[1],
        };
        //means in maindiv and independent element.
        if (!el.id.includes('container') && !td) {
            this.elementsList.push(input);
        }
        else if (!el.id.includes('container') && td) {
            input.childs = [];
            var EltInSection_1;
            td.sectionChilds.forEach(function (child) {
                if (child.id == orgNode.id) {
                    EltInSection_1 = JSON.parse(JSON.stringify(orgNode));
                    EltInSection_1.id = 'Insection' + '-' + 'elementId' + '-' + Math.random() + '_' + input.type;
                }
            });
            td.sectionChilds.push(EltInSection_1);
            input.childs.push({
                id: td.id,
                type: 'section',
                width: td.width,
                sectionChilds: td.sectionChilds
            });
        }
        else {
            input.childs = [];
            var temp_1;
            el.childs.forEach(function (td, i) {
                var sectionChilds = [];
                td.sectionChilds.forEach(function (child) {
                    temp_1 = JSON.parse(JSON.stringify(child));
                    temp_1.id = 'elementId' + '-' + Math.random() + '_' + child.type;
                    sectionChilds.push(temp_1);
                });
                input.childs.push({
                    id: input.id + ':' + 'sectionId' + '-' + Math.random(),
                    type: 'section',
                    width: el.childs[i].width,
                    sectionChilds: sectionChilds
                });
            });
            this.elementsList.push(input);
        }
    };
    TemplateBuilderComponent.prototype.ApplyDefaultSettings = function (element, event) {
        var _this = this;
        var type = element.id.split('_')[1];
        var generalSettings = {
            'buttonText': this.defaultButtonSettings.buttonText,
            'buttonLink': this.defaultButtonSettings.buttonLink,
            'SocialLinks': this.defaultLinkSettings,
            'paragraphText': this.defaultParaSettings.ParagraphText,
            'imageSrc': this.defaultImageSettings.src,
        };
        //independent element..
        this.elementsList.map(function (inList) {
            if ((inList['id'] == element.id) && type != 'container') {
                var val = _this.DefaultStyling(type);
                inList['parentStyling'] = val.parentStyling;
                inList['childStyling'] = val.childStyling;
                inList['generalSettings'] = generalSettings;
            }
            else {
                if (inList.id.includes('container') && event.target.id.split(':')[0].includes('container')) {
                    inList.childs.map(function (sectionSearch) {
                        if (sectionSearch.sectionChilds && sectionSearch.sectionChilds.length) {
                            sectionSearch.sectionChilds.forEach(function (pushInChild) {
                                if (pushInChild.id == element.id) {
                                    ////console.log("2nd one");
                                    var val = _this.DefaultStyling(type);
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
    };
    TemplateBuilderComponent.prototype.patchValues = function (label, value) {
        return this.formbuilder.group({
            linkType: [label],
            path: [value]
        });
    };
    TemplateBuilderComponent.prototype.DefaultStyling = function (type) {
        var parentStyling = {};
        var childStyling = {};
        Object.assign(parentStyling, this.ParentSettings[type]);
        Object.assign(childStyling, this.ChildSettings[type]);
        return ({ childStyling: childStyling, parentStyling: parentStyling });
    };
    TemplateBuilderComponent.prototype.CloneElement = function (event, node, td) {
        event.preventDefault();
        event.stopImmediatePropagation();
        //change ids to default one.
        var temp = JSON.parse(JSON.stringify(node));
        if (node.id.includes('button')) {
            temp.id = 'button';
        }
        else if (node.id.includes('paragraph')) {
            temp.id = 'paragraph';
        }
        else if (node.id.includes('image')) {
            temp.id = 'image';
        }
        else if (node.id.includes('SocialMediaLinks')) {
            temp.id = 'SocialMediaLinks';
        }
        else if (node.id.includes('separator')) {
            temp.id = 'separator';
        }
        else if (node.id.includes('container1')) {
            temp.id = 'container1';
        }
        else if (node.id.includes('container2')) {
            temp.id = 'container2';
        }
        else if (node.id.includes('container3')) {
            temp.id = 'container3';
        }
        else if (node.id.includes('container4')) {
            temp.id = 'container4';
        }
        this.CloneElementAndReturnId(temp, node, td);
        if (!node.id.includes('container') && !td) {
            //store properties
            var tempParentStyling = node.parentStyling;
            var tempChildStyling = node.childStyling;
            var tempGeneralSettings = node.generalSettings;
            //changed id of cloned node
            var ind = this.elementsList.findIndex(function (x) { return x.id == temp.id; });
            this.elementsList[ind].parentStyling = tempParentStyling;
            this.elementsList[ind].childStyling = tempChildStyling;
            this.elementsList[ind].generalSettings = tempGeneralSettings;
        }
        this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
            data: {
                img: 'ok',
                msg: 'Element Cloned Sucessfully!'
            },
            duration: 2000,
            panelClass: ['user-alert', 'success']
        });
    };
    TemplateBuilderComponent.prototype.MapValues = function (f) {
        var _this = this;
        if (f && f["generalSettings"] && f["childStyling"] && f["parentStyling"]) {
            //for childStyling
            Object.keys(f["childStyling"]).map(function (key) {
                _this.templateForm.controls[key].setValue(f['childStyling'][key]);
                _this.DefaultSettings.ChildSettings[key] = f['childStyling'][key];
            });
            //for parentStyling
            Object.keys(f["parentStyling"]).map(function (key) {
                _this.templateForm.controls[key].setValue(f['parentStyling'][key]);
                _this.DefaultSettings.ParentSettings[key] = f['parentStyling'][key];
            });
            //for generalSettings
            this.templateForm.controls['SocialLinks'] = this.formbuilder.array([]);
            var control_1 = this.templateForm.controls['SocialLinks'];
            if (f["generalSettings"].SocialLinks && f["generalSettings"].SocialLinks.length)
                f["generalSettings"].SocialLinks.forEach(function (x) {
                    control_1.push(_this.patchValues(x.linkType, x.path));
                });
            this.templateForm.controls['buttonText'].setValue(f['generalSettings'].buttonText);
            this.templateForm.controls['buttonLink'].setValue(f['generalSettings'].buttonLink);
            this.templateForm.controls['paragraphText'].setValue(f['generalSettings'].paragraphText);
            this.templateForm.controls['imageSrc'].setValue(f['generalSettings'].imageSrc ? f['generalSettings'].imageSrc : "/assets/img/icons/icons-sprite.svg#attachment");
        }
        //console.log(this.templateForm);
    };
    TemplateBuilderComponent.prototype.CheckAndMapForm = function (list, element, editCase) {
        //console.log(list);
        var _this = this;
        var type = element.id.split('_')[1];
        switch (type) {
            case 'button':
                this.ButtonFlag = true;
                this.ParaFlag = false;
                this.ImageFlag = false;
                this.LinksFlag = false;
                this.divFlag = false;
                break;
            case 'paragraph':
                this.ParaFlag = true;
                this.ButtonFlag = false;
                this.ImageFlag = false;
                this.LinksFlag = false;
                this.divFlag = false;
                break;
            case 'image':
                this.ImageFlag = true;
                this.ParaFlag = false;
                this.ButtonFlag = false;
                this.LinksFlag = false;
                this.divFlag = false;
                break;
            case 'SocialMediaLinks':
                this.LinksFlag = true;
                this.ParaFlag = false;
                this.ButtonFlag = false;
                this.ButtonFlag = false;
                this.divFlag = false;
                break;
            case 'separator':
                this.separatorFlag = true;
                this.ParaFlag = false;
                this.ButtonFlag = false;
                this.LinksFlag = false;
                this.divFlag = false;
                break;
            case 'div':
                this.divFlag = true;
                this.separatorFlag = false;
                this.ParaFlag = false;
                this.ButtonFlag = false;
                this.LinksFlag = false;
        }
        if (element.id == "main_div") {
            if (this.mainObj) {
                Object.keys(this.mainObj).map(function (key) {
                    _this.templateForm.controls[key].setValue(_this.mainObj[key]);
                    _this.DefaultSettings.ContainerSettings[key] = _this.mainObj[key];
                });
            }
            else {
                Object.keys(this.mainContainerSettings).map(function (key) {
                    _this.templateForm.controls[key].setValue(_this.mainContainerSettings[key]);
                    _this.DefaultSettings.ContainerSettings[key] = _this.mainContainerSettings[key];
                });
            }
        }
        else {
            //if it is section elt..
            list.map(function (f) {
                if (f['type'].includes('container')) {
                    f.childs.map(function (search) {
                        //console.log(search.sectionChilds);
                        if (search.id.split(':')[1] == element.parentNode.id.split(':')[1]) {
                            search.sectionChilds.forEach(function (sectionElt) {
                                if (sectionElt.id == element.id) {
                                    _this.MapValues(sectionElt);
                                }
                            });
                        }
                    });
                }
                else {
                    //else independent elt..
                    if (f.id == element.id && (f['generalSettings'] || f['parentStyling'] || f['childStyling'])) {
                        _this.MapValues(f);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });
        }
    };
    TemplateBuilderComponent.prototype.UploadImage = function () {
        var _this = this;
        if (this.file && !this.uploading) {
            this.uploading = true;
            this._uploadingService.SignRequest(this.file, 'uploadBackgroundImage').subscribe(function (response) {
                var params = JSON.parse(response.text());
                params.file = _this.file;
                _this._uploadingService.uploadAttachment(params).subscribe(function (s3response) {
                    if (s3response.status == '201') {
                        _this._uploadingService.parseXML(s3response.text()).subscribe(function (json) {
                            if (_this.currentElement)
                                _this.currentElement.firstElementChild.firstElementChild.src = json.response.PostResponse.Location[0];
                            else
                                _this.editCurrentElement.firstElementChild.firstElementChild.src = json.response.PostResponse.Location[0];
                            _this.uploading = false;
                        }, function (err) {
                            _this.uploading = false;
                        });
                    }
                }, function (err) {
                    _this.uploading = false;
                });
            }, function (err) {
                _this._uploadingService.ShowAttachmentError(JSON.parse(err)).subscribe(function (fileerror) {
                    _this.fileerror = fileerror;
                    if (err) {
                        _this.uploading = false;
                        _this.fileValid = false;
                        setTimeout(function () { return [
                            _this.fileValid = true
                        ]; }, 4500);
                        _this.ClearFile();
                    }
                }, function (err) {
                });
            });
        }
    };
    //for editing main container, which is in this component only.
    TemplateBuilderComponent.prototype.EditElement = function (event, id) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.enableEdit = true;
        this.currentElement = document.getElementById(id);
        //console.log(this.currentElement);
        this.CheckAndMapForm(this.elementsList, this.currentElement);
    };
    TemplateBuilderComponent.prototype.editChangedHandler = function (sentElement) {
        this.enableEdit = sentElement.showPanel;
        this.bindedId = sentElement.id;
        this.currentElement = document.getElementById(this.bindedId);
        //console.log(this.currentElement);
        if (sentElement.showPanel) {
            this.CheckAndMapForm(this.elementsList, this.currentElement);
        }
    };
    TemplateBuilderComponent.prototype.deleteHandler = function (DeleteElement) {
        this.enableEdit = DeleteElement.showPanel;
    };
    TemplateBuilderComponent.prototype.CloneHandler = function (sentElement) {
        if (sentElement.td)
            this.CloneElement(sentElement.event, sentElement.element, sentElement.td);
        else
            this.CloneElement(sentElement.event, sentElement.element);
    };
    TemplateBuilderComponent.prototype.ShowCode = function () {
        this.showCode = !this.showCode;
        var parser = new DOMParser();
        if (this.mainDiv && this.mainDiv.nativeElement) {
            var htmlDoc = parser.parseFromString(this.mainDiv.nativeElement.outerHTML, 'text/html');
            var allButtons = Array.from(htmlDoc.querySelectorAll('.actions'));
            allButtons.forEach(function (x) { return x.remove(); });
            this.previewCode = htmlDoc.body.firstElementChild.outerHTML;
        }
    };
    TemplateBuilderComponent.prototype.ToggleElt = function () {
        this.toggleElement = !this.toggleElement;
    };
    TemplateBuilderComponent.prototype.ToggleCont = function () {
        this.toggleCont = !this.toggleCont;
    };
    TemplateBuilderComponent.prototype.ToggleComp = function () {
        this.toggleComp = !this.toggleComp;
    };
    TemplateBuilderComponent.prototype.ToggleSectionDropdown = function () {
        this.showDropdown = !this.showDropdown;
    };
    TemplateBuilderComponent.prototype.MapToDOM = function (element, val) {
        if (element) {
            if (element.id == 'main_div') {
                this.changeHeading.nativeElement.innerHTML = 'Template Box Width: ' + val.containerWidth + 'px';
                element.style.backgroundImage = 'url(' + val.backgroundImg_Container + ')';
                element.style.backgroundColor = val.backgroundColor_Container;
                element.style.opacity = val.containerimageOpacity;
                element.style.borderWidth = val.borderWidthContainer + 'px';
                if (val.borderStyleContainer == 'none')
                    element.style.borderStyle = 'none';
                else
                    element.style.borderStyle = val.borderStyleContainer;
                element.style.borderColor = val.borderColorContainer;
                element.style.paddingTop = val.paddingContainer_top + 'px';
                element.style.paddingBottom = val.paddingContainer_bottom + 'px';
                element.style.paddingLeft = val.paddingContainer_left + 'px';
                element.style.paddingRight = val.paddingContainer_right + 'px';
                element.style.marginTop = val.marginContainer_top + 'px';
                element.style.marginBottom = val.marginContainer_bottom + 'px';
                element.style.marginLeft = val.marginContainer_left + 'px';
                element.style.marginRight = val.marginContainer_right + 'px';
                element.style.backgroundRepeat = val.backgroundRepeat_Container;
                element.style.backgroundPositionX = val.backgroundPositionX_Container;
                element.style.backgroundPositionY = val.backgroundPositionY_Container;
                if (val.backgroundSize_Container == '%') {
                    element.style.backgroundSize = val.backgroundSizePercent_Container + '%';
                }
                else
                    element.style.backgroundSize = val.backgroundSize_Container;
            }
            else {
                //Parent Mapping..
                element.style.backgroundColor = val.backgroundColorParent;
                if (val.borderParent_style == 'none')
                    element.style.borderStyle = 'none';
                else
                    element.style.border = val.borderParent_width + 'px' + ' ' + val.borderParent_style + ' ' + val.borderParent_color;
                element.style.paddingTop = val.paddingParent_top + 'px';
                element.style.paddingBottom = val.paddingParent_bottom + 'px';
                element.style.paddingLeft = val.paddingParent_left + 'px';
                element.style.paddingRight = val.paddingParent_right + 'px';
                element.style.marginTop = val.marginParent_top + 'px';
                element.style.marginBottom = val.marginParent_bottom + 'px';
                element.style.marginLeft = val.marginParent_left + 'px';
                element.style.marginRight = val.marginParent_right + 'px';
                element.style.textAlign = val.textAlignParent ? val.textAlignParent.toString() : 'left';
                if (element.id.split('_')[1] == 'paragraph') {
                    element.firstElementChild.innerHTML = val.paragraphText;
                    if (val.scaleTypeChild == 'px')
                        element.firstElementChild.style.width = val.button_WidthChild + 'px';
                    else if ((val.scaleTypeChild == '%'))
                        element.firstElementChild.style.width = val.button_WidthChild + '%';
                    else if (val.scaleTypeChild == 'auto')
                        element.firstElementChild.style.width = 'auto';
                }
                if (element.id.split('_')[1] == 'button') {
                    element.firstElementChild.innerText = val.buttonText;
                    element.firstElementChild.style.fontSize = val.button_FontSizeChild + 'px';
                    if ((val.scaleTypeChild == 'px') && !element.id.includes('image'))
                        element.firstElementChild.style.width = val.button_WidthChild + 'px';
                    else if ((val.scaleTypeChild == '%') && !element.id.includes('image'))
                        element.firstElementChild.style.width = val.button_WidthChild + '%';
                    else if (val.scaleTypeChild == 'auto')
                        element.firstElementChild.style.width = 'auto';
                    element.firstElementChild.style.display = 'inline-block';
                    element.firstElementChild.style.color = val.textColorChild;
                }
                if ((val.scaleTypeChild == 'px') && !element.id.includes('image'))
                    element.firstElementChild.style.width = val.button_WidthChild + 'px';
                else if ((val.scaleTypeChild == '%') && !element.id.includes('image'))
                    element.firstElementChild.style.width = val.button_WidthChild + '%';
                else if ((val.scaleTypeChild == 'auto') && !element.id.includes('image'))
                    element.firstElementChild.style.width = 'auto';
                element.firstElementChild.style.borderRadius = val.borderRadiusChild + 'px';
                if (element.id.includes('SocialMediaLinks')) {
                    Array.from(element.querySelectorAll("a")).forEach(function (linkStyle) {
                        linkStyle.firstElementChild.style.paddingTop = val.paddingChild_top + 'px';
                        linkStyle.firstElementChild.style.paddingBottom = val.paddingChild_bottom + 'px';
                        linkStyle.firstElementChild.style.paddingLeft = val.paddingChild_left + 'px';
                        linkStyle.firstElementChild.style.width = val.button_WidthChild + val.scaleTypeChild;
                        linkStyle.firstElementChild.style.paddingRight = val.paddingChild_right + 'px';
                        if (val.borderChild_style == 'none')
                            linkStyle.firstElementChild.style.borderStyle = 'none';
                        else
                            linkStyle.firstElementChild.style.border = val.borderChild_width + 'px' + ' ' + val.borderChild_style + ' ' + val.borderChild_color;
                        linkStyle.firstElementChild.style.backgroundColor = val.colorChild;
                        linkStyle.firstElementChild.style.borderRadius = val.borderRadiusChild + 'px';
                    });
                }
                else if (element.id.includes('image')) {
                    if (val.scaleTypeChild == 'px')
                        element.firstElementChild.firstElementChild.style.width = val.button_WidthChild + 'px';
                    else if (val.scaleTypeChild == '%')
                        element.firstElementChild.firstElementChild.style.width = val.button_WidthChild + '%';
                    else if (val.scaleTypeChild == 'auto')
                        element.firstElementChild.firstElementChild.style.width = 'auto';
                    element.firstElementChild.firstElementChild.src = val.imageSrc;
                    element.firstElementChild.firstElementChild.style.backgroundColor = val.colorChild;
                    element.firstElementChild.firstElementChild.style.border = val.borderChild_width + 'px' + ' ' + val.borderChild_style + ' ' + val.borderChild_color;
                    element.firstElementChild.firstElementChild.style.paddingTop = val.paddingChild_top + 'px';
                    element.firstElementChild.firstElementChild.style.paddingBottom = val.paddingChild_bottom + 'px';
                    element.firstElementChild.firstElementChild.style.paddingLeft = val.paddingChild_left + 'px';
                    element.firstElementChild.firstElementChild.style.paddingRight = val.paddingChild_right + 'px';
                    if (val.scaleTypeChild == 'px')
                        element.firstElementChild.firstElementChild.style.width = val.button_WidthChild + 'px';
                    else if (val.scaleTypeChild == '%')
                        element.firstElementChild.firstElementChild.style.width = val.button_WidthChild + '%';
                    else if (val.scaleTypeChild == 'auto')
                        element.firstElementChild.firstElementChild.style.width = 'auto';
                }
                else {
                    if (!element.id.includes('image'))
                        element.firstElementChild.style.backgroundColor = val.colorChild;
                    if (val.borderChild_style == 'none')
                        element.firstElementChild.style.borderStyle = 'none';
                    else
                        element.firstElementChild.style.border = val.borderChild_width + 'px' + ' ' + val.borderChild_style + ' ' + val.borderChild_color;
                    element.firstElementChild.style.paddingTop = val.paddingChild_top + 'px';
                    element.firstElementChild.style.paddingBottom = val.paddingChild_bottom + 'px';
                    element.firstElementChild.style.paddingLeft = val.paddingChild_left + 'px';
                    element.firstElementChild.style.paddingRight = val.paddingChild_right + 'px';
                }
                // if (element.id.includes('image')) {
                // }
            }
        }
    };
    TemplateBuilderComponent.prototype.ChangeImgAndHref = function (ParticularLink, index) {
        var _this = this;
        //If: when icon already exists and you are editing it
        if (!this.element.children[index].className.includes("actions")) {
            this.element.children[index].childNodes[1].src = this.links[ParticularLink.controls['linkType'].value];
        }
        //Else: when icon not exists, and you are cloning it.
        else {
            var node = this.element.children[0].cloneNode(true);
            node.href = ParticularLink.controls['path'].value;
            node.firstElementChild.src = this.links[ParticularLink.controls['linkType'].value];
            var ind = this.elementsList.findIndex(function (x) { return x.id == _this.element.id; });
            var temp_2 = {
                linkType: ParticularLink.controls['linkType'].value,
                path: ParticularLink.controls['path'].value
            };
            this.elementsList[ind].generalSettings.SocialLinks.push(temp_2);
        }
    };
    TemplateBuilderComponent.prototype.LinkChange = function (index) {
        var ParticularLink = this.templateForm.get('SocialLinks').controls[index];
        this.ChangeImgAndHref(ParticularLink, index);
    };
    TemplateBuilderComponent.prototype.DisableInput = function (event) {
        event.preventDefault();
    };
    TemplateBuilderComponent.prototype.ColorChange = function (event, data) {
        this.templateForm.get(event).setValue(this._emailTemplateService.RGBAToHexAString(data));
    };
    TemplateBuilderComponent.prototype.FontWeight = function () {
        var _this = this;
        this.bold = !this.bold;
        if (!this.currentElement.id.includes('Insection')) {
            var ind = this.elementsList.findIndex(function (x) { return x.id == _this.currentElement.id; });
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
            this.elementsList.map(function (search) {
                search.childs.forEach(function (sectionSearch) {
                    sectionSearch.sectionChilds.forEach(function (sectionElt) {
                        if (sectionSearch.id.split(':')[1] == _this.currentElement.parentNode.id.split(':')[1]) {
                            if (_this.bold) {
                                _this.templateForm.get('fontWeightChild').setValue('bold');
                                sectionElt.childStyling.fontWeightChild = 'bold';
                            }
                            else {
                                _this.templateForm.get('fontWeightChild').setValue('');
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
    };
    TemplateBuilderComponent.prototype.FontStyle = function () {
        var _this = this;
        this.italic = !this.italic;
        //console.log(this.currentElement.id);
        if (!this.currentElement.id.includes('Insection')) {
            var ind = this.elementsList.findIndex(function (x) { return x.id == _this.currentElement.id; });
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
            this.elementsList.map(function (search) {
                search.childs.forEach(function (sectionSearch) {
                    sectionSearch.sectionChilds.forEach(function (sectionElt) {
                        if (sectionSearch.id.split(':')[1] == _this.currentElement.parentNode.id.split(':')[1]) {
                            if (_this.italic) {
                                _this.templateForm.get('fontStyleChild').setValue('italic');
                                sectionElt.childStyling.fontStyleChild = 'italic';
                            }
                            else {
                                _this.templateForm.get('fontStyleChild').setValue('italic');
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
    };
    TemplateBuilderComponent.prototype.FileSelected = function () {
        var _this = this;
        this.fileValid = true;
        if (event.target.files[0]) {
            this.file = event.target.files[0];
            // this.readURL(this.file);
            return;
        }
        else {
            this.fileValid = false;
            this.ClearFile();
            setTimeout(function () { return [
                _this.fileValid = true
            ]; }, 3000);
        }
        this.file = undefined;
        return;
    };
    TemplateBuilderComponent.prototype.ClearFile = function () {
        this.file = undefined;
        this.fileInput.nativeElement.value = '';
        this.uploading = false;
    };
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
    TemplateBuilderComponent.prototype.SaveEdit = function (ev) {
        var _this = this;
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        this.mainObj = {};
        if (this.currentElement.id == "main_div") {
            Object.keys(this.templateForm.controls).map(function (key) {
                if (key.includes('Container') || key.includes('container')) {
                    _this.mainObj[key] = _this.templateForm.controls[key].value;
                }
            });
        }
        else {
            this.MapToList(this.currentElement, this.elementsList);
        }
        this.enableEdit = false;
    };
    TemplateBuilderComponent.prototype.GetLinks = function (i) {
        var actionList = {
            'Facebook': '',
            'LinkedIn': '',
            'Twitter': '',
            'Youtube': '',
            'Instagram': ''
        };
        var actions = this.templateForm.get('SocialLinks');
        actions.controls.map(function (control, index) {
            if (actionList[actions.controls[index].get('linkType').value] && index != i)
                delete actionList[actions.controls[index].get('linkType').value];
        });
        return actionList;
    };
    TemplateBuilderComponent.prototype.ResetToDefault = function () {
        var _this = this;
        if (this.currentElement.id == "main_div") {
            Object.keys(this.mainContainerSettings).map(function (key) {
                _this.templateForm.controls[key].setValue(_this.mainContainerSettings[key]);
                _this.DefaultSettings.ContainerSettings[key] = _this.mainContainerSettings[key];
            });
        }
        else {
            var type = this.currentElement.id.split('_')[1];
            var val = this.DefaultStyling(type);
            var index = this.elementsList.findIndex(function (x) { return x.id == _this.currentElement.id; });
            this.elementsList[index].parentStyling = val.parentStyling;
            this.elementsList[index].childStyling = val.childStyling;
        }
        //console.log(this.elementsList);
        this.enableEdit = false;
    };
    // confirm() {
    // 	console.log(this.elementsList);
    // 	if (this.update) return true;
    // 	// if(this.cancel) return false;
    // 	else return !(this.elementsList && this.elementsList.length)
    // }
    TemplateBuilderComponent.prototype.SaveTemplate = function () {
        var _this = this;
        if (this.all_templates && this.all_templates.filter(function (data) { return data.templateName == _this.template_name.toLowerCase(); }).length > 0) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
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
            var allButtons = this.mainDiv.nativeElement.querySelectorAll('.actions');
            allButtons.forEach(function (x) { return x.remove(); });
            var TextClasses = this.mainDiv.nativeElement.querySelectorAll('.textClass');
            TextClasses.forEach(function (x) { return x.remove(); });
            var noElementRemove = this.mainDiv.nativeElement.querySelectorAll('.no-elements');
            noElementRemove.forEach(function (el) { return el.classList.remove("no-elements"); });
            var removeClass = this.mainDiv.nativeElement.querySelectorAll('.no-pointer');
            removeClass.forEach(function (el) { return el.classList.remove("no-pointer"); });
            var html = this._emailTemplateService.SetCodeAndReturn(this.mainDiv.nativeElement.outerHTML);
            var obj = {
                sourceType: this.params.type,
                templateName: this.template_name,
                nsp: this.nsp,
                html: html,
                lastModified: {},
                createdDate: new Date().toISOString(),
                createdBy: this.email,
                createdElements: this.elementsList,
                main_Div: this.mainObj
            };
            this._emailTemplateService.insertEmailTemplate(obj).subscribe(function (response) {
                if (response.status == "ok") {
                    _this.template_name = '';
                    _this.elementsList = [];
                    _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
                }
            });
        }
    };
    TemplateBuilderComponent.prototype.SaveAsFile = function () {
        var data = this.CopyOfTarget();
        var result = this._emailTemplateService.SetCodeAndReturn(data);
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
        a.setAttribute('download', 'TemplateLayout.html');
        a.remove();
        a.click();
    };
    TemplateBuilderComponent.prototype.CopyOfTarget = function () {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(this.mainDiv.nativeElement.outerHTML, 'text/html');
        var allButtons = Array.from(htmlDoc.querySelectorAll('.actions'));
        allButtons.forEach(function (x) { return x.remove(); });
        var TextClasses = Array.from(htmlDoc.querySelectorAll('.textClass'));
        TextClasses.forEach(function (x) { return x.remove(); });
        var allDropText = Array.from(htmlDoc.querySelectorAll('.no-elements'));
        allDropText.forEach(function (x) { return x.remove(); });
        var removeClass = Array.from(htmlDoc.querySelectorAll('.no-pointer'));
        removeClass.forEach(function (el) { return el.classList.remove("no-pointer"); });
        var noElementRemove = Array.from(htmlDoc.querySelectorAll('.no-elements'));
        noElementRemove.forEach(function (el) { return el.classList.remove("no-elements"); });
        var droppableclass = Array.from(htmlDoc.querySelectorAll('.elements-droppable'));
        droppableclass.forEach(function (el) { return el.classList.remove("elements-droppable"); });
        return htmlDoc.body.firstElementChild.outerHTML;
    };
    TemplateBuilderComponent.prototype.UpdateTemplate = function () {
        var _this = this;
        this.update = true;
        var allButtons = this.mainDiv.nativeElement.querySelectorAll('.actions');
        allButtons.forEach(function (x) { return x.remove(); });
        this.mainDiv.nativeElement.style.width = this.mainObj && this.mainObj.containerWidth ? this.mainObj.containerWidth + 'px' : this.mainContainerSettings.containerWidth + 'px';
        this.mainObj = this.mainObj && this.mainObj.length ? this.mainObj : this.mainContainerSettings;
        var noElementRemove = this.mainDiv.nativeElement.querySelectorAll('.no-elements');
        noElementRemove.forEach(function (el) { return el.classList.remove("no-elements"); });
        var TextClasses = this.mainDiv.nativeElement.querySelectorAll('.textClass');
        TextClasses.forEach(function (x) { return x.remove(); });
        var removeClass = this.mainDiv.nativeElement.querySelectorAll('.no-pointer');
        removeClass.forEach(function (el) { return el.classList.remove("no-pointer"); });
        this.previewCode = this._emailTemplateService.SetCodeAndReturn(this.mainDiv.nativeElement.outerHTML);
        var obj = {
            sourceType: this.selectedTemplate.type,
            templateName: this.template_name,
            nsp: this.nsp,
            html: this.previewCode,
            lastModified: {},
            createdDate: '',
            createdBy: '',
            createdElements: this.elementsList,
            main_Div: this.mainObj
        };
        this._emailTemplateService.UpdateTemplate(this.selectedTemplate._id, obj).subscribe(function (response) {
            if (response.status == "ok") {
                _this._emailTemplateService.selectedTemplate.next(undefined);
                _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
            }
        });
    };
    TemplateBuilderComponent.prototype.Cancel = function () {
        var _this = this;
        if (this.templateChanges || this.template_name || (this.elementsList && this.elementsList.length)) {
            this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                panelClass: ['confirmation-dialog'],
                data: { headermsg: 'Are you sure want to exit?' }
            }).afterClosed().subscribe(function (data) {
                if (data == 'ok') {
                    _this._emailTemplateService.selectedTemplate.next(undefined);
                    _this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
                    _this.elementsList = [];
                    _this.templateForm.reset();
                }
            });
        }
        else {
            console.log('template builder else');
            this._emailTemplateService.selectedTemplate.next(undefined);
            this._globalStateService.NavigateTo('/settings/ticket-management/bulk-marketing-email');
            this.elementsList = [];
            this.templateForm.reset();
        }
    };
    TemplateBuilderComponent.prototype.dragged = function (elt) {
        //console.log(elt.target.id);
        this.dragFromLayout = true;
        elt.dataTransfer.setData("text", elt.target.id);
        elt.dataTransfer.effectAllowed = "move";
    };
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
    TemplateBuilderComponent.prototype.CancelEdit = function () {
        this.enableEdit = false;
    };
    TemplateBuilderComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (res) {
            res.unsubscribe();
        });
        this._emailTemplateService.selectedTemplate.next(undefined);
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], TemplateBuilderComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.ViewChild('preview')
    ], TemplateBuilderComponent.prototype, "preview", void 0);
    __decorate([
        core_1.ViewChild('mainDiv')
    ], TemplateBuilderComponent.prototype, "mainDiv", void 0);
    __decorate([
        core_1.ViewChild('changeHeading')
    ], TemplateBuilderComponent.prototype, "changeHeading", void 0);
    TemplateBuilderComponent = __decorate([
        core_1.Component({
            selector: 'app-template-builder',
            templateUrl: './template-builder.component.html',
            styleUrls: ['./template-builder.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TemplateBuilderComponent);
    return TemplateBuilderComponent;
}());
exports.TemplateBuilderComponent = TemplateBuilderComponent;
//# sourceMappingURL=template-builder.component.js.map