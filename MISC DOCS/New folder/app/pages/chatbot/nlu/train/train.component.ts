import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ChatBotService } from '../../../../../services/ChatBotService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nlu-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NluTrainComponent implements OnInit {
  subscriptions: Subscription[] = [];
  intent_list = [];
  t_phrase_list = [];
  entities_list = [];
  synonym_list = [];
  regex_list = [];

  rasaJSON : any;

// href_data = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.rasaJSON));

ngOnDestroy() {
  // Called once, before the instance is destroyed.
  // Add 'implements OnDestroy' to the class.
  this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
  })

}
  constructor(private BotService:ChatBotService, private router : Router) {
    this.subscriptions.push(BotService.getIntent().subscribe(data => {
      this.intent_list = data;
      }));

    this.subscriptions.push(BotService.getTPhrase().subscribe(data => {
      this.t_phrase_list = data;
    }));
  
    this.subscriptions.push(BotService.getEntity().subscribe(data => {
      this.entities_list = data;

    }));
   
    this.subscriptions.push(BotService.getSynonym().subscribe(data => {
      this.synonym_list = data;

    }));


    this.subscriptions.push(BotService.getRegex().subscribe(data => {
      this.regex_list = data;

    }));

    this.subscriptions.push(BotService.rasa_JSON.subscribe(data => {
      this.rasaJSON = data;
    }));
   
  
  
  }

  ngOnInit() {
    
  }
  ngAfterViewInit(){
    
    // this.createCustomJSON();
    
    setTimeout(() => {
      this.createCustomJSON();
    }, 1000);
  }

  back(){
    this.router.navigateByUrl('/chatbot/nlu');
  }
  createCustomJSON(){

    let commonexamples = [];
    let entity_synonyms = [];

    let regex_features = [];
    // console.log(this.entities_list)
    let phrase_list = JSON.parse(JSON.stringify(this.t_phrase_list));
    let entities_list = JSON.parse(JSON.stringify(this.entities_list));
    let synonym_list = JSON.parse(JSON.stringify(this.synonym_list));
    let regex_list = JSON.parse(JSON.stringify(this.regex_list));
    this.intent_list.forEach(i => {
      let phrases = phrase_list.filter(t => t.intent_id == i._id);
    //  console.log(phrase);
      if(phrases.length){
        phrases.forEach(phrase => {
          phrase.entities.forEach((element, index) => {
            
            if(entities_list.filter(e => e._id == element.entity).length){
              element.entity = entities_list.filter(e => e._id == element.entity)[0].entity_name;
            }else{
              phrase.entities.splice(index,1);
            }
          });
          phrase.entities.filter(e => {
            delete e['id'];
            delete e['entity_del'];
          });
          commonexamples.push({
            intent: i.name,
            entities: phrase.entities,
            text : phrase.text.toLowerCase()
          });
        });
      }      
    });


  this.synonym_list.forEach(p=>{
    if(p.synonyms.length){
      entity_synonyms.push({
        value: p.entity_value,
        synonyms: p.synonyms
      });
    }
  });

  this.regex_list.forEach(p=>{
    if(p.regex.length){
      regex_features.push({
        name: p.regex_value,
        pattern: JSON.parse(JSON.stringify(p.regex[0]))
      });
    }
  });
  
    this.rasaJSON.rasa_nlu_data.common_examples = commonexamples;
    this.rasaJSON.rasa_nlu_data.entity_synonyms = entity_synonyms;
    this.rasaJSON.rasa_nlu_data.regex_features =  regex_features;
    
    this.BotService.setRasaJSON(this.rasaJSON);
    //console.log(this.rasaJSON);
    
    //this.downloadObjectAsJson(this.rasaJSON,'data');
   // console.log(this.t_phrase_list);
  
  }

  downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  // Execute(){
  //   this.BotService.ExecuteNlu(this.rasaJSON).subscribe();
  // }
}
