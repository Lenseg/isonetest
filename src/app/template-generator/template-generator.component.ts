import { Compiler, Component, NgModule, OnInit, ViewChild,
  ViewContainerRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'

@Component({
  selector: 'app-template-generator',
  template: '<div #container></div>',
  styleUrls: ['./template-generator.component.css']
})
export class TemplateGeneratorComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  @Input() templateModelUrl : string;
  constructor(private http:HttpClient, private compiler: Compiler) { }

  ngOnInit() {
    this.http.get(this.templateModelUrl).
    subscribe(templateModel => this.addComponent(this.generateTemplate(templateModel)));
  }
  generateTemplate (templateModel) :string {
    return this.generateDom(templateModel).outerHTML;
  }
  generateDom(templateModel){
    let template:any;
    if(templateModel.text){
      return document.createTextNode(templateModel.text);
    }
    template =  document.createElement(templateModel.tag);
    for(let attr in templateModel.attributes ){
      template.setAttribute(attr,templateModel.attributes[attr]);
    }
    for(let child in templateModel.content ){
      template.appendChild(this.generateDom(templateModel.content[child]));
    }
    return template;
  }
  private addComponent(template: string) {
    @Component({template: template})
    class TemplateComponent {}

    @NgModule({declarations: [TemplateComponent]})
    class TemplateModule {}

    const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
    const factory = mod.componentFactories.find((comp) =>
      comp.componentType === TemplateComponent
    );
    const component = this.container.createComponent(factory);
  }
}
