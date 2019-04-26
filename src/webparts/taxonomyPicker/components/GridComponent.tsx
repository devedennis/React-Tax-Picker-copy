import * as React from 'react';
import cleanArray from './TaxonomyPicker';

/*export default class GridComponent extends React.Component {
    render() {
        return(
            <div>
                <table>
                    <tr><th>Name</th><th>Team</th><th>Score</th></tr>
                    ${cleanArray.forEach(x => {
                        <tr><td></td></tr>
                    })}
                </table>
                </div>
        );
    }
}*/

export default class GridComponent extends React.Component<cleanArray> {
    constructor(props){
        super(props);

        this.state={
            cArray:[]
        };
    }
    public componentDidMount(): void{
        var reactHandler = this;
        reactHandler.setState({
            cArray:cleanArray
        });
        //cArray:cleanArray;
    }

    render(){
        return(
            <div>
                <table>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Score
                        </th>
                        <th>
                            Team
                        </th>
                        <th>
                            Skills
                        </th>
                    </tr>
                    <tr>
                        {/*{cleanArray(x=> { <tr><td>x.Name</td><td>x.Score</td><td>x.Team</td><td></td></tr>})}*/}
                       
                    </tr>
                </table>
            </div>
        )
    }
}