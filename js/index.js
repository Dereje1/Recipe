var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var ControlLabel = ReactBootstrap.ControlLabel ;

class Main extends React.Component{
  constructor(props){
    super(props)
    this.state=
        {
          "Pumpkin Pie":["Pumpkin Puree","Sweetened Condensed Milk","Eggs","Pumpkin Pie Spice","Pie Crust"],
          "Spaghetti":["Noodles","Tomato Sauce","(Optional) Meatballs"],
          "Onion Pie":["Onion","Pie Crust","Sounds Yummy right?"]
        }

      this.myCallBack=this.myCallBack.bind(this)
  }

 myCallBack(change){
   if(change){
     console.log(this.state)
     var x=change.newIngridients.split(',')
     x=x.filter(function(i){
       if(i){return i;}
     })
     this.setState({ [change.recipeName]: x})
   }
   else{
     this.forceUpdate();
   }
 }
  render(){
    return(
      <div>
        <Recipe current={this.state} callBackFromMain={this.myCallBack} ></Recipe>
        <Button bsStyle="primary" bsSize="large">Add Recipe</Button>
      </div>
    )
  }
}

class Recipe extends React.Component{
  constructor(props){
    super(props)
    this.deleteRecipe=this.deleteRecipe.bind(this)
  }
  deleteRecipe(r){

    delete this.props.current[r]
    this.props.callBackFromMain();
    //this.props.callBackFromMain=this.props.current
  }

  editRecipe(newIngridients){
    this.props.callBackFromMain(newIngridients);
  }

  hashRecipe(currentState){
    var recipes = Object.keys(currentState).slice();
    var x=recipes.map(r=>{
      return(
        <article className="well">
          <h1 className="recipeName">{r}</h1>
          <Ingredients ingrid={currentState[r]}/>
          <Button key={"Delete" + r} onClick={()=>this.deleteRecipe(r)} className="btn btn-danger">Delete</Button>
          <UserModal editInfo={[r,currentState[r]]} callBackFromRecipe={(newIngridients)=>this.editRecipe(newIngridients)}>Edit</UserModal>
        </article>
      )
    })
    return x;
  }
  render(){
    return(
      <div>
        {this.hashRecipe(this.props.current)}
      </div>
    )
  }
}
class Ingredients extends React.Component{
  listParser(ings){
    var z=[]
    for(var i=0;i<ings.length;i++){
      z.push(
        <li className="list-group-item">{ings[i]}</li>
      )
    }
    return z;
  }

  render(){
    return(
          <ul className="list-group">
            {this.listParser(this.props.ingrid)}
          </ul>
    )

  }

}

class UserModal extends React.Component{
  constructor(props){
    super(props)
    this.state={
      show:false,
      recipeName:'',
      oldIngridients:'',
      newIngridients:''
    }
    this.open=this.open.bind(this)
    this.close=this.close.bind(this)
    this.update=this.update.bind(this)
    this.handleChange=this.handleChange.bind(this)
  }
  open(){
    this.setState({
      show:true,
      recipeName:this.props.editInfo[0],
      oldIngridients:this.props.editInfo[1]
    })
  }
  close(){
    this.setState({
      show: false,
      recipeName:'',
      oldIngridients:'',
      newIngridients:''
    });
  }
  update(){
    this.props.callBackFromRecipe(this.state);
    //console.log(this)
    this.close();
  }
  handleChange(e){
    e.preventDefault()
    this.setState({ newIngridients: e.target.value});
  }
  render(){

    return(
      <div>
      <Button className="btn btn-info" onClick={() => this.open()}>Edit</Button>
      <div className="modal-container">
        <Modal
          show={this.state.show}
          onHide={this.close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">{"Editing Ingredients For " + this.state.recipeName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <FormGroup
              controlId="formBasicText"
            >
              <ControlLabel>Working example with validation</ControlLabel>
              <FormControl
                type="text"
                defaultValue={this.state.oldIngridients}
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
          </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.update} className="btn btn-info">Edit Recipe</Button><Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById("app")
)
