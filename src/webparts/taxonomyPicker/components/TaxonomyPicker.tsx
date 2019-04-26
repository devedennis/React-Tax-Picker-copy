import * as React from 'react';
import styles from './TaxonomyPicker.module.scss';
import { ITaxonomyPickerProps } from './ITaxonomyPickerProps';
import { escape, findIndex } from '@microsoft/sp-lodash-subset';
// Controls
import TermsPickerComponent, { ITaxonomyTerm } from './TermsPickerComponent';
import { DefaultButton, IButtonProps, Button } from 'office-ui-fabric-react/lib/Button';
import { Search, List, Items } from '@pnp/sp';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as jquery from 'jquery';
import { ListItem } from '../TaxonomyPickerWebPart';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { render } from 'react-dom';
import  GridComponent  from './GridComponent'
export interface ITaxonomyPickerWebpartState {
  SingleSelectFieldTerms: ITaxonomyTerm[],
  MultiSelectFieldTerms: ITaxonomyTerm[]
}

/* Export ITaxonomyPickerWebpartState to use the props mentioned above*/
export default class TaxonomyPicker extends React.Component<ITaxonomyPickerProps, ITaxonomyPickerWebpartState> {
  public termstoreapplname: string = this.props.TermStoreApplication;
  public termsetName: string = this.props.TermSetName;
  public wpName: string = this.props.WebpartName;
  public spContext: WebPartContext = this.props.myContext;

  constructor(props, state: ITaxonomyPickerWebpartState) {
    super(props);

    this.state = {
      SingleSelectFieldTerms: [],
      MultiSelectFieldTerms: []

      //Supply array in the below format for a pre-populated control.
      //SingleSelectFieldTerms:[{name:"<Term-Label>", key="<Term-GUID>"}],
      //MultiSelectFieldTerms:[{name:"<Term-Label>", key="<Term-GUID>"}, {name:"<Term-Label>", key="<Term-GUID>"}]
    }

  }
  

  public render(): React.ReactElement<ITaxonomyPickerProps> {
    
    return (
      <div>
        <div className={ styles.WebpartHeading }>{escape(this.props.WebpartName)}</div>
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-lg12">
              <TermsPickerComponent IsMultiValue={true} TermSetId='<TERM-SET-ID>' LabelText='Choose skills to search' SelectedTerms={this.state.MultiSelectFieldTerms} />
            </div>
          </div>
        </div>
        <DefaultButton
          primary={true}
          text="Search"
          onClick={this._showTaxonomyControlValues.bind(this)}
        />
        <br/>
        <br/>
        <div className={styles.container}>
            {/* <table className={styles["ms-Grid"]} id="resultat">

            </table> */}
          </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    );
  }
  

  private _showTaxonomyControlValues() {

    if (this.state.MultiSelectFieldTerms.length > 0 ) {
      let multiSelectValues = this.state.MultiSelectFieldTerms.map(trm => {
        return {name: trm.name, key: trm.key }
      })
      console.log("1.1 selected values:");
      console.log(multiSelectValues);
      this.search(multiSelectValues)
    }
  }

  

  public search(pickedTerms){
    console.log(pickedTerms);
    let resultsArr : Array<ListItem> = [];
    var cleanArray = [];

    jquery.ajax({ 
      url: `${this.spContext.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Profiles')/items`,
      type: "GET", 
      headers:{'Accept': 'application/json; odata=verbose;'}, 
      success: function(resultData) { 
        console.log('Results=');
        console.log(resultData);
        debugger;
        resultData.d.results.forEach(function(item){ 
          let skill = [];
         (item.Skills.results).forEach(function(res){
            pickedTerms.forEach(function(r){
             if(res.TermGuid === r.key){
               skill.push(res)
              }
              resultsArr.push({
                'title':item.Title,
                'teams':item.Team,
                'skills':skill,
                'ID': item.ID
            })
         })
        });
       })
       
       var obj = {};
       for ( var i=0, len=resultsArr.length; i < len; i++ )
           obj[resultsArr[i]['ID']] = resultsArr[i];
       
        resultsArr = new Array();
       for ( var key in obj )
            resultsArr.push(obj[key]);

            resultsArr.forEach(function(res){
                if(!(res.skills.length <= 0))
                {
                  cleanArray.push({'Name': res.title, 'Team': res.teams, 'Skills': res.skills, 'Score': (res.skills.length / pickedTerms.length) * 100 + '%'});
                }
            })

       console.log("Object Matached-" + cleanArray);
       console.log("cleanArray");
       console.log(cleanArray);

       cleanArray.sort((a,b) => (a.Score > b.Score) ? -1 : 1)
        let content = "";
        
        cleanArray.forEach(x => { 
          let competences = "";
            (x.Skills).forEach(s =>{
              competences += s.Label+" ";
                })
                competences.trim()
                  content += `<tr><td>${x.Name}</td><td>${x.Team}</td><td>${x.Score}</td><td>${competences}</td></tr>`
      })

       //document.getElementById('resultat').innerHTML = `<tr><th>Name</th><th>Team</th><th>Score</th><th>Matched skills</th></tr>` + content;
       
       console.log("content: ");
       console.log(content);

      },  
      error : function(jqXHR, textStatus, errorThrown) {
        alert('Error as-'+textStatus);
        console.log("Error in Console - "+errorThrown); 
      }
      

  });

  }
}
