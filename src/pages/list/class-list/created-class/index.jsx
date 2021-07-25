import React  from 'react' ;
import { getLocalData, Request } from '../../../../component/service/axios-service';
import { getDictationbyCode } from '../../../../component/service/direction-service';
import { Link } from 'react-router-dom';

import "../index.scss"
import ClassList from '..';
import { checkRight, errorRight } from '../../../../component/service/menu-service';

class CreatedClass extends React.Component {
  constructor(props) {
    super(props);
    if(!checkRight('getCreatedClass')) {
      errorRight();
    }
    this.state={
      'list':[],
      'current':'created'
    }
    Request('GET','/ajax/createlist/'+getLocalData('user').userId).then((response)=> {
      const {data} = response.data;
      this.setState({
        'list':data || []
      });
    })
  }

  render() {

    return (
    <ClassList current={this.state.current} hasOptions={true} list={this.state.list} isSelection={true} hasDeleted={true} />
  );
  }
}

export default CreatedClass;
